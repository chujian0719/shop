<template>
    <div class="cart">
        <scroller class="cart-list">
            <Swipeout>
                <div class="cart-item" v-for="item in list" v-if="item.children.length > 0">
                    <text class="cart-title">{{item.seller_name}}</text>
                    <div class="cart-content">
                        <SwipeoutItem :key="data.goods_id"
                                      class="product-item"
                                      v-for="data in item.children">
                            <div slot="content" class="product-content">
                                <div class="checkbox-wrap" @click="selectHandle(data)">
                                    <image :src="data.selected ? selectSelectedIcon : selectDefaultIcon"
                                           class="select-icon"></image>
                                </div>
                                <image @click="goDetail(data)" class="image-wrap" :src="data.src"></image>
                                <div class="product-info">
                                    <text class="product-title">{{data.title}}</text>
                                    <text class="product-price c-red">¥{{data.price / 1000}}</text>
                                    <div class="info-edit-num">
                                        <div class="edit-num-btn" @click="editHandle(data, 'down')">
                                            <image class="edit-num-image" :src="downIcon"></image>
                                        </div>
                                        <input class="edit-num-input" @change="editHandle(data, 'input')"
                                               :value="data.num"/>
                                        <div class="edit-num-btn" @click="editHandle(data, 'up')">
                                            <image class="edit-num-image" :src="upIcon"></image>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div slot="right-menu">
                                <text @click="editHandle(data, 'remove')" class="cart-delete-text">删除</text>
                            </div>
                        </SwipeoutItem>
                    </div>
                </div>
            </Swipeout>
        </scroller>
        <div class="common-footer cart-footer">
            <div class="common-left cf-left">
                <div class="cfl-checkbox" @click="selectHandle('allSelect')">
                    <image :src="selectedInfo.allSelected ? selectSelectedIcon : selectDefaultIcon"
                           class="select-icon"></image>
                    <text class="cfl-checkbox-text">全选</text>
                </div>
                <div class="total-price">
                    <text class="tp-title">合计:</text>
                    <text class="tp-price">¥ {{selectedInfo.total / 1000}}</text>
                </div>
            </div>
            <text class="common-right" @click="clearing">去结算{{selectedInfo.num && `(${selectedInfo.num})` || ''}}</text>
        </div>
    </div>
</template>

<script>

    import selectDefaultIcon from '../images/cart/select_default.png';
    import selectSelectedIcon from '../images/cart/select_selected.png';
    import upIcon from '../images/cart/up.png';
    import downIcon from '../images/cart/down.png';

    import {
        openWeexUrl,
        storageSet,
        storageGet,
        toast,
        transition
    } from '../util/util';

    import {
        apiCartGetList,
        apiCartSetNum,
        apiCartDelete
    } from '../api/cart';

    import { Swipeout, SwipeoutItem } from './common/swipeout';

    export default {
        data () {
            return {
                selectDefaultIcon,
                selectSelectedIcon,
                upIcon,
                downIcon,
                list: []
            }
        },

        components: {
            Swipeout,
            SwipeoutItem
        },

        created () {
            this._$setHeader(1, '购物车');

            this.getListRequest().then(() => {
                this.$store.dispatch('globalUpdateLoading', false);
            }).catch((error) => {
                console.log(error);
            });
        },

        computed: {
            // 选中的计算
            selectedInfo () {
                const list = this.list;

                let allSelected = true;
                let total = 0;
                let num = 0;

                list.forEach(({ children }) => {
                    children.forEach(childItem => {
                        if (childItem.selected) {
                            num += childItem.num;
                            total += childItem.num * childItem.price;
                            return;
                        }
                        allSelected = false;
                    });
                });

                allSelected = allSelected && num !== 0;

                return {
                    allSelected,
                    total,
                    num
                }
            }
        },

        methods: {
            // 获得购物车列表
            getListRequest () {
                return new Promise((resolve, reject) => {
                    apiCartGetList().then((data) => {
                        console.log(data);
                        const { list } = data;
                        list.forEach(({ children }) => {
                            children.forEach(childItem => {
                                childItem.selected = false;
                            });
                        });

                        this.list = list;

                        Vue.nextTick(() => {
                            resolve();
                        });
                    }).catch((error) => {
                        reject(error);
                    });
                });
            },

            // 编辑购物车 请求接口
            editRequest ({ goodsId, num }) {
                return new Promise((resolve, reject) => {
                    apiCartSetNum({
                        goods_id: goodsId,
                        num: num
                    }).then(data => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    });
                });
            },

            // 删除购物车
            deleteRequest ({ goodsId }) {
                return new Promise((resolve, reject) => {
                    apiCartDelete({
                        goods_id: goodsId
                    }).then(data => {
                        toast('删除商品成功!');
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    });
                });
            },

            // 编辑购物车
            editHandle (info, type) {
                let num = 0;
                let { maxNum } = info;
                const list = this.list;

                // 增加
                if (type === 'up') {
                    num = info.num + 1;

                    if (num > maxNum) return false;
                } else if (type === 'down') {
                    num = info.num - 1;

                    if (num < 1) return false;
                }

                const params = {
                    goodsId: info.goods_id,
                    num
                };

                if (type === 'remove') {
                    this.deleteRequest(params).then(() => {
                        list.forEach(({ children }) => {
                            let _index = children.indexOf(info);
                            if (_index === -1) return false;
                            children.splice(_index, 1);
                        });
                    }).catch(() => {

                    });

                    return false;
                }

                this.editRequest(params).then(() => {
                    info.num = num;
                }).catch(() => {

                });
            },

            // 选择
            selectHandle (data) {
                const list = this.list;
                let allSelected = this.selectedInfo.allSelected;

                if (data === 'allSelect') {
                    list.forEach(({ children }) => {
                        children.forEach(childItem => {
                            childItem.selected = !allSelected;
                        });
                    });
                } else {
                    data.selected = !data.selected;
                }

                //                this.changeFooter(list);
            },

            goDetail (data) {
                openWeexUrl('entry', {
                    'path': `detail/${data.goods_id}`
                });
            },

            // 去结算
            clearing () {
                let isHaveSelected = false;
                const list = this.list;
                const data = {};

                list.forEach(({ children }) => {
                    children.forEach(childItem => {
                        if (!childItem.selected) {
                            return false;
                        }
                        data[childItem.goods_id] = childItem.num;
                        isHaveSelected = true;
                    });
                });

                if (!isHaveSelected) {
                    toast('请至少选择一件商品！');
                    return false;
                }

                storageSet('submit_order_data', data).then(() => {
                    openWeexUrl('entry', {
                        'path': 'order'
                    });
                });
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "../scss/cart.scss";
</style>