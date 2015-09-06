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

    /* TODO 上传头像
    var initAvatarUpload = function() {
        var fileuploadOptions = {
            url: app.buildUrl('attachments'),
            dataType: 'json',
            singleFileUploads: true
        };

        this.$('.fileupload').fileupload(fileuploadOptions)
            .on('fileuploaddone', _.bind(function(e, resp) {
                var download = _.find(resp.result.links, function(l) {return l.rel === 'download';});
                this.$('img.avatar').attr('src', download.href);
            }, this))
            .on('fileuploadfail', _.bind(function(e, resp) {
                // TODO upload fail
                console.log('fileuploadfail', e, resp);
            }, this));
    };
    */
    var AddContactFormView = Backbone.View.extend({
        template: 'templates:contacts:add-contacts',
        events: {
            'click button.save': '_submitForm',
            'submit form': '_submitForm'
        },
        afterRender: function() {
            // 日期组件
            this.$('.date.birthday').datetimepicker({
                format: 'll',
                //Set this to true to allow the picker to be used even if the input field is readonly
                ignoreReadonly:true,
                //输入框获得焦点之后会自动弹出datetimepicker
                allowInputToggle: true,
                maxDate: moment()
            });
        },
        _submitForm: function(e) {
            e.preventDefault();
            this.$('.error-messages').removeClass('show');

            var model = new ContactModel();
            var data = this.$('form').serializeObject();
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
            model.set(data);

            if (!model.isValid()) {
                this.$('#' + model.validationError).addClass('show');
                return;
            }
            this.$('.save').attr('disabled','disabled');
            var that = this;
            // wait true 等待服务器端返回内容，原文大概是这样写的
            // Pass {wait: true} if you'd like to wait for the server before setting the new attributes on the model.
            // save的头一个参数是attrs
            // 第二个参数才是options
            model.save({}, {wait: true})
                .done(function() {
                     $(window).info(gettext('Add contacts successful'));
                    // Backbone.history.navigate(url, true) 等同于 Backbone.history.navigate(url, {trigger:trur})
                    Backbone.history.navigate('/contacts/' + model.id, true);
                })
                .fail(_.bind(function(resp){
                    that.$('.save').removeAttr('disabled');
                    var data = resp.responseJSON;
                    if (data.type === 'ContactEmailAlreadyExists') {
                        this.$('#email_duplicate').addClass('show');
                    }
                    if (data.type === 'ContactMobileAlreadyExists') {
                        this.$('#mobile_duplicate').addClass('show');
                    }
                    $(window).info(gettext('Add contacts failure'));
                }, this));
        }
    });
    return AddContactFormView;
});
