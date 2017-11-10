import { storageGet } from '../../util/util';
import * as types from '../types';

export default {
    // loading set
    [types.GLOBAL_UPDATE_LOADING] ({ commit }, data) {
        commit(types.GLOBAL_UPDATE_LOADING, data);
    },

    // 更新头部
    [types.GLOBAL_UPDATE_HEADER] ({ commit }, data) {
        commit(types.GLOBAL_UPDATE_HEADER, data);
    },

    // address set
    [types.ADDRESS_SET_SELECTED] ({ commit }) {
        storageGet('address_selected').then((data) => {
            commit(types.ADDRESS_SET_SELECTED, data);
        });
    }
};
