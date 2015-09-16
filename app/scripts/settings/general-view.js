/* global define, app, gettext */
'use strict';
define([
    'jquery',
    'underscore',
    'underscore.string',
    'backbone',
    'settings/general-settings-model',
    'helpers/uploader'
], function($, _, _s, Backbone, GeneralSettingsModel, Uploader) {
    var GENERAL_ATTRIBUTES = [
        'title',
        'description',
        'logo',
        'href',
        'timezone'
    ];
    var GeneralView = Backbone.View.extend({
        template: 'templates:settings:general',
        events: {
            'submit form': '_submitForm',
            'reset form': '_resetForm'
        },
        serialize: function() {
            return this.model.toJSON();
        },
        beforeRender: function() {
            var done = this.async();
            this.model = new GeneralSettingsModel();
            this.model.fetch().done(function() {
                done();
            });
        },
        afterRender: function() {
            var cl = this.$('div').hasClass('udz-singleton-image');
            if (!cl) {
                var uploader = new Uploader.SingletonImageView({
                    thumbnailWidth: 48,
                    thumbnailHeight: 48,
                    defaultImageLocation: this.model.get('logo') || app.assets('/images/logo.png')
                });
                this.listenTo(uploader, 'upload:successful', function(file) {
                    if (DEBUG) {
                        console.log('upload successful, logo uri:', file.uri);
                    }
                    this.$('#logo').attr('disabled', false).val(file.uri);
                    this.refresh = true;
                });
                this.listenTo(uploader, 'upload:sending', function() {
                    if (DEBUG) {
                        console.log('sending file');
                    }
                    // 在上传时，提交按钮禁用
                    this.$('.upload').attr('disabled', 'disabled');

                });
                this.listenTo(uploader, 'upload:complete', function() {
                    // 上传完毕后，附件按钮启用。
                    this.$('.upload').removeAttr('disabled');
                });
                this.insertView('#logo-uploader', uploader).render();
            }
        },
        _resetForm: function() {
            this.$('.error-messages').removeClass('show');
        },
        _submitForm: function(e) {
            e.preventDefault();
            var model = new GeneralSettingsModel();
            var data = this.$('form').serializeObject();
            data = _.pick(data, GENERAL_ATTRIBUTES);
            model.set(data);
            _.each(model.pick('href', 'title'),
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
            var that = this;
            model.save().done(function() {
                if (that.refresh === true) {
                    // 更新logo。重绘并不能解决问题。。。
                    window.location.reload();
                } else {
                    app.$layout.render();
                }
                $(window).info(gettext('Update general successful'));
            })
            .fail(function(){
                $(window).info(gettext('Update general failure'));
            });
        }
    });
    return GeneralView;
});
