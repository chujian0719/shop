<template>
    <div class="my">
        <scroller show-scrollbar="false">
            <div class="my-info">
                <text class="my-info-set">设置</text>
                <image class="my-info-image" :src="userInfo.src" v-if="userInfo.src"></image>
                <text class="my-info-name">{{userInfo.name}}</text>
                <text class="my-info-address">管理收货地址</text>
            </div>
            <div class="my-order">
                <div class="my-order-title">
                    <text class="order-title-left">我的订单</text>
                    <div class="order-title-right">
                        <text class="more-text">查看更多订单</text>
                        <image :src="enterIcon" class="enter-icon"></image>
                    </div>
                </div>
                <div class="my-order-content">
                    <div @click="goOrderDetail(item)" v-for="item in orderTypeArr" class="order-content-item">
                        <image :src="item.src" class="my-order-icon"></image>
                        <text class="order-content-text">{{item.title}}</text>
                    </div>
                </div>
            </div>
            <div class="my-money">
                <text class="my-money-title">我的资产</text>
                <div class="my-money-content">
                    <div class="money-content-item">
                        <text class="money-content-value">0.00</text>
                        <text class="money-content-label">余额</text>
                    </div>
                    <div class="money-content-item">
                        <text class="money-content-value">200</text>
                        <text class="money-content-label">积分</text>
                    </div>
                    <div class="money-content-item">
                        <text class="money-content-value">3</text>
                        <text class="money-content-label">优惠券</text>
                    </div>
                </div>
            </div>
            <div class="my-other">
                <div class="my-other-item">
                    <text class="my-other-label">我的关注</text>
                    <image :src="enterIcon" class="enter-icon"></image>
                </div>
                <div class="my-other-item">
                    <text class="my-other-label">管理收货地址</text>
                    <image :src="enterIcon" class="enter-icon"></image>
                </div>
                <div class="my-other-item">
                    <text class="my-other-label">意见反馈</text>
                    <image :src="enterIcon" class="enter-icon"></image>
                </div>
                <div class="my-other-item">
                    <text class="my-other-label">更多</text>
                    <image :src="enterIcon" class="enter-icon"></image>
                </div>
            </div>
            <text class="logout" @click="logout">退出登录</text>
        </scroller>
    </div>
</template>

<script>

    import {
        openWeexUrl,
        toast
    } from '../util/util';

    import enterIcon from '../images/enter.png';
    import defaultHeadIcon from '../images/my/default.png';

    import refundIcon from '../images/my/refund.png';
    import waitReceiveIcon from '../images/my/wait-receive.png';
    import waitSendIcon from '../images/my/wait-send.png';
    import waitCommentIcon from '../images/my/wait_comment.png';
    import waitPayIcon from '../images/my/wait_pay.png';

    export default {
        data () {
            return {
                enterIcon,
                orderTypeArr: [
                    {
                        title: '待付款',
                        type: 'wait_pay',
                        src: refundIcon
                    },
                    {
                        title: '待发货',
                        type: 'wait_send',
                        src: waitSendIcon
                    },
                    {
                        title: '待收货',
                        type: 'wait_receive',
                        src: waitReceiveIcon
                    },
                    {
                        title: '待评论',
                        type: 'wait_comment',
                        src: waitCommentIcon
                    },
                    {
                        title: '退款',
                        type: 'refund',
                        src: refundIcon
                    }
                ],
                userInfo: {
                    src: defaultHeadIcon,
                    name: '杨栋'
                }
            }
        },

        created () {
            this._$setHeader(4);
            this.$store.dispatch('globalUpdateLoading', false);
        },

        methods: {

            goOrderDetail () {
                openWeexUrl('entry', {
                    'path': 'orderList'
                });
            },

            logout () {

            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "./../scss/my.scss";
</style>