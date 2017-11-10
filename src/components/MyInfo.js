import '_scss/myInfo.scss';

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import cn from 'classnames';

import { ActionSheet } from 'antd-mobile';

import DatePicker from '_lib/datepicker';

import Util, { requestErrorHandle } from '_util';
import Conf from '_conf';

import { apiUploadsHeadImg, apiUserEditInfo } from '_api/user';

class MyInfo extends Component {
    constructor (props) {
        super(props);

        this.state = {
            crop: false,
            isOpen: false
        };

        this.move = {
            saveX: 0,
            saveY: 0,
            translateX: 0,
            translateY: 0,
            isDown: false,
            saveFun: null,
            touchStart (e) {
                this.isDown = true;
                this.saveX = e.touches[0].pageX;
                this.saveY = e.touches[0].pageY;
            },

            touchMove (node, e) {
                if (!this.isDown) return '';

                let curX = e.touches[0].pageX;
                let curY = e.touches[0].pageY;

                this.translateX += curX - this.saveX;
                this.translateY += curY - this.saveY;

                node.style.transform = `translate(${this.translateX}px,${this.translateY}px)`;
                this.saveX = curX;
                this.saveY = curY;
            },

            touchEnd () {
                this.isDown = false;
            },

            listener (node, moveNode) {
                if (this.saveFun) {
                    node.removeEventListener('touchstart', this.saveFun.touchstart);
                    node.removeEventListener('touchmove', this.saveFun.touchmove);
                    node.removeEventListener('touchend', this.saveFun.touchend);
                }

                this.saveFun = {
                    touchstart: this.touchStart.bind(this),
                    touchmove: this.touchMove.bind(this, moveNode),
                    touchend: this.touchEnd.bind(this)
                };

                node.addEventListener('touchstart', this.saveFun.touchstart, false);
                node.addEventListener('touchmove', this.saveFun.touchmove, false);
                node.addEventListener('touchend', this.saveFun.touchend, false);
            }
        };

        this.saveImg = null;
    }

    componentWillMount () {
        if (this.props.userInfo.id) {
            return this.props.loadingChangeStatus(false);
        }

        this.props.myUpdateUserInfo().then(() => {
            this.props.loadingChangeStatus(false);
        }).catch((error) => {
            console.log(error);
        });
    }

    selectImg (event) {
        let target = event.target;
        const reader = new FileReader();

        reader.onload = ({ target }) => {
            this.saveImg = new Image();

            this.saveImg.onload = () => {
                this.move.listener(this.refs.cover, this.refs.crop);
                this.refs.crop.style.cssText = `background-image: url(${this.saveImg.src})`;

                this.setState({
                    crop: true
                });
            };
            this.saveImg.src = target.result;
        };

        reader.readAsDataURL(target.files[0]);
    }

    updateUserInfo (obj) {
        this.props.myUpdateUserInfo(Object.assign({}, this.props.userInfo, obj));
    }

    showSelectHeadImg () {
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', false, false);
        this.refs.file.dispatchEvent(evt);
    }

    showSelectBox (name) {
        if (name !== 'sex') return;

        const BUTTONS = ['男', '女', '取消'];

        ActionSheet.showActionSheetWithOptions(
            {
                options: BUTTONS,
                cancelButtonIndex: BUTTONS.length - 1,
                maskClosable: true
            },
            buttonIndex => {
                if (buttonIndex === BUTTONS.length - 1) {
                    return '';
                }

                this.editUserInfoRequest({
                    sex: buttonIndex + 1
                });
            }
        );
    }

    // 上传图片
    uploadImgRequest () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let w = canvas.height = canvas.width = Conf.clientWidth;
        let h = Conf.clientHeight;
        let y = this.move.translateY - (h - w) / 2;

        ctx.drawImage(this.saveImg, 0, 0, this.saveImg.width, this.saveImg.height, this.move.translateX, y, w, w * this.saveImg.height / this.saveImg.width);
        let imgData = canvas.toDataURL('image/jpeg', 0.7).replace('data:image/jpeg;base64,', '');

        const formData = new FormData();
        formData.append('img', imgData);

        apiUploadsHeadImg(formData).then((data) => {
            this.refs.file.value = null;
            this.saveImg = null;

            this.setState({
                crop: false
            });

            this.updateUserInfo({ src: data.data.data || '' });
            Util.successToast('头像修改成功！');
        }).catch(error => {
            requestErrorHandle.call(this.props, error);
            console.log(error);
        });
    }

    // 编辑用户信息
    editUserInfoRequest (param) {
        apiUserEditInfo(param).then(() => {
            this.updateUserInfo(param);
        }).catch(error => {
            requestErrorHandle.call(this.props, error);
            console.log(error);
        });
    }

    render () {
        const { userInfo } = this.props;

        return (
            <div className="myInfo">
                <div className={cn('crop', { hide: !this.state.crop })}>
                    <div ref="crop" className="crop-img"></div>
                    <div ref="cover" className="cover">
                        <div className="cover-base cover-top">
                            <div className="cover-title">
                                <span>返回</span>
                                <span>编辑裁剪</span>
                                <span onClick={this.uploadImgRequest.bind(this)}>保存</span>
                            </div>
                        </div>
                        <div className="cover-middle"></div>
                        <div className="cover-base cover-bottom"></div>
                    </div>
                </div>
                <header className="header">个人信息</header>
                <ul className="myInfo-list">
                    <li className="myInfo-item" onClick={this.showSelectHeadImg.bind(this)}>
                        <label>头像</label>
                        <div className="item-content">
                            <div className="icon-head-default images">
                                {userInfo.src ? <img src={userInfo.src}/> : null}
                            </div>
                            <span className="icon-more"></span>
                        </div>
                        <input onChange={this.selectImg.bind(this)} ref="file" type="file" className="hide"/>
                    </li>
                    <li className="myInfo-item" onClick={() => Util.commonToast('用户名不支持修改哟~')}>
                        <label>用户名</label>
                        <div className="item-content">
                            <span>{userInfo.name}</span>
                        </div>
                    </li>
                    <li className="myInfo-item" onClick={() => Util.commonToast('手机号不支持修改哟~')}>
                        <label>手机号</label>
                        <div className="item-content">
                            <span>{userInfo.phone}</span>
                        </div>
                    </li>
                    <li className="myInfo-item" onClick={this.showSelectBox.bind(this, 'sex')}>
                        <label>性别</label>
                        <div className="item-content">
                            <span>{Conf.sex[userInfo.sex] || '请选择'}</span>
                            <span className="icon-more"></span>
                        </div>
                    </li>
                    <li className="myInfo-item" onClick={() => this.setState({ isOpen: true })}>
                        <label>出生日期</label>
                        <div className="item-content">
                            <span>{userInfo.birthdate || '请选择'}</span>
                            <span className="icon-more"></span>
                        </div>
                        <DatePicker
                            theme="android-dark"
                            isOpen={this.state.isOpen}
                            onCancel={ () => {
                                this.setState({ isOpen: false });
                            }}
                            onSelect={ (val) => {
                                this.editUserInfoRequest({
                                    birthdate: Util.format(val, 'YYYY-MM-DD')
                                });
                                this.setState({ isOpen: false });
                            }}
                            dateFormat={['YYYY年', 'M月', 'D日']}
                            showFormat={'YYYY-MM-DD'}
                        />
                    </li>
                </ul>
            </div>
        );
    }
}

export default withRouter(MyInfo);
