/* global define, gettext */
'use strict';
define([
    'underscore',
    'jquery',
    'underscore.string',
    'backbone',
    'settings/agent-model',
    'helpers/sha1'
], function(_, $, _s, Backbone, AgentModel, sha1) {
    var AddAgentFormView = Backbone.View.extend({
        template: 'templates:settings:agent-add',
        events: {
            'click button.save': '_submitForm',
            'submit form': '_submitForm'
        },
        afterRender: function() {
        },
        _submitForm: function(e) {
            e.preventDefault();
            this.$('.error-messages').removeClass('show');
            var model = new AgentModel();
            var data = this.$('form').serializeObject();
            // 提取model定义的attributes
            model.set(_.pick(data, AgentModel.prototype.attributes));
            _.each(model.pick('username', 'workNum', 'mobile', 'post', 'confirmPassword', 'password', 'loginname', 'memo'),
                function(value, key) {
                    if (_s.trim(value) === '') {
                        model.unset(key);
                    }
                    else {
                        var v = _s.trim(value);
                        model.set(key, v);
                    }
                });
            if (!model.isValid()) {
                this.$('#' + model.validationError).addClass('show');
                return;
            }
            model.unset('confirmPassword');
            //sha1 加密后传递
            model.set('password', sha1(model.get('password')));
            // wait true 等待服务器端返回内容，原文大概是这样写的
            // Pass {wait: true} if you'd like to wait for the server before setting the new attributes on the model.
            // save的头一个参数是attrs
            // 第二个参数才是options
            //validate: false表示:调用.save方法时不去调用model的validate，默认为true
            model.save({}, {wait: true, validate: false})
                .done(function() {
                    // Backbone.history.navigate(url, true) 等同于 Backbone.history.navigate(url, {trigger:trur})
                    $(window).info(gettext('Add agent successful'));
                    Backbone.history.navigate('settings/agents', true);
                })
                .fail(_.bind(function(data) {
                    if (data.responseJSON.type === 'UserAlreadyExists') {
                        this.$('#alreadyExists_userName').addClass('show');
                    }
                    if (data.responseJSON.type === 'WorkNumAlreadyExists') {
                        this.$('#alreadyExists_workNum').addClass('show');
                    }
                    else
                    {
                        $(window).info(gettext('Add agent failure'));
                    }
                }, this));
        }
    });
    return AddAgentFormView;
});
