import '_scss/register.scss';

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import cn from 'classnames';

import { apiUserGetCode, apiUserRegister } from '_api/user';
import Conf from '_conf';
import Util from '_util';

var SHA1 = require('crypto-js/sha1');

const nameArr = ['phone', 'code', 'name', 'password'];
let isClickRegister = false;

class Register extends Component {
    constructor (props) {
        super(props);

        const setState = {
            allow: false,
            text: '获取短信验证码'
        };
        nameArr.forEach(name => {
            setState[name] = '';
        });

        this.state = setState;
    }

    componentDidMount () {
        this.props.loadingChangeStatus(false);
    }

    inputHandle (name, event) {
        var value = event.target.value;

        if (name === 'phone') {
            this.setState({
                allow: value.length === 11
            });
        }

        this.setState({
            [name]: value
        });
    }

    // 获取手机验证码
    getCode () {
        const _this = this;
        let time = 120;
        let phone = this.state.phone;

        this.setState({
            text: `再次发送(${time}s)`,
            allow: false
        });

        apiUserGetCode({
            phone
        }).then(() => {
            // this.refs.code.focus();
            Util.successToast('发送短信成功！');
            (function handle () {
                setTimeout(() => {
                    time -= 1;
                    if (time === 0) {
                        _this.setState({
                            allow: true,
                            text: '获取短信验证码'
                        });
                        return false;
                    }
                    _this.setState({
                        text: `再次发送(${time}s)`
                    });

                    handle();
                }, 1000);
            })();
        }).catch(error => {
            console.log(error);
            this.setState({
                allow: true,
                text: '获取短信验证码'
            });
        });
    }

    // 注册提交
    register () {
        if (isClickRegister) {
            return false;
        }
        isClickRegister = true;

        const info = this.state;
        const param = {};

        for (let i = 0; i < nameArr.length; i++) {
            let name = nameArr[i];
            let value = info[name];

            if (!value) {
                isClickRegister = false;
                return Util.errorToast('请填写完整信息!');
            }

            if (!/^[A-Za-z0-9]+$/.test(value)) {
                isClickRegister = false;
                return Util.errorToast('必须为数字或者英文!');
            }

            param[name] = name === 'password' ? SHA1(value).toString() : value;
        }

        apiUserRegister(param).then(() => {
            isClickRegister = false;
            Util.successAlert('恭喜您，注册成功！', () => {
                this.props.history.replace('/login');
            });
        }).catch(error => {
            console.log(error);
            isClickRegister = false;
        });
    }

    render () {
        return (
            <div className="register" style={{ minHeight: Conf.clientHeight + 'px' }}>
                <header className="header">用户注册</header>
                <div className="phone-wrap">
                    <div className="input-wrap">
                        <label>手机号</label>
                        <input
                            name="phone"
                            maxLength='11'
                            value={this.state.phone}
                            onInput={this.inputHandle.bind(this, 'phone')}
                            placeholder="请输入手机号"/>
                    </div>
                    <button
                        className={cn('get-code', { allow: this.state.allow })}
                        onClick={this.getCode.bind(this)}
                        disabled={!this.state.allow}>{this.state.text}
                    </button>
                </div>
                <div className="input-wrap">
                    <label>验证码</label>
                    <input
                        ref="code"
                        name="code"
                        value={this.state.code}
                        onInput={this.inputHandle.bind(this, 'code')}
                        placeholder="请输入短信验证码"/>
                </div>
                <div className="input-wrap">
                    <label>用户名</label>
                    <input
                        name="name"
                        value={this.state.name}
                        onInput={this.inputHandle.bind(this, 'name')}
                        placeholder="请设置用户名"/>
                </div>
                <div className="input-wrap">
                    <label>密码</label>
                    <input
                        type="password"
                        name="password"
                        value={this.state.password}
                        onInput={this.inputHandle.bind(this, 'password')}
                        placeholder="请设置6-20位登录密码"/>
                </div>
                <a className="submit" onClick={this.register.bind(this)}>注册</a>
            </div>
        );
    }
}

export default withRouter(Register);
