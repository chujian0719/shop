<template>
    <div class="header" v-if="headerType !== 4">
        <div class="header-top"></div>
        <div class="header-content">
            <div class="header-content-default" v-if="headerType === 1">
                <div class="header-back-box" @click="goBack">
                    <image class="back" :src="backIcon"></image>
                </div>
                <text class="header-title">{{title}}</text>
            </div>
            <div :style="{paddingLeft: headerType === 2 ? '20': 0}"
                 class="header-content-search"
                 v-else-if="[2,3].indexOf(headerType) > -1">
                <div class="header-back-box" @click="goBack" v-if="headerType === 3">
                    <image class="back" :src="backIcon"></image>
                </div>
                <Search></Search>
            </div>
        </div>
    </div>
</template>

<script>

    import {
        closeView
    }  from '../../util/util';

    import backIcon from '../../images/header/back.png';
    import Search from '../common/Search.vue';

    export default {
        data() {
            return {
                backIcon
            }
        },

        components: {
            Search
        },

        computed: {
            title () {
                return this.$store.getters.globalTitle;
            },

            headerType () {
                return this.$store.getters.globalHeaderType;
            }
        },

        methods: {
            goBack () {
                closeView();
            },

            go (name) {
                this.jump(name);
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "../../scss/common/header.scss";
</style>

