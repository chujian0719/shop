<template>
    <div :class="[showFooterComponent ? 'main-show-footer' : '']"
         @viewappear="viewAppearHandle"
         @viewdisappear="viewDisappearHandle"
    >
        <LoadingComponent v-model="loading"></LoadingComponent>
        <HeaderComponent></HeaderComponent>
        <router-view class="router-view"></router-view>
        <FooterComponent v-if="showFooterComponent"></FooterComponent>
    </div>
</template>

<script>
    import {
        getUrlParams,
        closeView
    }  from './util/util';

    import FooterComponent from './components/common/Footer.vue';
    import HeaderComponent from './components/common/Header.vue';
    import LoadingComponent from './components/common/Loading.vue';

    let { path, name } = getUrlParams();

    const ShowFooterComponentArr = ['index', 'sort', 'my'];

    // 是否需要显示footer
    function isIncludes (name, type) {
        return ShowFooterComponentArr.some((val) => {
            return name === val;
        });
    }

    export default {
        data () {
            return {
                routeName: name,
                showFooterComponent: isIncludes(name, 'footer')
            }
        },

        computed: {
            loading () {
                return this.$store.getters.globalLoading;
            },
        },

        components: {
            HeaderComponent,
            FooterComponent,
            LoadingComponent
        },

        watch: {
            $route ({ name }) {

            }
        },

        created () {
            //            this.jump(`/list/1390`);
            this.jump(`/${path}`);
        },

        methods: {

            viewAppearHandle () {
                let { routeName } = this;
                if (routeName === 'order') {
                    this.$store.dispatch('addressSetSelected');
                }
                console.log('viewAppear');
            },

            viewDisappearHandle () {
                console.log('viewDisappear');
            }
        }
    };
</script>

<style lang="sass" scoped>
    @import "scss/main.scss";
</style>
