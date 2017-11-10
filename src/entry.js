import App from './main.vue';
import router from './router';
import store from './store';
import { sync } from 'vuex-router-sync';
import mixins from './mixins';

import { loadImage, setHeader } from './util/extend';

Vue.prototype._$loadImage = loadImage;
Vue.prototype._$setHeader = setHeader;

sync(store, router);

Vue.mixin(mixins);

new Vue(Vue.util.extend({
    el: '#root',
    router,
    store
}, App));
