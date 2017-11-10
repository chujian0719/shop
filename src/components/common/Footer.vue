<template>
    <div class="footer">
        <div class="footer-tool">
            <div class="tool-item" @click="go('/')">
                <image :src="homeIcon" class="footer-icon icon-home"></image>
                <text class="tool-item-text">首页</text>
            </div>
            <div class="tool-item" @click="go('/sort')">
                <image :src="sortIcon" class="footer-icon icon-sort"></image>
                <text class="tool-item-text">分类</text>
            </div>
            <div class="tool-item" @click="go('/cart')">
                <image :src="cartIcon" class="footer-icon w-icon-cart"></image>
                <text class="tool-item-text">购物车</text>
            </div>
            <div class="tool-item" @click="go('/my')">
                <image :src="myIcon" class="footer-icon icon-my"></image>
                <text class="tool-item-text">我的</text>
            </div>
        </div>
    </div>
</template>

<script>
    import homeIcon from '../../images/footer/home.png';
    import sortIcon from '../../images/footer/sort.png';
    import cartIcon from '../../images/footer/cart.png';
    import myIcon from '../../images/footer/my.png';

    export default {
        data() {
            return {
                homeIcon,
                sortIcon,
                cartIcon,
                myIcon
            }
        },

        methods: {
            go (name) {
                this.jump(name);
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "../../scss/components/footer.scss";
</style>

