<template>
    <div v-if="show" ref="shade" class="w-shade" @click="close">
        <slot></slot>
    </div>
</template>

<script>

    import {
        transition
    } from '../../util/util';

    export default {
        data() {
            return {}
        },

        props: {
            show: {
                type: Boolean,
                default: true
            },

            value: {
                type: Boolean,
                default: false
            }
        },

        watch: {
            value (val, oldVal) {
                if (val === oldVal) {
                    return false;
                }

                Vue.nextTick(() => {
                    if (val === true) {
                        transition(this.$refs.shade, {
                            opacity: 0.3
                        }, 200, 'ease-in-out');
                    } else {
                        transition(this.$refs.shade, {
                            opacity: 0
                        }, 200, 'ease-in-out');
                    }
                });
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

    .w-shade {
        position: fixed;
        left: 0;
        right: 0;
        top: px2rem($headerHeight);
        bottom: 0;
        opacity: 0;
        background-color: #000000;
    }
</style>

