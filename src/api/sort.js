import Api from './base';

export function apiSortGetList (param = {}) {
    return Api.get('/api/sort/get_list', param);
}
