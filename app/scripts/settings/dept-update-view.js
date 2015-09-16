/* global define, gettext*/
'use strict';
define([
    'underscore',
    'underscore.string',
    'backbone',
    'settings/dept-model'
], function(_, _s, Backbone, DeptModel) {
    var DeptUpdateView = Backbone.View.extend({
        template: 'templates:settings:dept-update',
        events: {
            'click button.submit': 'saveClose',
            'submit form': 'saveClose',
            'click button.cancel': '_clickCancelButton'
        },
        initialize: function(o){
            this.opts = o;
        },
        serialize: function(){
            return this.model.toJSON();
        },
        beforeRender: function() {
            var done = this.async();
            this.model = new DeptModel(this.opts);
            this.model.fetch({wait: true}).done(function(){
                done();
            });
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
        resetForm: function(){
            this.$('button[type="reset"]').trigger('click');
        },
        _submitForm: function() {
            var dtd = new $.Deferred();
            var serObj = this.$('form').serializeObject();

            var model = new DeptModel(serObj);
            model.set('id', this.model.get('id'));
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
    return DeptUpdateView;
});
