import '_scss/login.scss';

import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

import { apiUserLogin } from '_api/user';
import Util from '_util';

var SHA1 = require('crypto-js/sha1');

class Login extends Component {
    constructor (props) {
        super(props);

        this.state = {
            name: '',
            password: ''
        };
    }

    componentWillMount () {
        this.props.loadingChangeStatus(false);
    }

    submit () {
        let name = this.state.name;
        let password = this.state.password;

        if (!name || !password) {
            return Util.errorToast('请填写用户信息');
        }

        if (!/^[A-Za-z0-9]+$/.test(name + password)) {
            return Util.errorToast('必须为数字或者英文!');
        }

        apiUserLogin({
            name: name,
            password: SHA1(this.state.password).toString()
        }).then(() => {
            this.props.history.replace('/');
        }).catch((error) => {
            console.log(error);
        });
    }

    changeValue (name, event) {
        var data = {};
        data[name] = event.target.value;
        this.setState(data);
    }

    render () {
        return (
            <div className="login">
                <header className="header">用户登录</header>
                <div className="form">
                    <div className="input-wrap">
                        <input
                            type="text" name="name" value={this.state.name}
                            onChange={this.changeValue.bind(this, 'name')}
                            placeholder="用户名/邮箱/已验证手机"/>
                    </div>
                    <div className="input-wrap">
                        <input
                            type="password" name="password" value={this.state.password}
                            onChange={this.changeValue.bind(this, 'password')}
                            placeholder="请输入密码"/>
                    </div>
                    <a className="submit" onClick={this.submit.bind(this)}>登录</a>
                </div>
                <div className="other-operate">
                    <NavLink to="/register">手机快速注册</NavLink>
                    <NavLink to="/">找回密码</NavLink>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);
