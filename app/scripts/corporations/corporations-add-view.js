/* global define, gettext*/
'use strict';
define([
    'underscore',
    'underscore.string',
    'jquery',
    'backbone',
    'corporations/corporations-model'
], function(_, _s, $, Backbone, CorporationsModel) {
    var CorporationsAddView = Backbone.View.extend({
        //urlRoot: 'corporations',
        template: 'templates:corporations:corporations-add',
        events: {
            'submit form': '_submitForm',
            'click button.submit': '_clickSubmitButton'
        },
        _clickSubmitButton: function(e) {
            e.preventDefault();
            this.$('form').submit();
        },
        _submitForm: function(e) {
            e.preventDefault();
            this.$('.error-messages').removeClass('show');
            var data = _.omit(this.$('form').serializeObject(), this.model.idAttribute);
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
            var model = new CorporationsModel(data);
            if (!model.isValid()) {
                this.$('#' + model.validationError).addClass('show');
                return;
            }
            this.$('.save').attr('disabled','disabled');
            var that = this;
            model.save({}, {
                wait: true
            }).done(function() {
                $(window).info(gettext('Add corporations successful'));
                Backbone.history.navigate('corporations/' + model.id, true);
            }).fail(_.bind(function(resp) {
                that.$('.save').removeAttr('disabled');
                $(window).info(gettext('Add corporations failure'));
                var data = resp.responseJSON;
                this.$('#' + data.errorCode).addClass('show');
            }, this));
        },
        _cancel: function(e) {
            e.preventDefault();
            window.history.back();
        }
    });
    return CorporationsAddView;
});
