<template>
    <div class="search">
        <div class="search-input-box">
            <image class="search-icon" :src="searchIcon"></image>
            <input class="search-input"
                   :value="value"
                   @change="changeHandle"
                   placeholder="手表每满500减100"
            />
        </div>
        <div class="search-other">
            <image :src="messageIcon" class="message-icon"></image>
        </div>
    </div>
</template>

<script>

    import searchIcon from '../../images/search/search.png';
    import messageIcon from '../../images/search/message.png';

    export default {
        data () {
            return {
                searchIcon,
                messageIcon,
                value: ''
            }
        },

        methods: {
            changeHandle () {

            }
        }
    }
</script>

<style lang="sass" scoped>
    @import '../../scss/components/search.scss';
</style>