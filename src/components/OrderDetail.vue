<template>
    <div class="orderDetail">
        <scroller>
            <div class="order-status">
                <text class="order-status-text">{{detailInfo.order_status_name}}</text>
            </div>
            <div class="logistics">
                <text class="logistics-text">物流状态</text>
            </div>
            <div class="order-address">
                <div class="address-title">
                    <text class="address-name">收货人: {{detailInfo.receive_name}}</text>
                    <text class="address-phone">{{detailInfo.receive_phone}}</text>
                </div>
                <text class="address-content">收货地址: {{detailInfo.receive_address}}</text>
            </div>
            <div class="order-title">
                <text class="order-title-text">{{detailInfo.seller_name}}</text>
            </div>
            <div class="order-content">
                <div class="product-item" v-for="item in goodsList">
                    <image class="product-image" :src="item.goods_src"></image>
                    <div class="product-info">
                        <div class="product-info-left">
                            <text class="product-title">{{item.goods_title}}</text>
                        </div>
                        <div class="product-info-right">
                            <text class="new-price">¥{{item.goods_price / 1000}}</text>
                            <text class="num">x{{item.goods_num}}</text>
                        </div>
                    </div>
                </div>
            </div>
            <div class="order-money">
                <div class="order-money-item">
                    <text class="order-money-label">商品总价</text>
                    <text class="order-money-content">￥0.00</text>
                </div>
                <div class="order-money-item">
                    <text class="order-money-label">运费</text>
                    <text class="order-money-content">￥0.00</text>
                </div>
                <div class="order-money-item">
                    <text class="order-money-label">订单总价</text>
                    <text class="order-money-content">￥0.00</text>
                </div>
                <div class="order-money-item">
                    <text class="order-money-label">实付款</text>
                    <text class="order-money-content">￥0.00</text>
                </div>
            </div>
            <div class="order-message">
                <text class="order-message-text">订单编号:84772277884312971</text>
                <text class="order-message-text">创建时间:2017-11-02 22:56:20</text>
                <text class="order-message-text">付款时间:2017-11-02 22:56:24</text>
                <text class="order-message-text">发货时间:2017-11-03 00:33:45</text>
                <text class="order-message-text">成交时间:2017-11-03 23:09:41</text>
            </div>
        </scroller>
        <div class="common-footer orderDetail-footer">
            <text class="order-btn cancel"
                  @click="handleOperate(detailInfo, 'cancel')">取消订单</text>
            <text v-if="[1].includes(detailInfo.status)"
                  class="order-btn pay"
                  @click="handleOperate(detailInfo, 'pay')">付款</text>
        </div>
    </div>
</template>

<script>

    import {
        apiOrderGetDetail,
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
                detailInfo: {},
                goodsList: []
            }
        },

        created () {
            this.getOrderDetailRequest();
        },

        methods: {
            // get 订单列表
            getOrderDetailRequest () {
                // 请求接口
                apiOrderGetDetail({
                    order_child_number: this.$route.params.order_number || '15096960810526380784'
                }).then((data) => {
                    const { detail_info: detailInfo, goods_list: goodsList } = data.data;
                    this.goodsList = goodsList || [];
                    this.detailInfo = detailInfo || {};
                }).catch(error => {
                });
            },
            // 选择类型
            selectSortHandle (type) {
                this.currentType = type;
                this.getOrderListRequest();
            },

            // 取消订单 || 付款
            handleOperate (data, type) {
                apiOrderCancel({
                    order_child_number: data.order_child_number
                }).then((data) => {
                    Util.successToast(data.data.msg);
                    this.getOrderListRequest();
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "../scss/orderDetail.scss";
</style>