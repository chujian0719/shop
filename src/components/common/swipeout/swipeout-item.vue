<template>
    <div ref="swipeout" class="w-swipeout-item"
         @touchstart="start"
         @touchmove="move"
         @touchend="end"
    >
        <div ref="right-menu" class="w-swipeout-button-box"
             @touchstart="prevent"
             @touchmove="prevent"
             @touchend="prevent">
            <slot name="right-menu"></slot>
        </div>
        <div class="w-swipeout-content">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>

    import {
        transition
    } from '../../../util/util';

    const dom = weex.requireModule('dom');

    export default {
        data() {
            return {
                pageX: undefined,
                pageY: undefined,
                distX: 0,
                distY: 0,
                rightMenuWidth: 0,
                isOpen: false
            }
        },

        props: {
            // 滑动多少距离后打开菜单
            threshold: {
                type: Number,
                default: 30
            }
        },

        mounted () {
            setTimeout(() => {
                dom.getComponentRect(this.$refs['right-menu'], ({ size }) => {
                    this.rightMenuWidth = size.width;
                });
            }, 0);
        },

        methods: {
            start ({ changedTouches }) {
                const { $parent } = this;
                if ($parent.$options._componentTag === 'Swipeout') {
                    const openItems = $parent.$children.filter((item) => item.isOpen && item !== this);
                    if (openItems.length > 0) {
                        openItems.forEach(item => {
                            item.close();
                        });
                        return;
                    }
                }

                let { pageX, pageY } = changedTouches[0];
                this.pageX = pageX;
                this.pageY = pageY;
            },

            move ({ changedTouches }) {
                if (this.pageX === undefined) {
                    return;
                }

                let { pageX, pageY } = changedTouches[0];
                let distX = this.distX = pageX - this.pageX;
                let distY = this.distY = pageY - this.pageY;

                if (Math.abs(distY) >= Math.abs(distX)) {
                    return false;
                }

                if (Math.abs(distX) < this.threshold) {
                    return false;
                }

                // 向右滑动
                if (distX > 0) {
                    this.close();
                } else {
                    this.open();
                }
            },

            end (e) {
                this.pageX = this.pageY = undefined;
            },

            open () {
                this.transition(-this.rightMenuWidth);
            },

            close () {
                this.transition(0);
            },

            transition (x) {
                this.isOpen = x !== 0;
                transition(this.$refs.swipeout, {
                    transform: `translateX(${x}px)`
                }, 250, 'ease-out');
            },

            prevent (e) {
                console.log(e);
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "../../../scss/components/swipeout.scss";
</style>

