<template>
    <div class="orderList">
        <div class="sort-box">
            <text class="sort-item"
                  v-for="item in orderTypeArr"
                  @click="selectSortHandle(item.type)">{{item.title}}
            </text>
            <div :class="['sort-active', currentType]">
                <div class="sort-active-content"></div>
            </div>
        </div>
        <list class="order-list">
            <cell class="order-item" v-for="item in list">
                <div class="order-title">
                    <text class="order-title-text">{{item.seller_name}}</text>
                    <text class="order-title-text order-status">{{item.status_name}}</text>
                </div>
                <div class="order-content" @click="goOrderDetail">
                    <div class="product-item" v-for="childItem in item.children">
                        <image class="product-image" :src="childItem.goods_src"></image>
                        <div class="product-info">
                            <div class="product-info-left">
                                <text class="product-title">{{childItem.goods_title}}</text>
                            </div>
                            <div class="product-info-right">
                                <text class="new-price">¥{{childItem.goods_price / 1000}}</text>
                                <text class="num">x{{childItem.goods_num}}</text>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="order-total">
                    <text class="order-total-text">共{{item.count}}件商品,合计:</text>
                    <text class="order-total-text c-red">¥{{item.total_money / 1000}}</text>
                </div>
                <div class="order-btns">
                    <text class="order-btn cancel"
                          @click="handleOperate(item, 'cancel')">取消订单</text>
                    <text v-if="[1].includes(item.status)"
                          class="order-btn pay"
                          @click="handleOperate(item, 'pay')">付款</text>
                </div>
            </cell>
        </list>
    </div>
</template>

<script>

    import {
        openWeexUrl,
        toast
    } from '../util/util';

    import {
        apiOrderGetList,
        apiOrderCancel
    } from '../api/order';

    const orderTypeArr = [
        {
            title: '全部',
            type: 'all',
            value: 0
        },
        {
            title: '待付款',
            type: 'wait_pay',
            value: 1
        }, {
            title: '待发货',
            type: 'wait_send',
            value: 2
        }, {
            title: '待收货',
            type: 'wait_receive',
            value: 3
        }, {
            title: '待评论',
            type: 'wait_comment',
            value: 4
        }
    ];

    export default {
        data () {
            return {
                orderTypeArr,
                // 0：全部 1：待付款 2：待发货 3：待收货 4：待评论 5：退款 6：取消
                currentType: 'all',
                list: []
            }
        },

        created () {
            this.getOrderListRequest().then(() => {

            }).catch(() => {

            });
        },

        methods: {
            // get 订单列表
            getOrderListRequest () {
                return new Promise((resolve, reject) => {
                    const param = {
                        status: orderTypeArr.find((item) => {
                            return item.type === this.currentType;
                        }).value
                    };
                    // 请求接口
                    apiOrderGetList(param).then(({ list }) => {
                        this.list = list || [];
                        resolve();
                    }).catch(error => {
                        reject(error);
                    });
                });
            },
            // 选择类型
            selectSortHandle (type) {
                this.currentType = type;
                this.getOrderListRequest();
            },
            // go 订单详情
            goOrderDetail () {
                openWeexUrl('entry', {
                    'path': 'addressDetail'
                });
            },
            // 取消订单 || 付款
            handleOperate (data, type) {
                apiOrderCancel({
                    order_child_number: data.order_child_number
                }).then((data) => {
                    Util.successToast(data.data.msg);
                    this.getOrderListRequest();
                }).catch(error => {
                    requestErrorHandle.call(this.props, error);
                    console.log(error);
                });
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "../scss/orderList.scss";
</style>