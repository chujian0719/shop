import Api from './base';

export function apiOrderGetInit (param = {}) {
    return Api.post('/api/order/get_init', param);
}

export function apiOrderSubmit (param = {}) {
    return Api.post('/api/order/order_submit', param);
}

export function apiOrderGetList (param = {}) {
    return Api.get('/api/order/get_list', param);
}

export function apiOrderGetDetail (param = {}) {
    return Api.get('/api/order/get_detail', param);
}

export function apiOrderCancel (param = {}) {
    return Api.post('/api/order/cancel', param);
}
