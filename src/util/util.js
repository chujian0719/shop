const storage = weex.requireModule('storage');
const modal = weex.requireModule('modal');
const navigator = weex.requireModule('navigator');
const animation = weex.requireModule('animation');

// 一天的毫秒数
let oneDayMs = 1000 * 3600 * 24 * 1;

const festival = {
    '2017-01-01': '元旦',
    '2017-02-14': '情人节',
    '2017-03-08': '妇女节',
    '2017-03-12': '植树节',
    '2017-04-01': '愚人节',
    '2017-05-01': '劳动节',
    '2017-05-04': '青年节',
    '2017-06-01': '儿童节',
    '2017-08-01': '建军节',
    '2017-09-10': '教师节',
    '2017-10-01': '国庆节',
    '2017-12-24': '平安夜',
    '2017-12-25': '圣诞节'
};

let alreadyOpen = false;
export function openWeexUrl (name, params = {}) {
    if (alreadyOpen) {
        return false;
    }

    alreadyOpen = true;

    setTimeout(() => {
        alreadyOpen = false;
    }, 500);

    params['showtype'] = 'weex';

    const save = [];
    for (let key in params) {
        save.push(`${key}=${encodeURIComponent(params[key])}`);
    }

    let curUrl = decodeURIComponent(weex.config.bundleUrl);
    let index = curUrl.indexOf('?');

    if (index > -1) {
        curUrl = curUrl.slice(0, index);
    }
    const url = `http://192.168.10.179:8080/dist/index.js?${save.join('&')}`;

    openUrl(url);
}

// 打开 web view
export function openUrl (url) {
    navigator.push({
        url: url,
        animated: "true"
    }, event => {

    });
    // HLOneApi.invoke('createWebView', {
    //     url: url
    // }, {});
}

// 关闭 web view
export function closeView () {
    navigator.pop({
        animated: "true"
    }, event => {

    });
    // HLOneApi.invoke('close', {
    //     forbiddenanimated: 0
    // }, {});
}

// 获取url参数
export function getUrlParams () {
    const defaultVal = {
        name: 'index',
        path: ''
    };

    let url = decodeURIComponent(weex.config.bundleUrl);

    let index = url.indexOf('?');
    if (index === -1) return defaultVal;

    let search = url.slice(index + 1);
    if (!search) return defaultVal;

    const paramsArr = search.split('&');
    const params = {};

    paramsArr.forEach(val => {
        const splitArr = val.split('=');
        params[splitArr[0]] = splitArr[1];
    });

    let path = params['path'];
    if (!path) return defaultVal;

    let name = path.indexOf('/') === -1 ? path : path.split('/')[0];

    return {
        name,
        path
    };
}

// 本地存储 设置
export function storageSet (key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val);
    }

    return new Promise((resolve, reject) => {
        storage.setItem(key, val, ({ result, data }) => {
            if (result === 'success') {
                return resolve(data);
            }
            reject();
        });
    });
}

// 本地存储 读取
export function storageGet (key) {
    return new Promise((resolve, reject) => {
        storage.getItem(key, ({ result, data }) => {
            if (result !== 'success') {
                return resolve(undefined);
            }

            let temp;
            try {
                temp = JSON.parse(data);
            } catch (error) {
                temp = data;
            }

            resolve(temp);
        });
    });
}

// 动画
export function transition (target, styles, duration, timingFunction) {
    return new Promise((resolve, reject) => {
        animation.transition(target, {
            styles: styles,
            duration: duration || 200, //ms
            timingFunction: timingFunction || 'ease-in-out',
            transformOrigin: 'center center'
        }, resolve);
    });
}

// 提示
export function toast (msg, duration = 1) {
    modal.toast({
        message: msg,
        duration: duration
    })
}


