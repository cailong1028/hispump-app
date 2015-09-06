/* global define, gettext*/
/**
 * Created by lnye on 2014/12/31.
 */
'use strict';
define([
    'underscore',
    'underscore.string',
    'jquery',
    'backbone',
    'corporations/corporations-model'
], function(_, _s, $, Backbone, CorporationsModel) {
    var CorporationsUpdateView = Backbone.View.extend({
        template: 'templates:corporations:corporations-update',
        events: {
            'submit form': '_submitForm',
            'click button.submit': '_clickSubmitButton',
            'click button.cancel': '_clientCancelButton',
            'reset form': '_resetForm'
        },
        beforeRender: function() {
            if (!this.model) {
                var done = this.async();
                this.model = new CorporationsModel(this.options);
                this.model.fetch().done(function() {
                    done();
                });
            }
        },
        serialize: function() {
            return this.model.toJSON();
        },
        _clickSubmitButton: function(e) {
            e.preventDefault();
            this.$('form').submit();
        },
        _resetForm: function() {
            this.$('.error-messages').removeClass('show');
        },
        _submitForm: function(e) {
            e.preventDefault();

            var model = new CorporationsModel({
                id: this.model.id
            });
            var data = _.pick(this.$('form').serializeObject(), 'name', 'memo', 'domain', 'description');
            //过滤掉除备注信息之外的输入项前后空格
            data = _.object(_.map(data, function (value, key) {
                var v ;
                if(key === 'memo'||key === 'description'){
                    v = [key,value];
                }else{
                    v = [key, _s.trim(value)];
                }
                return v;
            }));
            this.$('.error-messages').removeClass('show');
            model.set(data); //为校验用
            if (!model.isValid()) {
                this.$('#' + model.validationError).addClass('show');
                return;
            }
            model.save({}, {
                wait: true
            }).done(function() {
                $(window).info(gettext('Update corporations successful'));
                Backbone.history.navigate('corporations/' + model.id, true);
            }).fail(_.bind(function(resp) {
                $(window).info(gettext('Update corporations failure'));
                var data = resp.responseJSON;
                this.$('#' + data.errorCode).addClass('show');
            },this));
        },
        _clientCancelButton: function(e) {
            e.preventDefault();
            window.history.back(-1);
        }
    });

    return CorporationsUpdateView;
});
