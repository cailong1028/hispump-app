/* global define, gettext */
'use strict';
define([
    'underscore',
    'underscore.string',
    'jquery',
    'backbone',
    'contacts/contact-model',
    'moment'
], function(_, _s, $, Backbone, ContactModel, moment) {
    var UpdateContactFormView = Backbone.View.extend({
        template: 'templates:contacts:update-contacts',
        events: {
            'click button.submit': '_clickSubmitButton',
            'submit form': '_submitForm',
            'click button.reset': '_resetForm',
            // 'reset form': '_resetForm',
            'click button.cancel': '_clickCancelButton'
        },
        beforeRender: function() {
            if (!this.model) {
                var done = this.async();
                this.model = new ContactModel(this.options);
                this.model.fetch().done(function() {
                    done();
                });
            }
        },
        afterRender: function() {
            this.$('.date.birthday').datetimepicker({
                //Set this to true to allow the picker to be used even if the input field is readonly
                ignoreReadonly:true,
                //输入框获得焦点之后会自动弹出datetimepicker
                allowInputToggle: true,
                format: 'll',
                // 不用设置这个玩意了，在页面处理的说。
                // defaultDate: moment(this.model.get('birthday'), 'YYYY-MM-DD'),
                maxDate: moment()
            });
        },
        _resetForm: function(e) {
            e.preventDefault();
            console.log(this.$('form'));
            this.$('form')[0].reset();
            this.$('.error-messages').removeClass('show');
        },
        _clickSubmitButton: function(e) {
            e.preventDefault();
            this.$('form').submit();
        },
        _clickCancelButton: function(e) {
            e.preventDefault();
            // history回退
            window.history.back(-1);
        },
        _submitForm: function(e) {
            e.preventDefault();
            var data = _.omit(this.$('form').serializeObject(), this.model.idAttribute);
            if (data.birthday) {
                var m = moment(data.birthday, 'll');
                if (!m.isValid())  {
                    this.$('#date_pattern_error').addClass('show');
                    return;
                }
                data.birthday = m.format('YYYY-MM-DD');
            }
             //过滤掉除备注信息之外的输入项前后空格
            data = _.object(_.map(data, function (value, key) {
                var v ;
                if(key === 'memo'){
                    v = [key,value];
                }else{
                    v = [key, _s.trim(value)];
                }
                return v;
            }));

            var model = new ContactModel({id: this.model.id});

            model.set(data);
            this.$('.error-messages').removeClass('show');
            if (!model.isValid()) {
                this.$('#' + model.validationError).addClass('show');
                return;
            }
            // wait true 等待服务器端返回内容，原文大概是这样写的
            // Pass {wait: true} if you'd like to wait for the server before setting the new attributes on the model.
            model.save()
                .done(function() {
                    // Backbone.history.navigate(url, true) 等同于 Backbone.history.navigate(url, {trigger:trur})
                    $(window).info(gettext('Update contacts successful'));
                    Backbone.history.navigate('/contacts/' + model.id, true);
                })
                .fail(_.bind(function(resp){
                    var data = resp.responseJSON;
                    if (data.type === 'ContactEmailAlreadyExists') {
                        this.$('#email_duplicate').addClass('show');
                    }
                    if (data.type === 'ContactMobileAlreadyExists') {
                        this.$('#mobile_duplicate').addClass('show');
                    }
                    $(window).info(gettext('Update contacts failure'));
                }, this));
        }
    });
    return UpdateContactFormView;
});
