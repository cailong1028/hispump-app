/* global define, gettext*/
'use strict';
define([
    'underscore',
    'backbone',
    'settings/agent-model'
], function(_, Backbone, AgentModel) {
    var passwordPattern = /^[a-zA-Z0-9!@#\$%\^&\*\(\)-=_\+\[\]\{\}\|;':",\.\/<>\?`~]*$/;
    var ResetPasswordModel = Backbone.Model.extend({
        initialize: function(data, options) {
            this.options = options || {};
        },
        url: function() {
            return 'agents/' + this.options.userId + '/reset-password';
        },
        attributes: [
            'password'
        ],
        isNew: function() {
            return true;
        },
        validate: function(attrs) {
            // 新密码不存在
            if (!attrs.password) {
                return 'password_required';
            }
            // 新密码不符合定义的规则
            if (!passwordPattern.test(attrs.password)) {
                return 'passwordError_required';
            }
            // 新密码不能小于6位
            if (attrs.password.length < 6) {
                return 'passwordMinError_required';
            }
            // 新密码不能大于32位
            if (attrs.password.length > 32) {
                return 'passwordMaxError_required';
            }
            // 确认密码不存在
            if (!attrs.confirmPassword) {
                return 'confirmPassword_required';
            }
            // 确认密码不能小于6位
            if (attrs.confirmPassword.length < 6) {
                return 'confirmPasswordMinError_required';
            }
            // 确认密码不能大于32位
            if (attrs.confirmPassword.length > 32) {
                return 'confirmPasswordMaxError_required';
            }
            // 如果新密码与确认密码不相同
            if (attrs.password !== attrs.confirmPassword) {
                return 'confirmPasswordError_required';
            }
        }
    });

    var ResetPasswordView = Backbone.View.extend({
        template: 'templates:settings:agent-resetpassword',
        events: {
            'click button.submit': '_submitForm',
            'submit form': '_submitForm',
            'click button.cancel': '_clickCancelButton',
            'reset form': '_resetForm'
        },
        initialize: function() {},
        beforeRender: function() {
            if (!this.model) {
                var done = this.async();
                this.model = new AgentModel(this.options);
                this.model.fetch({}, {
                    wait: true
                }).done(function() {
                    done();
                });
            }
        },
        _resetForm: function() {
            this.$('.error-messages').removeClass('show');
        },
        _clickCancelButton: function(e) {
            e.preventDefault();
            // history回退
            window.history.back(-1);
        },
        _submitForm: function(e) {
            e.preventDefault();
            this.$('.error-messages').removeClass('show');
            var data = _.omit(this.$('form').serializeObject(), this.model.idAttribute);
            var model = new ResetPasswordModel({}, {
                userId: this.model.id
            });
            var id = this.model.id;
            model.set(data);
            if (!model.isValid()) {
                this.$('#' + model.validationError).addClass('show');
                return;
            }
            // model.unset('id');
            model.unset('confirmPassword');
            model.unset('username');
            model.save({}, {
                validate: false
            }).done(function() {
                $(window).info(gettext('Reset password successful'));
                Backbone.history.navigate('settings/agents/' + id, true);
            }).fail(function() {
                $(window).info(gettext('Reset password failure'));
            });
        }
    });
    return ResetPasswordView;
});
