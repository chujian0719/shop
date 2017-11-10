import Api from './base';

export function apiCartGetTotal (param = {}) {
    return Api.get('/api/cart/get_total', param);
}

export function apiCartGetList (param = {}) {
    return Api.get('/api/cart/get_list', param);
}

export function apiCartSetNum (param = {}) {
    return Api.post('/api/cart/set_num', param);
}

export function apiCartAdd (param = {}) {
    return Api.post('/api/cart/add', param);
}

export function apiCartDelete (param = {}) {
    return Api.post('/api/cart/delete', param);
}
