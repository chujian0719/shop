const stream = weex.requireModule('stream');
const { fetch } = stream;

const _request = (data) => {
    let { type: method, params, url } = data;

    url = `http://shop.bxwvr.cn:8080${url}`;

    if (method === 'get') {
        const paramsArr = [];
        for (let key in params) {
            paramsArr.push(`${key}=${params[key]}`);
        }
        url = `${url}?${paramsArr.join('&')}`;
    }

    const param = {
        method: method,
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        type: 'json'
    };

    if (method === 'post') {
        param['body'] = JSON.stringify(data.params);
    }

    return new Promise((resolve, reject) => {
        fetch(param, (response) => {
            let { ok, data } = response;

            if (ok) {
                return resolve(data);
            }

            reject(data);
        });
    });
};

export default {
    get (url, params) {
        params = params || {};

        return _request({
            type: 'get',
            url: url,
            params: params || {}
        });
    },

    post (url, params) {
        return _request({
            type: 'post',
            url: url,
            params: params || {}
        });
    }
};
