<template>
    <div class="w-popup" v-if="show">
        <Masker v-model="maskShow"></Masker>
        <div ref="sidebar" class="w-popup-sidebar">
            <div class="w-sidebar-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>

    import { transition } from '../../util/util';
    import Masker from './Masker.vue';

    export default {
        data() {
            return {
                show: false,
                maskShow: false
            }
        },

        props: {
            value: {
                type: Boolean,
                default: false
            }
        },

        components: {
            Masker
        },

        watch: {
            value (val, oldVal) {
                if (val === oldVal) {
                    return false;
                }

                val && (this.show = val);

                Vue.nextTick(() => {
                    setTimeout(() => {
                        this.maskShow = val;

                        if (val === true) {
                            transition(this.$refs.sidebar, {
                                transform: 'translateX(0)'
                            }, 300, 'ease-in-out');
                        } else {
                            transition(this.$refs.sidebar, {
                                    transform: 'translateX(100%)'
                                }, 200, 'ease-in-out'
                            ).then(() => {
                                this.show = false;
                            });
                        }
                    }, 0);
                });
            },

            maskShow (val, oldVal) {
                this.$emit('input', val);
            }
        },

        methods: {
            close () {
                this.$emit('input', false);
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "../../scss/constant.scss";

    .w-popup {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .w-popup-sidebar {
        position: fixed;
        top: px2rem($headerHeight);
        right: 0;
        bottom: 0;
        transform: translateX(100%);
        background-color: #ffffff;
    }

    .w-sidebar-content {
        flex: 1;
    }
</style>

