import Api from './base';

export function apiUserLogin (param = {}) {
    return Api.post('/api/user/login', param, true);
}

export function apiUserGetCode (param = {}) {
    return Api.get('/api/user/get_code', param, true);
}

export function apiUserRegister (param = {}) {
    return Api.post('/api/user/register', param, true);
}

export function apiUserGetInfo (param = {}) {
    return Api.get('/api/user/get_info', param, true);
}

export function apiUserEditInfo (param = {}) {
    return Api.post('/api/user/edit_info', param, true);
}

export function apiUploadsHeadImg (param = {}) {
    return Api.post('/api/uploads/head_img', param, true);
}