const _util = {
    // 成功提示
    successAlert (msg, callback) {
        _util.baseAlert('success', '成功提示', msg, callback);
    },
    // 错误提示
    errorAlert (msg) {
        _util.baseAlert('error', '错误提示', msg);
    },
    // base
    baseAlert (type, title, msg, callback) {
        const setObj1 = {
            text: '确定',
            onPress: () => {
                modal.close();
                callback && callback();
            }
        };
        if (type === 'error') {
            setObj1['style'] = {
                color: '#c0c0ca',
                background: '#e41f1f'
            };
        }
        const modal = Modal.alert(title, msg, [
            setObj1
        ]);
    },

    commonToast (msg) {
        Toast.info(msg, 1);
    },
    // 成功轻提示
    successToast (msg) {
        Toast.success(msg, 1);
    },
    // 失败轻提示
    errorToast (msg) {
        Toast.fail(msg, 1);
    },

    // url search
    getUrlSearch (search) {
        let _index = search.indexOf('?');

        if (_index === -1) return null;

        let sliceUrl = search.slice(_index + 1);
        // 防止多个问号
        sliceUrl = sliceUrl.replace(/\?/g, '&');

        const searchArr = sliceUrl.split('&');
        const searchObj = {};

        searchArr.forEach(item => {
            let _index = item.indexOf('=');
            if (_index === -1) return false;

            const query = item.split('=');
            searchObj[query[0]] = query[1];
        });

        return searchObj || null;
    },
    // get 日期
    getDays (param) {
        var date = new Date();
        var year = param.year || date.getFullYear();
        var month = param.month || (date.getMonth() + 1);

        var months = [];

        for (let i = 0; i < 2; i++) {
            let curYear = month + i >= 12 ? year + 1 : year;
            let curMonth = month >= 12 ? month + i - 12 : month + i;
            months.push({
                days: this.getEachDays(curYear, curMonth),
                title: curMonth + '月'
            });
        }

        return months;
    },
    // get 一个月日期
    getEachDays (year, month) {
        var days = [];

        var oDate = new Date(year, month - 1, 1);
        // 当前日期
        var curDate = new Date();
        var curYear = curDate.getFullYear();
        var curMonth = curDate.getMonth() + 1;
        var curDay = curDate.getDate();

        // 1号 星期几
        var firstWeek = oDate.getDay();
        // 当月天数
        var count = new Date(year, month, 0).getDate();

        var j = 0;
        const noValue = {
            value: 0,
            allowed: false
        };

        while (j < firstWeek) {
            days.push(noValue);
            j++;
        }

        var k = 1;

        while (k <= count) {
            var allowed = year > curYear || (year === curYear && month > curMonth) || (year === curYear && month === curMonth && k >= curDay);
            var key = `${year}-${month < 10 ? '0' + month : month}-${k < 10 ? '0' + k : k}`;

            const oPush = {
                key: key,
                value: k,
                allowed: allowed
            };

            if (festival[key]) {
                oPush['festival'] = festival[key];
            }

            days.push(oPush);
            k++;
        }

        var l = 1;
        var len = 7 - days.length % 7;
        len = len === 7 ? 0 : len;

        while (l <= len) {
            days.push(noValue);
            l++;
        }

        return days;
    },
    // 复制对象
    clone (obj) {
        if (typeof obj === 'object') {
            if (Array.isArray(obj)) {
                var newArr = [];

                obj.forEach(item => {
                    newArr.push(this.clone(item));
                });

                return newArr;
            } else {
                var newObj = {};

                for (var key in obj) {
                    newObj[key] = this.clone(obj[key]);
                }

                return newObj;
            }
        } else {
            return obj;
        }
    },
    // 检验手机号
    checkPhone (value) {
        return /^1[3|4|5|7|8][0-9]\d{8}$/.test(value);
    },
    // 日期 2017-5-17 to 5.17
    dateTransform (str) {
        if (!str) {
            return '';
        }
        var strArr = str.split('-');
        return `${parseInt(strArr[1])}.${parseInt(strArr[2])}`;
    },
    // num, 需要增加的天数
    addDate (str, num) {
        let oDate;
        num = num || 0;

        if (typeof str === 'string') {
            oDate = this.strToDate(str);
        } else if (typeof str === 'object') {
            oDate = str;
        } else {
            oDate = new Date();
        }
        return this.format(new Date(oDate.getTime() + oneDayMs * num), 'YYYY-MM-DD');
    },
    // 字符串转日期
    strToDate (str) {
        if (!str) {
            return '';
        }
        return new Date(str.replace(/-/g, '/'));
    },
    // 时间戳转日期
    format (date, fmt = 'YYYY-MM-DD HH:mm:ss') {
        if (!date) {
            return '';
        }
        if (typeof date === 'string') {
            date = this.strToDate(date);
        }

        const o = {
            'M+': date.getMonth() + 1,
            'D+': date.getDate(),
            'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        };

        const week = {
            '0': '\u65e5',
            '1': '\u4e00',
            '2': '\u4e8c',
            '3': '\u4e09',
            '4': '\u56db',
            '5': '\u4e94',
            '6': '\u516d'
        };

        if (/(Y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }

        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + '']);
        }

        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }

        return fmt;
    },
    // 今天 明天 后天
    whichDay (str) {
        var date = new Date();
        const dates = {
            [this.format(date, 'YYYY-MM-DD')]: '今天',
            [this.format(new Date(date.getTime() + oneDayMs * 1), 'YYYY-MM-DD')]: '明天',
            [this.format(new Date(date.getTime() + oneDayMs * 2), 'YYYY-MM-DD')]: '后天'
        };
        return dates[str] || '';
    },
    // get 历史记录
    getHistory (name) {
        if (typeof name !== 'string') {
            return [];
        }
        return this.storageHistory.get(name) || [];
    },
    // save 历史记录
    saveHistory (name, info) {
        if (typeof name !== 'string' || typeof info !== 'object') {
            return false;
        }
        const list = this.storageHistory.get(name) || [];
        let isHave = false;

        list.forEach(item => {
            if (info.id === item.id) {
                isHave = true;
            }
        });

        if (name !== 'search' && (isHave || info.id === 0)) {
            return false;
        }

        list.unshift(info);

        if (name === 'city' && list.length > 6 || (name === 'search' && list.length > 9)) {
            list.pop();
        }

        this.storageHistory.set(name, list);
    },
    // 清除 记录
    clearHistory (name) {
        this.storageHistory.del(name);
    },
    // 滚动加载更多
    scrollMore (minusHeight, callback) {
        // 先移除
        window.removeEventListener('scroll', window._listener_scroll);
        window._listener_scroll = null;

        if (arguments[0] === 'remove') {
            return;
        }

        window._listener_scroll = () => {
            let scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
            let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            let max = scrollHeight - _conf.clientHeight - minusHeight;

            if (scrollTop >= max) {
                callback && callback();
            }
        };
        // 监听
        window.addEventListener('scroll', window._listener_scroll, false);
    },
    // 滚动动画
    scrollAnimation (start, end, time, callback) {
        start = start || (document.body.scrollTop || document.documentElement.scrollTop);
        if (start === end) {
            return false;
        }

        let eachDistance = Math.abs(end - start) / time * (1000 / 60);
        let _id = window.requestAnimationFrame(function fn () {
            if (start === end) {
                window.cancelAnimationFrame(_id);
                return callback && callback();
            } else if (start < end) {
                start += Math.min(end - start, eachDistance);
            } else {
                start -= Math.min(start - end, eachDistance);
            }

            window.scrollTo(0, start);
            _id = requestAnimationFrame(fn);
        });

        return _id;
    }
};

export default Object.assign(_util);
