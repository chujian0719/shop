<template>
    <div class="w-loading" v-if="value">
        <div class="w-loading-mask" :style="{backgroundColor: maskColor}"></div>
        <div class="w-loading-toast">
            <image :src="loadingIcon" class="w-loading-image"></image>
            <text class="w-loading-text">{{text}}</text>
        </div>
    </div>
</template>

<script>

    import loadingIcon from '../../images/loading2.gif';

    const { env } = weex.config;
    let { deviceWidth, deviceHeight } = env;
    let height = 750 / deviceWidth * deviceHeight;

    export default {
        data () {
            return {
                loadingIcon
            }
        },

        props: {
            maskColor: {
                type: String,
                default: '#ffffff'
            },

            value: {
                type: Boolean,
                default: false
            },

            text: {
                type: String,
                default: '正在加载中'
            }
        },

        mounted () {

        }
    }
</script>

<style lang="sass" scoped>
    @import "../../scss/components/loading.scss";
</style>
