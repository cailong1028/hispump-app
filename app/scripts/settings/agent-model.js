/* global define, app, client*/
'use strict';
define([
    'underscore',
    'underscore.string',
    'backbone'
], function(_, _s, Backbone) {
    var passwordPattern = /^[a-zA-Z0-9!@#\$%\^&\*\(\)-=_\+\[\]\{\}\|;':",\.\/<>\?`~]*$/;
    var AgentModel = Backbone.Model.extend({
        urlRoot: 'user',
        attributes: [
            'id',
            'username',//姓名
            'loginname',//用户名
            'avatar',//头像
            'mobile',//手机
            'telephone',//电话
            'password',
            'confirmPassword',
            'post',//职位
            'workNum',//工号
            'memo'//备注
        ],
        validate: function(attrs) {
            //姓名不存在
            if (!attrs.username) {
                return 'name_required';
            }
             //姓名不存在
            if (_s.trim(attrs.username) === '') {
                return 'nameError_required';
            }
            if (!attrs.loginname) {
                return 'userName_required';
            }
            // 如果email存在，但是检查没有通过
            /*if (attrs.loginname && !app.validateEmail(attrs.loginname)) {
                return 'invalidation_userName';
            }*/
            // 密码不存在
            if (!attrs.password) {
                return 'password_required';
            }
            //密码不符合定义的规则
            if (!passwordPattern.test(attrs.password)) {
                return 'passwordError_required';
            }
            //密码长度小于6
            if(attrs.password.length < 6){
                return 'password_length_min_error';
            }
            //密码长度大于32
            if(attrs.password.length > 32){
                return 'password_length_max_error';
            }
            //确认密码不存在
            if (!attrs.confirmPassword) {
                return 'confirmPassword_required';
            }
            //密码长度小于6
            if(attrs.confirmPassword.length < 6){
                return 'confirmPasswordMinError_required';
            }
            //密码长度大于32
            if(attrs.confirmPassword.length > 32){
                return 'confirmPasswordMaxError_required';
            }
            //确认密码和密码不一致
            if(attrs.password !== attrs.confirmPassword){
                return 'confirmPasswordError_required';
            }
        },
        restore: function(o) {
            o = _.extend({}, o, {
                url: _.result(this, 'url'),
                validate:false
            });
            return this.save({}, o);
        },
        //判断是否为当前登录用户或者管理员
        isCurrentManager: function(o){
            if(app.profile.userInfo.loginname === o.get('loginname') || o.get('loginname') === 'admin'){
                return true ;
            }else{
                return false ;
            }
        }
    });
    return AgentModel;
});
