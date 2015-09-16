/**
 * Created by cailong on 2015/7/23.
 */
/*global define*/
'use strict';
define([
    'backbone',
    'settings/dev-type-collection',
    'settings/dev-model'
],function(Backbone, DevTypeCollection, DevModel){

    var UnassignDevCollection = Backbone.Collection.extend({
        url: function(){
            return 'dev/unassign/list';
        },
        model: DevModel
    });

    var DeptDevPopTableItemView = Backbone.View.extend({
        template: 'templates:settings:dept-dev-pop-table-item',
        tagName: 'tr',
        className: 'pick'
    });

    var DeptDevPopTableView = Backbone.View.extend({
        template: 'templates:settings:dept-dev-pop-table',
        afterRender: function(){
            this.fetch();
        },
        _setItems: function(){
            if (this.collection.length > 0) { // 如果包含多个结果
                // 设置表格内容
                var that = this;
                this.setViews({
                    'tbody': this.collection.map(function (model) {
                        that.listenTo(model, 'destroy', function () {
                            this.render();
                        });
                        return new DeptDevPopTableItemView({model: model});
                    })
                });
                this.renderViews().promise().done(function () {
                    this.$('.loading').hide();
                });
            } else {// 没有结果。。。
                this.$('.loading').hide();
                this.$('.non-items').show();
            }
        },
        fetch: function(o){
            this.$('.loading').hide();
            this.$('.non-items').hide();

            o = o || {};
            var that = this;
            this.removeView('tbody');
            this.collection = new UnassignDevCollection();
            this.collection.fetch({data: o}).done(function(){
                that._setItems();
            });
        }
    });
    var deptDevPopTableView;
    var PopView = Backbone.View.extend({
        template: 'templates:settings:dept-dev-pop',
        className: 'pop-view modal fade',
        views: {
        },
        events: {
            'click .save': '_save',
            'change select': '_changeType',
            'click .picker': '_pickAll',
            'click .pick': '_pick'
        },
        initialize: function(o, deptDevView){
            this.opts = o;
            this.deptDevView = deptDevView;
        },
        serialize: function(){
            var json = {devtypes: []};
            _.each(this.devTypeCollection.models, function(oneModel){
                json.devtypes.push(oneModel.toJSON());
            });
            return json;
        },
        beforeRender: function(){
            var done = this.async();
            this.devTypeCollection = new DevTypeCollection();
            this.devTypeCollection.fetch({reset: true}).done(function(){
                done();
            });
        },
        afterRender: function(){
            this.$el.modal('show');
            this.setView('.list', deptDevPopTableView = new DeptDevPopTableView()).render();
        },
        _changeType: function(){
            deptDevPopTableView.fetch({type: this.$('select').val()});
        },
        _save: function(){
            var self = this;
            var pickedDevIds = [];
            var pickedDevs = this.$('.pick-input:checked');
            _.each(pickedDevs, function(one){
                pickedDevIds.push($(one).val());
            });
            var model = new Backbone.Model();
            model.url = function(){
                return 'dev/assign'
            };
            var data = _.extend({devids: pickedDevIds}, this.opts);
            model.save(data).done(function(){
                self.$el.modal('hide');
                self.deptDevView.listView._fetchResults();
            }).fail(function(){
                $(window).info(gettext('fail to add dev to dept'));
            });
        },
        _pickAll: function(){
            var pick_all = this.$('.picker-input');
            this.$('.pick-input').prop('checked', pick_all.prop('checked'));
        },
        _pick: function(){
            var pick_all = this.$('.picker-input');
            var trs = this.$('tr.pick');
            var picks = this.$('.pick-input:checked');
            pick_all.prop('checked', picks.length === trs.length);
        }
    });
    return PopView;
});
