import { storageGet } from '_util';
import * as types from '../types';

export default {
    // 错误
    [types.ERROR] (state, result) {
        Vue.set(state.global, 'error', result);
    },

    // 更新 loading
    [types.GLOBAL_UPDATE_LOADING] (state, result) {
        Vue.set(state.global, 'loading', result);
    },

    // 更新 header
    [types.GLOBAL_UPDATE_HEADER] (state, { type, title }) {
        Vue.set(state.global, 'headerType', type);

        if (title) {
            Vue.set(state.global, 'title', title);
            return;
        }

        if (type === 1) {
            storageGet('header_title').then((title) => {
                Vue.set(state.global, 'title', title);
            });
        }

    },

    // address
    [types.ADDRESS_SET_SELECTED] (state, result) {
        Vue.set(state.address, 'selected', result || {});
    }
};
