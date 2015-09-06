/* global define,app,gettext*/
'use strict';
define([
    'underscore',
    'underscore.string',
    'backbone',
    'profile/profile-model',
    'profile/password-model'
], function(_, _s, Backbone, ProfileModel, PasswordModel) {
    var UpdatePasswordView = Backbone.View.extend({
        template: 'templates:profile:update-password',
        events: {
            'submit #form2': '_submitPasswordForm'
        },
        _submitPasswordForm: function(e) {
            e.preventDefault();
            this.$('.error-messages').removeClass('show');
            var passwordModel = new PasswordModel();
            var data = this.$('#form2').serializeObject();
            passwordModel.set(data);
            var that = this;
            // 提取model定义的attributes
            passwordModel.set(_.pick(data, PasswordModel.prototype.attributes));
            if (!passwordModel.isValid()) {
                this.$('#' + passwordModel.validationError).addClass('show');
                return false;
            }
            passwordModel.unset('confirmPassword');
            passwordModel.save({},{validate:false})
                .done(function() {
                    $(window).info(gettext('Reset password successful'));
                    that.render();
                })
                .fail(function(){
                    $(window).info(gettext('Reset password failure'));
                 });
        }
    });
    var ProfileUpdateView = Backbone.View.extend({
        template: 'templates:profile:profile-update',
        events: {
            'click button.submit': '_submitForm',
            'submit #form1': '_submitForm',
            'reset #form1': '_resetForm',
            'click button.cancel': '_clickCancelButton'
        },
        initialize: function() {
            this.listenTo(app.vent, 'update-password:successful', function() {
                this.render();
            });
        },
        beforeRender: function() {
            if (!this.model) {
                var done = this.async();
                this.model = new ProfileModel();
                this.model.fetch({}, {wait: true}).done(function(){
                    done();
                });
            }
            this.setView('.update-password', new UpdatePasswordView());
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
            var data = _.omit(this.$('#form1').serializeObject(), this.model.idAttribute);
            var model = new ProfileModel({id: this.model.id});
            model.set(data);
            _.each(model.pick('name', 'workNum', 'mobile', 'post', 'remark'),
                function(value, key) {
                    if (_s.trim(value) === '') {
                        model.unset(key);
                    }
                    else {
                        var v = _s.trim(value);
                        model.set(key, v);
                    }
                });
            model.unset('id');
            this.$('.error-messages').removeClass('show');
            if (!model.isValid()) {
                this.$('#name_required').addClass('show');
                return;
            }
            // wait true 等待服务器端返回内容，原文大概是这样写的
            // Pass {wait: true} if you'd like to wait for the server before setting the new attributes on the model. 
            model.save({}, {wait: true})
                .done(function() {
                    $(window).info(gettext('Update personal info successful'));
                })
                .fail(_.bind(function(resp){
                    var data = resp.responseJSON;
                    if (data.type === 'WorkNumAlreadyExists') {
                        this.$('#alreadyExists_workNum').addClass('show');
                    }
                    else {
                        $(window).info(gettext('Update personal info failure'));
                    }
                },this));
        }
    });


    return ProfileUpdateView;
});