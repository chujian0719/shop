<template>
    <div class="index">
        <scroller class="index-scroller">
            <slider class="index-banner" interval="3000" auto-play="true">
                <div class="index-banner-images" v-for="item in banners">
                    <image class="index-banner-images" :src="item.src"></image>
                </div>
            </slider>
            <div class="index-sort">
                <div class="index-sort-item" v-for="item in sorts">
                    <image class="isi-image" :src="`http://shop.bxwvr.cn:8080${item.image}`"></image>
                    <text class="isi-text">{{item.title}}</text>
                </div>
            </div>
            <div class="goods-sort" v-for="sortItem in goodsSortList">
                <text class="gs-title">{{sortItem.name}}</text>
                <div class="gs-list">
                    <div @click="goList(item)" class="gs-list-item" v-for="item in sortItem.list">
                        <text class="gs-list-text">{{item.name}}</text>
                        <image @load="_$loadImage" class="load-image gs-list-image" :src="item.src"></image>
                    </div>
                </div>
            </div>
        </scroller>
    </div>
</template>

<script>

    import { openWeexUrl, transition } from '../util/util';
    import { apiIndexGetBanners, apiIndexGetSortList } from '../api/index';
    const navigator = weex.requireModule('navigator');

    export default {
        data() {
            return {
                banners: [],
                sorts: [
                    {
                        image: '/static/images/index_sort/index_sort_logistics.png',
                        title: '物流'
                    },
                    {
                        image: '/static/images/index_sort/index_sort_focus.png',
                        title: '我的关注'
                    },
                    {
                        image: '/static/images/index_sort/index_sort_ticket.png',
                        title: '领券'
                    },
                    {
                        image: '/static/images/index_sort/index_sort_sort.png',
                        title: '分类'
                    }
                ],
                goodsSortList: []
            }
        },

        created () {
            this._$setHeader(2);
            apiIndexGetBanners().then((data) => {
                this.banners = data.data;
            }).catch(error => {
                console.log(error);
            });

            apiIndexGetSortList().then((data) => {
                this.goodsSortList = data.data;
                this.$store.dispatch('globalUpdateLoading', false);
            }).catch(error => {
                console.log(error);
            });
        },

        methods: {
            // go 列表页
            goList (data) {
                openWeexUrl('entry', {
                    'path': `list/${data.id}`
                });
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "../scss/index.scss";
</style>