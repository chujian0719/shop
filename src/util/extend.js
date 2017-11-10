import { transition } from './util';

// 加载图片
export function loadImage ({ target }) {
    transition(target, {
        opacity: 1
    }, 500, 'ease-in-out');
}

export function setHeader (type, title) {
    this.$store.dispatch('globalUpdateHeader', { type, title });
}

const extend = function () {
    Promise.prototype.finally = function (callback) {
        let P = this.constructor;
        return this.then(
            value => P.resolve(callback(value)).then(() => value),
            reason => P.resolve(callback(reason)).then(() => {
                throw reason;
            })
        );
    };
};

export default extend();