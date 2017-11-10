<template>
    <div class="addressList">
        <list class="al-list">
            <cell
                    v-for="item in addressList"
                    @click="selectAddressHandle(item)"
            >
                <div class="al-item">
                    <div class="address-title">
                        <text class="address-title-text address-receive-name">{{item.receive_name}}</text>
                        <text class="address-title-text">{{item.receive_phone}}</text>
                    </div>
                    <text class="address-content">{{`${item.province_name}${item.city_name}${item.area_name
                        ||''}${item.address}`}}
                    </text>
                    <div class="address-operate">
                        <text class="ao-left">设为默认</text>
                        <div class="ao-right">
                            <text class="ao-btn" @click="operateAddressHandle('edit', item)">编辑</text>
                            <text class="ao-btn" @click="operateAddressHandle('delete', item)">删除</text>
                        </div>
                    </div>
                </div>
            </cell>
        </list>
        <text class="common-footer addressList-footer" @click="operateAddressHandle('add', item)">添加新地址</text>
    </div>
</template>

<script>
    import {
        openWeexUrl,
        closeView,
        storageSet,
        storageGet,
        toast
    } from '../util/util';

    import {
        apiAddressGetList
    } from '../api/address';

    export default {
        data () {
            return {
                operate: 'select',
                addressList: []
            };
        },

        created () {
            this._$setHeader(1, '选择地址');
            this.getAddressListRequest().then(() => {
                this.$store.dispatch('globalUpdateLoading', false);
            });
        },

        methods: {
            // get 地址
            getAddressListRequest () {
                return new Promise((resolve, reject) => {
                    storageGet('address_list').then((data) => {
                        this.addressList = data;
                        Vue.nextTick(() => {
                            resolve();
                        })
                    });
                });
            },

            // 选择地址
            selectAddressHandle (data) {
                if (this.operate !== 'select') return '';

                storageSet('address_selected', data).then(() => {
                    closeView();
                });
            },

            // 添加地址 || 编辑地址 || 删除地址
            operateAddressHandle (type, data) {
                if (!type) return;

                if (type === 'delete') {
                    return;
                }

                if (type === 'add') {
                    openWeexUrl('entry', {
                        'path': `addressEdit`
                    });
                } else if (type === 'edit') {

                }

            }
        }
    }

</script>

<style lang="sass" scoped>
    @import "../scss/addressList.scss";
</style>