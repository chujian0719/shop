<template>
    <div class="addressEdit">
        <div class="info-item">
            <text class="item-label">收货人</text>
            <input class="item-input" type="text" :value="receive_name" @change="changeValue('receive_name')"/>
        </div>
        <div class="info-item">
            <text class="item-label">联系电话</text>
            <input class="item-input" type="text" :value="receive_phone" @change="changeValue('receive_phone')"/>
        </div>
        <div class="info-item" @click="openCityBoxHandle">
            <text class="item-label">选择地区</text>
            <text class="district-text">{{'北京市北京市朝阳区'}}</text>
        </div>
        <div class="textarea-box">
            <textarea class="item-textarea"
                      rows="4"
                      :value="address"
                      @change="changeValue('address')">
            </textarea>
        </div>
        <div class="info-item">
            <text class="set-text">设为默认</text>
        </div>
        <text class="common-footer addressEdit-footer" @click="openCityPicker">保存地址</text>
        <div class="cover" ref="cover" @click="closeCityBoxHandle"></div>
        <div class="picker" ref="picker">
            <text class="picker-header">选择地区</text>
            <div class="picker-content">
                <div class="content-item">
                    <div class="content-cover"></div>
                    <div
                            :style="{transform:`translateY(${translateY})`}"
                            @panstart="panStart"
                            @panmove="panMove"
                            @panend="panEnd"
                            ref="content-list"
                            class="content-list">
                        <text
                                :ref="'item'+index"
                                v-for="(item,index) in provinceList"
                                class="district-name">{{item.name}}
                        </text>
                    </div>
                </div>
                <div class="content-item">
                    <div class="content-cover"></div>
                    <div
                            :style="{transform:`translateY(${translateY})`}"
                            @panstart="panStart"
                            @panmove="panMove"
                            @panend="panEnd"
                            ref="content-list"
                            class="content-list">
                        <text
                                :ref="'item'+index"
                                v-for="(item,index) in cityList"
                                class="district-name">{{item.name}}
                        </text>
                    </div>
                </div>
                <div class="content-item">
                    <div class="content-cover"></div>
                    <div
                            :style="{transform:`translateY(${translateY})`}"
                            @panstart="panStart"
                            @panmove="panMove"
                            @panend="panEnd"
                            ref="content-list"
                            class="content-list">
                        <text
                                :ref="'item'+index"
                                v-for="(item,index) in areaList"
                                class="district-name">{{item.name}}
                        </text>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    const dom = weex.requireModule('dom');
    const animation = weex.requireModule('animation');

    import {
        apiAreaGetListByCode,
        apiAddressAdd,
        apiAddressUpdate
    } from '../api/address';


    const nameArr = [
        'receive_name',
        'receive_phone',
        'address'
    ];

    let _timer;
    let isAllow = true;

    let touchY = 0;
    let translateY = 0;
    let currentIndex = 0;

    const DISTRICT_HEIGHT = 80;

    export default {
        data () {
            const info = {
                open: false,
                translateY: 0,
                provinceList: [],
                provinceLength: 0,
                provinceSelected: '',
                cityList: [],
                areaList: [],
                districtValue: [],
                district: []
            };

            nameArr.forEach((name) => {
                info[name] = name === 'address' ? '请输入详细地址' : '';
            });

            return info;
        },

        created () {
            this._$setHeader(1, '添加地址');
            this.$store.dispatch('globalUpdateLoading', false);

            const edited = {};
            let defaultCode = edited.province_code || '110000';

            this.getProvinceList().then(list => {
                this.getAreaListByCode({
                    code: list[0]['code'],
                    curCityCode: edited.city_code || ''
                }).then(result => {

                }).catch(error => {
                    console.log(error);
                });
            }).catch(error => {
                console.log(error);
            });
        },

        methods: {

            panStart (event) {
                const { changedTouches } = event;
                touchY = changedTouches && changedTouches[0] && changedTouches[0].pageY;
                translateY = this.translateY;
            },

            panMove (event) {
                const { changedTouches } = event;

                let _touchY = changedTouches && changedTouches[0] && changedTouches[0].pageY;
                let dir = _touchY - touchY;
                let _translateY = translateY + dir;

                const direction = dir > 0 ? -1 : 1;

                if (direction === 1 && Math.abs(_translateY) > this.provinceLength * DISTRICT_HEIGHT) {
                    _translateY = this.provinceLength * DISTRICT_HEIGHT;
                } else if (direction === -1 && _translateY > 0) {
                    _translateY = 0;
                }

                this.translateY = _translateY;
            },

            panEnd (event) {
                const { changedTouches } = event;

                let _touchY = changedTouches && changedTouches[0] && changedTouches[0].pageY;
                let dir = _touchY - touchY;

                translateY = translateY + dir;

                const direction = dir > 0 ? -1 : 1;

                if (direction === 1 && Math.abs(translateY) >= this.provinceLength * DISTRICT_HEIGHT) {
                    translateY = this.provinceLength * DISTRICT_HEIGHT;
                    currentIndex = this.provinceLength - 1;
                } else if (direction === -1 && translateY >= 0) {
                    translateY = 0;
                    currentIndex = 0;
                } else {
                    this._moveToNext(direction);
                    return false;
                }

                this._moveTo();
            },

            openCityBoxHandle (event) {
                animation.transition(this.$refs.picker, {
                    styles: {
                        transform: 'translate(0)'
                    },
                    duration: 300, //ms
                    timingFunction: 'ease',
                    //                    needLayout:false,
                    //                    delay: 0 //ms
                }, function () {

                });

                animation.transition(this.$refs.cover, {
                    styles: {
                        opacity: 0.3
                    },
                    duration: 300, //ms
                    timingFunction: 'ease',
                    //                    needLayout:false,
                    //                    delay: 0 //ms
                }, function () {

                });
            },

            closeCityBoxHandle (event) {
                animation.transition(this.$refs.picker, {
                    styles: {
                        transform: 'translateY(100%)'
                    },
                    duration: 300, //ms
                    timingFunction: 'ease',
                    //                    needLayout:false,
                    //                    delay: 0 //ms
                }, function () {

                });

                animation.transition(this.$refs.cover, {
                    styles: {
                        opacity: 0
                    },
                    duration: 300, //ms
                    timingFunction: 'ease',
                    //                    needLayout:false,
                    //                    delay: 0 //ms
                }, function () {

                });
            },

            _moveToNext (direction) {
                currentIndex = Math.floor(Math.abs(translateY) / DISTRICT_HEIGHT);

                if (direction === 1) {
                    currentIndex++;
                } else {
                    currentIndex--;
                }

                this._moveTo(currentIndex);
            },

            _moveTo () {
                this.translateY = -DISTRICT_HEIGHT * currentIndex;
            },

            // get 省列表
            getProvinceList () {
                return new Promise((resolve, reject) => {
                    apiAreaGetListByCode().then(({ list }) => {
                        this.provinceList = list;
                        this.provinceLength = list.length;
                        resolve(list);
                    }).catch((error) => {
                        reject(error);
                    });
                });
            },

            // 根据 parent_code 获取 list
            getAreaListByCode ({ code, _index = 0, curProCode, curCityCode }) {
                return new Promise((resolve, reject) => {
                    apiAreaGetListByCode({
                        parent_code: code,
                        type: _index, // type 0 后代列表 1 子列表
                        city_code: curCityCode || ''
                    }).then(({ list }) => {
                        this.cityList = list;
                        this.areaList = list[0]['children'];
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    });
                });
            },

            // 城市选中
            onPickerChange (val) {
                let _index;
                const curVal = this.state.districtValue;
                const districtValue = [...val];
                const d = this.state.district;

                const setVal = () => {
                    this.setState({
                        districtValue: districtValue
                    });
                };

                if (val[0] !== curVal[0]) {
                    _index = 0;
                } else if (val[1] !== curVal[1]) {
                    _index = 1;
                } else if (val[2] !== curVal[2]) {
                    _index = 2;
                }

                let code = val[_index];

                if (_index === 2) {
                    setVal();
                    return false;
                }

                this.getAreaListByCode({
                    code,
                    _index,
                    curProCode: val[0]
                }).then((result) => {
                    d.forEach((item) => {
                        if (_index === 0) {
                            if (item.value === code && !item.isHad) {
                                item.children = result;
                                item.isHad = true;
                            }
                            districtValue[1] = result[0].value;
                            districtValue[2] = result[0].children[0].value;
                        } else if (_index === 1) {
                            if (item.value !== val[_index - 1]) {
                                return false;
                            }

                            districtValue[2] = result[0].value;

                            item.children.forEach(childItem => {
                                if (childItem.value === code && !childItem.isHad) {
                                    childItem.children = result;
                                    childItem.isHad = true;
                                }
                            });
                        }
                    });

                    this.setState({
                        districtValue: districtValue,
                        district: d
                    });
                }).catch((error) => {
                    console.log(error);
                });
            },

            // 输入
            changeValue (name, event) {
                this.setState({
                    [name]: event.target.value
                });
            },

            // 保存收货地址
            saveAddress () {
                const state = this.state;
                const districtValue = this.state.districtValue;
                const param = {
                    province_code: districtValue[0],
                    city_code: districtValue[1],
                    area_code: districtValue[2]
                };

                if (this.props.edited) {
                    param['id'] = this.props.edited.id;
                }

                nameArr.forEach(item => {
                    param[item] = state[item];
                });

                (param['id'] ? apiAddressUpdate : apiAddressAdd)(param).then(() => {
                    this.props.addressUpdateList(true);
                    this.props.history.goBack();
                }).catch(error => {
                    requestErrorHandle.call(this.props, error);
                    console.log(error);
                });
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "../scss/addressEdit.scss";
</style>