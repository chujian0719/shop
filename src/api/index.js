import Api from './base';

export function apiIndexGetBanners (param = {}) {
    return Api.get('/api/index/get_banners', param);
}

export function apiIndexGetSortList (param = {}) {
    return Api.get('/api/sort/get_index_list', param);
}
