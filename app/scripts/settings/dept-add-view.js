/* global define, gettext*/
'use strict';
define([
    'underscore',
    'underscore.string',
    'backbone',
    'settings/dept-model'
], function(_, _s, Backbone, DeptModel) {
    var DeptAddView = Backbone.View.extend({
        template: 'templates:settings:dept-add',
        events: {
            'click button.save,a.save-close': 'saveClose',
            'click a.save-continue': 'saveContinue',
            'submit form': 'saveClose',
            'click button.cancel': '_clickCancelButton'
        },
        initialize: function(){
        },
        serialize: function(){
        },
        beforeRender: function() {
        },
        afterRender: function(){
        },
        _clickCancelButton: function(e) {
            e.preventDefault();
            // history回退
            window.history.back(-1);
        },
        saveClose: function(e){
            e.preventDefault();
            this._submitForm().done(function() {
                $(window).info(gettext('Add dept successful'));
                Backbone.history.navigate('/settings/dept', true);
            }).fail(_.bind(function(resp){
                if (resp && resp.responseJSON && resp.responseJSON.type === 'DeptAlreadyExists') {
                    this.$('#DeptAlreadyExists').addClass('show');
                }
                else if(resp){
                    $(window).info(gettext('Fail to add dept'));
                }
            },this));
        },
        saveContinue: function(e){
            e.preventDefault();
            var self = this;
            this._submitForm().done(function() {
                $(window).info(gettext('Add dept successful'));
                self.resetForm();
            }).fail(_.bind(function(resp){
                if (resp && resp.responseJSON && resp.responseJSON.type === 'DeptAlreadyExists') {
                    this.$('#DeptAlreadyExists').addClass('show');
                }
                else if(resp){
                    $(window).info(gettext('Fail to add dept'));
                }
            },this));
        },
        resetForm: function(){
            this.$('button[type="reset"]').trigger('click');
        },
        _submitForm: function() {
            var dtd = new $.Deferred();
            var serObj = this.$('form').serializeObject();

            var model = new DeptModel(serObj);
            this.$('.error-messages').removeClass('show');
            if (!model.isValid()) {
                var errSpan = this.$('#' + model.validationError);
                errSpan.addClass('show');
                _.delay(function(){
                    dtd.reject();
                }, 0);
                return dtd.promise();
            }
            this.trimObj(model.attributes);
            model.isNew = function(){
                return true;
            };
            model.save({}, {wait: true}).done(function(){
                dtd.resolve();
            }).fail(function(resp){
                dtd.reject(resp);
            });
            return dtd.promise();
        },
        trimObj: function(obj){
            _.each(_.keys(obj), function(oneKey){
                obj[oneKey] = _s.trim(obj[oneKey]);
            });
        }
    });
    return DeptAddView;
});
