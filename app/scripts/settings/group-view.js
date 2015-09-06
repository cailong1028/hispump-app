/* global define, gettext*/
'use strict';
define([
    'underscore',
    'backbone',
    'settings/group-collection',
    'settings/group-model',
    'settings/group-prompt-view'
], function(_, Backbone, GroupCollection, GroupModel, PromptView) {
    var GroupListView = Backbone.View.extend({
        template: 'templates:settings:group-list',
        collection: new GroupCollection(),
        initialize: function(){
        },
        events: {
            'click .picker': '_clickPicker'
        },
        _clickPicker: function(e){
            $('.pick input').prop('checked', $(e.target).prop('checked'));
        },
        afterRender: function(){
            this.fetch();
        },
        fetch: function(page){
            page = page || 0;
            // 删除分页
            if (this.pagination === true) {
                this.pagination = false;
                this.$('#pagination').pagination('destroy');
                delete this.pagination;
            }
            // 删除所有已经存在的
            this.removeView('tbody');
            // 展示加载行
            this.$('.loading').show();
            // 隐藏没有数据行
            this.$('.non-items').hide();

            this.params = _.extend({page: page, sort: 'name'}, this.queryParams);
            this.collection
                .fetch({data: _.extend({page:page}, this.params) || {}, reset: true})
                .done(_.bind(function() {
                    if(this.collection.length === 0){
                        this.$('.loading').hide();
                        this.$('.non-items').show();
                    }else{
                        this.collection.each(_.bind(function(model) {
                            this.insertView('tbody', new GroupItemView({model: model}));
                        }, this));
                        $.when(this.renderViews()).done(_.bind(function(){
                            this.$('.loading').hide();
                        }, this));
                    }
                    //done();
                }, this))
                .done(_.bind(function() {
                    if (this.collection.page.totalPages < 1) {
                        return;
                    }
                    var fetch = _.bind(this.fetch, this),
                        page = this.collection.page;
                    this.pagination = this.$('#pagination').pagination({
                        startPage: page.number + 1,
                        totalPages: page.totalPages,
                        href: '/groups?page={{number}}',
                        onPageClick: function(e, page) {
                            fetch(page - 1);
                        }
                    });
                }, this));
        }
    });

    var groupListView;

    var LayerView = Backbone.View.extend({
        template: 'templates:settings:group-confirm',
        className: 'confirm-modal modal fade',
        events: {
            'click .confirm-yes': '_confirmYes',
            'click .confirm-cancel': '_confirmCancel'
        },
        _confirmYes: function(e){
            e.preventDefault();
            this.callback(this);
        },
        _confirmCancel: function(e){
            e.preventDefault();
            this.$el.modal('hide');
        },
        show: function(o) {
            if (!o.callback) {
                throw 'function show need confirm callback function. {callback: function() {...}}';
            }
            this.callback = o.callback;
            this.$el.modal('show');
            _.delay(_.bind(function() {
                this.$('button.ok').focus();
            }, this), 300);
        }
    });

    var layerView;
    var promptView;

    var GroupItemView = Backbone.View.extend({
        tagName: 'tr',
        events: {
            'click .group-update': '_groupUpdate',
            'click .group-delete': '_groupDelete',
            'click .picker_td': '_clickPick'
        },
        template: 'templates:settings:group-item',
        serialize: function(){return this.model.toJSON();},
        initialize: function() {
            // this.listenTo(this.model, 'destroy', function() {
            //     this.remove();
            //     $(window).info(gettext('Delete group successful'));//TODO 提示信息需要国际化
            // });
        },
        afterRender: function(){
            this.on('click:.picker_td', function(){
            });
        },
        _groupDelete: function(e){
            e.preventDefault();
            e.stopPropagation();
            layerView.show({
                callback: _.bind(function(view){
                    this.model.destroy().done(_.bind(function(){
                        $(window).info(gettext('Delete group successful'));//TODO 提示信息需要国际化
                        this.remove();
                        groupListView.render();
                    },this))
                    .fail(function(){
                        $(window).info(gettext('Delete group failure'));
                    });
                    view.$el.modal('hide');
                }, this)
            });
        },
        _groupUpdate: function(e){
            e.preventDefault();
            e.stopPropagation();
            Backbone.history.navigate('settings/group/'+this.model.id+'/form', true);
        },
        _clickPick: function(){
            console.log('click .picker_td');
        }
    });

    var GroupView = Backbone.View.extend({
        template: 'templates:settings:group',
        events: {
        },
        initialize: function(){
        },
        views:{
        },
        beforeRender: function(){
        },
        afterRender: function(){
            groupListView = new GroupListView();
            layerView = new LayerView();
            //TODO 提示信息需要国际化
            promptView = new PromptView({info: '添加组成功'});
            this.setView('.list', groupListView).render();
            this.setView('.confirm-layer', layerView).render();
        }
    });
    return GroupView;
});
