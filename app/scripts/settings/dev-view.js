/**
 * Created by cailong on 2015/9/13.
 */
/*global define*/
'use strict';
define([
    'backbone',
    'settings/dev-model',
    'settings/dev-collection',
    'settings/dev-type-model',
    'settings/dev-type-collection'
], function(Backbone, DevModel, DevCollection, DevTypeModel, DevTypeCollection){

    var AgentsItemView = Backbone.View.extend({
        tagName: 'tr',
        template: 'templates:settings:dev-table-item',
        events: {
            'click button.delete': '_clickDeleteButton'
        },
        serialize: function () {
            return this.model.toJSON();
        },
        initialize: function () {
        },
        _clickDeleteButton: function (e) {
            e.preventDefault();
            app.vent.trigger('confirm', {
                callback: _.bind(function (view) {
                    this.model.destroy().done(_.bind(function () {
                        $(window).info(gettext('Delete dev successful'));//TODO 提示信息需要国际化
                        this.remove();
                    }, this)).fail(function () {
                        $(window).info(gettext('Delete dev failure'));
                    });
                    view.hide();
                }, this),
                text: {
                    title: 'Confirm Delete Dev Title',
                    content: 'Confirm Delete Dev Content'
                }
            });
        }
    });

    // 设备列表
    var DevListView = Backbone.View.extend({
        template: 'templates:settings:dev-table',
        collection: new DevCollection(),
        initialize: function (o) {
            if(o){
                this.opts = o;
            }
        },
        events: {
            'click button.forbidden-btn': '_clickOKButton'
        },
        afterRender: function () {
            this._fetchResults();
        },
        _setItemViews: function () {
            if (this.collection.length > 0) { // 如果包含多个结果
                // 设置表格内容
                var that = this;
                this.setViews({
                    'tbody': this.collection.map(function (model) {
                        that.listenTo(model, 'destroy', function () {
                            this.render();
                        });
                        that.listenTo(app.vent, 'delete-agent:forbidden', function () {
                            this.$('#forbiddenModel').modal('show');
                            return false;
                        });
                        return new AgentsItemView({model: model});
                    })
                });
                // 没有结果行隐藏。。。
                // 渲染子视图，显示结果。。。
                this.renderViews()
                    .promise()
                    .done(function () {
                        // 隐藏加载行
                        this.$('.loading').hide();
                    });
            } else {// 没有结果。。。
                this.$('.loading').hide();
                this.$('.non-items').show();
            }
        },
        _clickOKButton: function () {
            this.$('#forbiddenModel').modal('hide');
        },
        _fetchParams: function () {
            this.params = {};
            this.params.type = parseInt($('#dev-types').val(), 10);
            if(this.opts){
                _.extend(this.params, this.opts);
            }
            return this.params;
        },
        // 获取结果
        _fetchResults: function (page) {
            page = page || 0;
            // 删除所有已经存在的
            this.removeView('tbody');
            // 删除分页
            if (this.pagination === true) {
                this.pagination = false;
                try {
                    this.$('#pagination').pagination('destroy');
                } catch (e) {
                    //TODO
                }
                delete this.pagination;
            }
            // 展示加载行
            this.$('.loading').show();
            // 隐藏没有数据行
            this.$('.non-items').hide();
            this._fetchParams();
            this.collection
                .fetch({
                    reset: true,
                    data: _.extend({orderBy: 'lastestmodifytime', sort: 'desc', page: page}, this.params)
                })
                .done(_.bind(this._setItemViews, this))
                .done(_.bind(function () {
                    if (this.collection.page.totalPages < 1) {
                        return;
                    }
                    var fetch = _.bind(this._fetchResults, this),
                        page = this.collection.page;
                    this.pagination = true;
                    this.$('#pagination').pagination({
                        startPage: page.number + 1,
                        totalPages: page.totalPages,
                        href: '/settings/agents?page={{number}}',
                        onPageClick: function (e, page) {
                            fetch(page - 1);
                        }
                    });
                }, this));
        }
    });

    var DevView = Backbone.View.extend({
        template: 'templates:settings:dev',
        events: {
            'change select.state': '_changeFilterState',
            'change select#dev-types': '_changeDevType'
        },
        initialize: function (o) {
            if(o){
                this.opts = o;
            }
            this.devTypeCollection = new DevTypeCollection();
        },
        serialize: function () {
            var devTypeCollection = [];
            _.each(this.devTypeCollection.models, function(one){
                devTypeCollection.push(one.toJSON());
            });
            return {devTypeCollection: devTypeCollection};
        },
        beforeRender: function () {
            var done = this.async();
            this.devTypeCollection.fetch().done(function(){
                done();
            });
        },
        afterRender: function () {
            if(this.opts){
                this.listView = new DevListView(this.opts);
            }else{
                this.listView = new DevListView();
            }
            this.setView('.list', this.listView).render();
        },
        _changeDevType: function () {
            this.listView._fetchResults();
        }
    });
    return DevView;
});
