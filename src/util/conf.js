let vendorPrefix = '';
let style = (document.body || document.documentElement).style;
let transition = 'Transition';

let i = 0;
let vendor = ['Moz', 'Webkit', 'O', 'ms'];

while (i < vendor.length) {
    if (typeof style[vendor[i] + transition] === 'string') {
        vendorPrefix = vendor[i];
        break;
    }
    i++;
}

style = null;

const conf = {
    // 浏览器前缀
    vendorPrefix: vendorPrefix,
    animationEnd: (function () {
        return vendorPrefix === 'Webkit' ? 'webkitAnimationEnd' : 'animationend';
    })(),
    transitionEnd: (function () {
        return vendorPrefix === 'Webkit' ? 'webkitTransitionEnd' : 'transitionend';
    })(),

    clientWidth: document.body.clientWidth || document.documentElement.clientWidth,
    clientHeight: document.body.clientHeight || document.documentElement.clientHeight,
    API_PATH: '/api/',
    IMG_PATH: '/',
    sex: {
        1: '男',
        2: '女'
    },
    NOTICE_TYPE: {
        1: '最新',
        2: '热评',
        3: '热议'
    },
    DEFAULT_POSITION: '北京市>北京市>海淀区'
};

export default conf;
