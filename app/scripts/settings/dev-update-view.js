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
    var DevUpdateView = Backbone.View.extend({
        template: 'templates:settings:dev-update',
        events: {
            'click button.submit': '_submitForm',
            'submit form': '_submitForm',
            'reset form': '_resetForm',
            'click button.cancel': '_clickCancelButton'
        },
        initialize: function(o){
            this.options = o;
        },
        serialize: function(){
            return this.jsonObj;
        },
        beforeRender: function() {
            var self = this;
            this.jsonObj = {};
            var defs = [];
            var done = this.async();
            if (!this.model) {
                this.model = new DevModel(this.options);
                defs.push(this.model.fetch({}, {wait: true}));
            }
            //dev types
            var devTypeCollection = new DevTypeCollection();
            defs.push(devTypeCollection.fetch());
            //depts
            var deptCollection = new DeptCollection();
            defs.push(deptCollection.fetch());
            $.when.apply($, defs).done(function(){
                //dev model
                _.extend(self.jsonObj, {model: self.model.toJSON()});
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
            //this._setTypeAndDept();
        },
        _setTypeAndDept: function(){
            this.$('#dev-types').val(this.model.get('type')+'');
            this.$('#depts').val(this.model.get('deptid')+'');
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
            var serObj = this.$('form').serializeObject();
            var data = _.omit(serObj, this.model.idAttribute);
            var model = new DevModel({id: this.model.id});
            model.set(data);
            this.$('.error-messages').removeClass('show');
            if (!model.has('name') || _s.trim(model.get('name')) === '') {
                this.$('#name_required').addClass('show');
                return;
            }
            if (!model.has('type') || _s.trim(model.get('type')) === '0') {
                this.$('#Dev_type_required').addClass('show');
                return;
            }
            model.set('id', model.get('id').toUpperCase());

            this.trimObj(model.attributes);
            model.save({}, {wait: true, validate: false}).done(function() {
                $(window).info(gettext('Update dev successful'));
                Backbone.history.navigate('/settings/dev', true);
            }).fail(_.bind(function(resp){
            },this));
        },
        trimObj: function(obj){
            _.each(_.keys(obj), function(oneKey){
                obj[oneKey] = _s.trim(obj[oneKey]);
            });
        }
    });
    return DevUpdateView;
});
