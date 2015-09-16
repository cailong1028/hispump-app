/* global define, gettext*/
'use strict';
define([
    'underscore',
    'underscore.string',
    'backbone',
    'settings/dev-model',
    'settings/dev-type-collection',
    'settings/dept-collection'
], function(_, _s, Backbone, DevModel, DevTypeCollection, DeptCollection) {
    var DevAddView = Backbone.View.extend({
        template: 'templates:settings:dev-add',
        events: {
            'click button.submit,a.save-close': 'saveClose',
            'click a.save-continue': 'saveContinue',
            'submit form': 'saveClose',
            'click button.cancel': '_clickCancelButton'
        },
        initialize: function(){
        },
        serialize: function(){
            return this.jsonObj;
        },
        beforeRender: function() {
            var self = this;
            this.jsonObj = {};
            var defs = [];
            var done = this.async();
            //dev types
            var devTypeCollection = new DevTypeCollection();
            defs.push(devTypeCollection.fetch());
            //depts
            var deptCollection = new DeptCollection();
            defs.push(deptCollection.fetch());
            $.when.apply($, defs).done(function(){
                //types
                var types = [];
                _.each(devTypeCollection.models, function(one){
                    types.push(one.toJSON());
                });
                _.extend(self.jsonObj, {devTypeCollection: types});
                //depts
                var depts = [];
                _.each(deptCollection.models, function(one){
                    depts.push(one.toJSON());
                });
                _.extend(self.jsonObj, {deptCollection: depts});
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
                $(window).info(gettext('Add dev successful'));
                Backbone.history.navigate('/settings/dev', true);
            }).fail(_.bind(function(resp){
                if (resp && resp.responseJSON && resp.responseJSON.type === 'DevAlreadyExists') {
                    this.$('#DevAlreadyExists').addClass('show');
                }
                else if(resp){
                    $(window).info(gettext('Fail to add dev'));
                }
            },this));
        },
        saveContinue: function(e){
            e.preventDefault();
            var self = this;
            this._submitForm().done(function() {
                $(window).info(gettext('Add dev successful'));
                self.resetForm();
            }).fail(_.bind(function(resp){
                if (resp && resp.responseJSON && resp.responseJSON.type === 'DevAlreadyExists') {
                    this.$('#DevAlreadyExists').addClass('show');
                }
                else if(resp){
                    $(window).info(gettext('Fail to add dev'));
                }
            },this));
        },
        resetForm: function(){
            this.$('button[type="reset"]').trigger('click');
        },
        _submitForm: function() {
            var dtd = new $.Deferred();
            var serObj = this.$('form').serializeObject();

            var model = new DevModel(serObj);
            this.$('.error-messages').removeClass('show');
            if (!model.isValid()) {
                var errSpan = this.$('#' + model.validationError);
                errSpan.addClass('show');
                _.delay(function(){
                    dtd.reject();
                }, 0);
                return dtd.promise();
            }
            model.set('id', model.get('id').toUpperCase());
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
    return DevAddView;
});
