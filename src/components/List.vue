<template>
    <div class="list">
        <!--遮罩-->
        <Masker v-model="sortOpened"></Masker>
        <div class="list-panel">
            <div class="lp-sort">
                <text @click="sortOpenClose"
                      :class="['lp-sort-item', [0, 3, 4].indexOf(+sort) > -1 ? 'active': '']"
                >{{sortNames[sort] || '综合排序'}}</text>
                <text @click="sortSelectHandle(1)"
                      :class="['lp-sort-item', sort === 1 ? 'active': '']"
                >销量</text>
                <text @click="sortSelectHandle(2)"
                      :class="['lp-sort-item', sort === 2 ? 'active': '']"
                >新品优先</text>
            </div>
            <text @click="filterOpenClose" class="lp-filter">筛选</text>
        </div>
        <div v-if="sortOpened" ref="sort-drawer" class="sort-drawer">
            <div class="sort-drawer-list">
                <text @click="sortSelectHandle(item[0])" v-for="item in Object.entries(sortNames)" class="sort-drawer-item">{{item[1]}}</text>
            </div>
        </div>
        <!--遮罩-->
        <Popup v-model="filterOpened">
            <div class="filter-detail">
                <scroller class="filter-detail-scroll">
                    <div class="fd-item" v-if="filterInfo.service">
                        <text class="fd-title">折扣和服务</text>
                        <div class="fd-content">
                            <text v-for="item in filterInfo.service || []" class="fd-content-item">{{item}}</text>
                        </div>
                    </div>
                    <div class="fd-item">
                        <text class="fd-title">价格区间</text>
                        <div class="fd-content fd-price">
                            <input class="fd-price-input" placeholder="最低价"/>
                            <text class="fd-price-interval">-</text>
                            <input class="fd-price-input" placeholder="最高价"/>
                        </div>
                    </div>
                    <div class="fd-item">
                        <text class="fd-title">发货地</text>
                        <div class="fd-content">
                            <text class="fd-content-item">北京</text>
                        </div>
                        <text class="fd-title">区域</text>
                        <div class="fd-content">
                            <text v-for="item in filterInfo.area || []" class="fd-content-item">{{item.name}}</text>
                        </div>
                        <text class="fd-title">省份</text>
                        <div class="fd-content">
                            <text v-for="item in filterInfo.province || []" class="fd-content-item">{{item.name}}</text>
                        </div>
                    </div>
                </scroller>
                <div class="fd-btns">
                    <text class="fd-btn reset">重置</text>
                    <text class="fd-btn submit">完成</text>
                </div>
            </div>
        </Popup>
        <list @loadmore="loadMore" class="goods-list">
            <cell class="gl-item" @click="goDetail(data)" v-for="data in goodsList">
                <image @load="_$loadImage" class="load-image gl-item-image" :src="data.src"></image>
                <div class="gl-item-info">
                    <text class="info-title">{{data.title}}</text>
                    <text class="info-city">北京</text>
                    <div class="info-other">
                        <text class="info-other-money">¥{{data.price / 1000}}</text>
                        <text class="info-other-sale">已售{{data.num}}件</text>
                    </div>
                </div>
            </cell>
        </list>
    </div>
</template>

<script>

    import {
        storageSet,
        openWeexUrl,
        transition
    } from '../util/util';
    import { apiGoodsGetList } from '../api/goods';

    import Masker from './common/Masker.vue';
    import Popup from './common/Popup.vue';

    export default {
        data () {
            return {
                sortNames: {
                    0: '综合排序',
                    3: '价格由高到低',
                    4: '价格由低到高'
                },
                sort: 0,
                panelStyle: {},
                sortOpened: false,
                filterOpened: false,
                page: 1,
                num: 10,
                count: 0,
                goodsList: [],
                filterInfo: {
                    service: [
                        '包邮', '消费者保障', '7天退款', '货到付款'
                    ],

                    area: [
                        {
                            id: 1,
                            name: '江浙沪'
                        },
                        {
                            id: 1,
                            name: '珠三角'
                        },
                        {
                            id: 1,
                            name: '港澳台'
                        }, {
                            id: 1,
                            name: '海外'
                        }
                    ],

                    province: []
                },
            }
        },

        components: {
            Masker,
            Popup
        },

        computed: {},

        created() {
            this._$setHeader(3);
            this.getList().then(() => {
                this.$store.dispatch('globalUpdateLoading', false);
            });
        },

        mounted () {

        },

        methods: {
            // get 列表
            getList(isFirst = true) {
                return new Promise((resolve, reject) => {
                    if (!isFirst) {
                        this.page = 1;
                    }

                    apiGoodsGetList({
                        order_by: this.sort,
                        sort_id: this.$route.params.sort_id,
                        num: this.num,
                        page: this.page
                    }).then((data) => {
                        const { list, count } = data.data;
                        this.goodsList = isFirst ? list : this.goodsList.concat(list);
                        this.count = count;
                        resolve();
                    }).catch(error => {
                        console.log(error);
                        reject();
                    });
                });
            },

            // go 详情页
            goDetail(data) {
                openWeexUrl('entry', {
                    'path': `detail/${data.id}`
                });

                storageSet('header_title', data.title);
            },

            // 排序选择框 打开
            sortOpenClose() {
                this.sortOpened = !this.sortOpened;
                Vue.nextTick(() => {
                    transition(this.$refs['sort-drawer'], {
                        opacity: 1
                    }, 200, 'ease');
                });
            },

            // 筛选选择框 打开
            filterOpenClose() {
                this.filterOpened = true;
            },

            // 选择排序
            sortSelectHandle(sort) {
                this.sortOpened && (this.sortOpened = false);
                this.sort = sort;
                console.log(typeof sort);
                this.getList();
            },

            // 加载更多
            loadMore() {
                this.page++;
                this.getList(false);
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "../scss/list.scss";
</style>