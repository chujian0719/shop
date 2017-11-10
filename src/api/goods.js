import Api from './base';

export function apiGoodsGetList (param = {}) {
    return Api.get('/api/goods/get_list', param);
}

export function apiGoodsGetInfo (param = {}) {
    return Api.get('/api/goods/get_info', param);
}

export function apiGoodsGetSku (param = {}) {
    return Api.get('/api/goods/get_sku', param);
}

export function apiGoodsGetInfoForSku (param = {}) {
    return Api.get('/api/goods/get_info_for_sku', param);
}
