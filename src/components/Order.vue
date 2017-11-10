<template>
    <div class="order">
        <scroller show-scrollbar="true">
            <div class="order-address" @click="selectAddressHandle">
                <div v-if="as && as.id">
                    <div class="address-title">
                        <text class="address-name">收货人: {{as.receive_name}}</text>
                        <text class="address-phone">{{as.receive_phone}}</text>
                    </div>
                    <text class="address-content">收货地址: {{`${as['province_name']}${as['city_name']}${as['area_name'] ||''}${as.address}`}}</text>
                </div>
                <text v-else-if="as" class="address-hint-info">您还没有默认地址,请点击选择地址!</text>
            </div>
            <div class="order-list">
                <div class="order-item" v-for="item in list">
                    <text class="order-item-title">{{item.seller_name}}</text>
                    <div class="order-item-content">
                        <div class="product-item" v-for="data in item.children">
                            <image class="product-image" :src="data.src"></image>
                            <div class="product-info">
                                <text class="product-info-title">{{data.title}}</text>
                                <div class="product-info-money-num">
                                    <text class="money-num-text c-red">¥{{data.price / 1000}}</text>
                                    <text class="money-num-text">x{{data.num}}</text>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="order-item-other">
                        <div class="other-logistics-type">
                            <text class="logistics-type-text">配送方式</text>
                            <text class="logistics-type-text">快递 免邮</text>
                        </div>
                        <div class="other-words">
                            <text class="words-title">给卖家留言:</text>
                            <input class="words-input"
                                   @change="writeWords(item)"
                                   :value="item.words"
                                   placeholder="选填:给卖家留言"
                            />
                        </div>
                        <div class="other-total">
                            <text class="other-total-text">共{{item.count}}件,合计:</text>
                            <text class="other-total-text c-red">¥{{item.total / 1000}}</text>
                        </div>
                    </div>
                </div>
            </div>
        </scroller>
        <div class="common-footer order-footer">
            <div class="common-left of-left">
                <text class="ofl-title">合计:</text>
                <text class="ofl-price">¥{{total / 1000}}</text>
            </div>
            <text class="common-right" @click="handleOrderSubmit">提交订单</text>
        </div>
    </div>
</template>

<script>

    import {
        openWeexUrl,
        storageSet,
        storageGet,
        toast
    } from '../util/util';

    import {
        apiOrderGetInit,
        apiOrderSubmit
    } from '../api/order';

    import {
        apiAddressGetList
    } from '../api/address';

    export default {
        data () {
            return {
                list: [],
                total: 0
            }
        },

        created () {
            this._$setHeader(1, '确认订单');
            // 订单初始化
            this.getOrderInit().then(() => {
                this.$store.dispatch('globalUpdateLoading', false);
            });
            // get 地址列表
            this.getAddressRequest();

            this.$store.dispatch('addressSetSelected');
        },

        computed: {
            as () {
                return this.$store.getters.addressGetSelected;
            }
        },

        methods: {
            // 订单初始化
            getOrderInit () {
                return new Promise((resolve, reject) => {
                    storageGet('submit_order_data').then((param) => {
                        apiOrderGetInit(param).then(({ list }) => {
                            let total = 0;

                            list.forEach((item) => {
                                item.words = '';
                                total += item.total;
                            });

                            this.total = total;
                            this.list = list || [];
                            console.log(list);
                            resolve();
                        }).catch((error) => {
                            reject(error);
                        });
                    });
                });
            },

            // 获得地址
            getAddressRequest () {
                apiAddressGetList().then(({ list }) => {
                    storageSet('address_list', list);
                }).catch((error) => {
                    console.log(error);
                });
            },

            // 选择地址
            selectAddressHandle () {
                openWeexUrl('entry', {
                    'path': 'addressList'
                });
            },

            // 写留言
            writeWords (data, event) {
                data.words = event.target.value;
                this.setState({
                    list: this.state.list
                });
            },

            // 选择配送方式 打开
            popupShow () {

            },

            // 选择配送方式 关闭
            popupHide () {
                Popup.hide();
            },

            // 提交订单
            handleOrderSubmit () {
                const as = this.props.addressSelected;

                if (!as) {
                    Util.errorAlert('请选择地址！');
                    return;
                }

                const list = this.state.list;
                const submitList = [];

                list.forEach(item => {
                    const submitItem = {
                        seller_id: item.seller_id,
                        comment: item.words || '',
                        goods_list: []
                    };

                    item.children.forEach(childItem => {
                        submitItem.goods_list.push({
                            goods_id: childItem.goods_id,
                            num: childItem.num,
                            price: childItem.price
                        });
                    });

                    submitList.push(submitItem);
                });

                const param = {
                    info: submitList,
                    address_id: as.id,
                    receive_name: as.receive_name,
                    receive_phone: as.receive_phone,
                    address: as['province_name'] + as['city_name'] + (as['area_name'] || '') + as.address
                };

                apiOrderSubmit(param).then(() => {
                    this.props.history.push('/orderList/all');
                }).catch((error) => {
                    requestErrorHandle.call(this.props, error);
                    console.log(error);
                });
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "../scss/order.scss";
</style>
