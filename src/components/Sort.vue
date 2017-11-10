<template>
    <div class="sort">
        <div class="sort-first">
            <scroller show-scrollbar="false">
                <text
                        v-for="data in sortFirstList"
                        @click="selectSortFirst(data)"
                        :class="[active === data.id ? 'active' : '', 'sort-first-item']">{{data.name}}
                </text>
            </scroller>
        </div>
        <div class="sort-second">
            <list>
                <cell class="second-item" v-for="data in sortSecondList">
                    <text class="second-item-title">{{data.name}}</text>
                    <div class="second-item-content">
                        <div @click="goList(item)" class="each-product" v-for="item in data.children || []">
                            <image @load="_$loadImage" class="load-image each-product-image" :src="item.src"></image>
                            <text class="each-product-name">{{item.name}}</text>
                        </div>
                    </div>
                </cell>
            </list>
        </div>
    </div>
</template>

<script>

    import { openWeexUrl } from '../util/util';
    import { apiSortGetList } from './../api/sort';

    export default {
        data () {
            return {
                active: 0,
                sortFirstList: [],
                sortSecondList: []
            }
        },

        created () {
            this._$setHeader(2);
            this.$store.dispatch('globalUpdateLoading', false);
            this.getSortList(1).then((data) => {
                let id = data[0].id;
                this.getSortList(2, id);
                this.active = id;
            }).catch(() => {

            });
        },

        methods: {
            // get api list
            getSortList (type = 1, id = 1) {
                const param = {
                    type: type
                };

                type === 2 && (param['parent_id'] = id);

                return new Promise((resolve, reject) => {
                    apiSortGetList(param).then((data) => {
                        data = data.data || [];
                        this[`sort${type === 1 ? 'First' : 'Second'}List`] = data;
                        return resolve(data);
                    }).catch(() => {
                        reject();
                    });
                });
            },

            selectSortFirst (data) {
                this.active = data.id;
                this.getSortList(2, data.id);
            },

            goList (data) {
                openWeexUrl('entry', {
                    'path': `list/${data.id}`
                });
            }
        }

    }
</script>

<style lang="sass" scoped>
    @import "../scss/sort.scss";
</style>
