import Api from './base';

export function apiAreaGetListByCode (param = {}) {
    return Api.get('/api/area/get_list_by_code', param);
}

export function apiAddressGetList (param = {}) {
    return Api.get('/api/address/get_list', param);
}

export function apiAddressAdd (param = {}) {
    return Api.post('/api/address/add', param);
}

export function apiAddressUpdate (param = {}) {
    return Api.post('/api/address/update', param);
}
