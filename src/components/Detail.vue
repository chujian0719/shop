<template>
    <div class="detail">
        <scroller>
            <slider class="detail-banner">
                <div class="detail-banner-images" v-for="item in images">
                    <image class="detail-banner-images" :src="item"></image>
                </div>
            </slider>
            <div class="goods-info">
                <text class="gi-title">{{info.title}}</text>
                <text class="gi-price">¥{{info.price && info.price / 1000}}</text>
                <div class="gi-old-price">
                    <text class="old-price-label">价格</text>
                    <text class="old-price-val">¥{{info.price && info.price / 1000}}</text>
                </div>
                <div class="gi-other">
                    <text class="gi-other-text">快递：免运费</text>
                    <text class="gi-other-text">已售{{info.num}}件</text>
                    <text class="gi-other-text">{{info.city || '上海'}}</text>
                </div>
            </div>
            <div class="operate-wrap">
                <div class="operate-item">
                    <text class="operate-item-label">已选</text>
                    <text class="operate-item-content">1件</text>
                </div>
            </div>
            <text class="hint-info">详情</text>
            <div class="goods-content">
                <text class="goods-content-box">无法实现富文本</text>
            </div>
        </scroller>
        <div class="common-footer detail-footer">
            <div class="common-left">
                <div class="df-icon-wrap">
                    <image :src="shopIcon" class="df-icon-base"></image>
                    <text class="df-icon-text">店铺</text>
                </div>
                <div class="df-icon-wrap">
                    <image :src="followIcon" class="df-icon-base"></image>
                    <text class="df-icon-text">关注</text>
                </div>
                <div class="df-icon-wrap" @click="goCart">
                    <image :src="cartIcon" class="df-icon-base">
                        <!--<div class="cart-num">{{total}}</div>-->
                    </image>
                    <text class="df-icon-text">购物车</text>
                </div>
            </div>
            <text class="common-right" @click="addCartRequest">加入购物车</text>
        </div>

    </div>
</template>

<script>

    import shopIcon from '../images/detail/detail_shop.png';
    import followIcon from '../images/detail/detail_follow.png';
    import cartIcon from '../images/footer/cart.png';

    import { apiGoodsGetInfo } from '../api/goods';
    import { apiCartAdd } from '../api/cart';

    import {
        openWeexUrl,
        toast
    } from '../util/util';

    export default {
        data () {
            return {
                shopIcon,
                followIcon,
                cartIcon,
                total: 1,
                info: {},
                images: []
            }
        },

        created () {
            this._$setHeader(1);
            this.getInfo().then(() => {
                this.$store.dispatch('globalUpdateLoading', false);
            });
        },

        methods: {
            // get info
            getInfo () {
                return new Promise((resolve, reject) => {
                    apiGoodsGetInfo({
                        goods_id: this.$route && this.$route.params.product_id
                    }).then((data) => {
                        const { images } = data.data;
                        this.images = images;
                        this.info = data.data;

                        Vue.nextTick(() => {
                            resolve();
                        });
                    }).catch(error => {
                        console.log(error);
                        reject();
                    });
                });
            },

            // 添加商品到购物车
            addCartRequest () {
                const { id, price } = this.info;
                const param = {
                    goods_id: id,
                    price: price
                };

                apiCartAdd(param).then((data) => {
                    toast('添加购物车成功！');
                }).catch(error => {

                });
            },

            goCart () {
                openWeexUrl('entry', {
                    'path': 'cart'
                });
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "../scss/detail.scss";
</style>