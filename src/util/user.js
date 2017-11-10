import { user_get_info } from '_api/user';

let isLogin = false;
let userInfo = null;

export default {

    setLogin (val) {
        isLogin = val;
    },

    getLogin () {
        return isLogin;
    },

    checkLogin () {

    },

    getUserInfo () {
        user_get_info().then((data) => {

        }).catch((error) => {

        });
    }
};
