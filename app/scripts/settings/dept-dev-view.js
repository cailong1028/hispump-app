/**
 * Created by cailong on 2015/9/15.
 */
/*global define*/
'use strict';
define([
    'backbone',
    'settings/dev-model',
    'settings/dev-collection',
    'settings/dept-dev-pop-view'
], function(Backbone, DevModel, DevCollection, DeptDevPopView){


    var UnassignDevModel = Backbone.Model.extend({
        urlRoot: 'dev/unAssingDev'
    });

    var TableItemView = Backbone.View.extend({
        tagName: 'tr',
        template: 'templates:settings:dept-dev-table-item',
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
                    var unassignDevModel = new UnassignDevModel({id: this.model.id});
                    unassignDevModel.save().done(_.bind(function () {
                        $(window).info(gettext('Success to remove dev from dept'));
                        this.remove();
                    }, this)).fail(function () {
                        $(window).info(gettext('Fail to remove dev from dept'));
                    });
                    view.hide();
                }, this),
                text: {
                    title: 'Confirm Remove Dev Title',
                    content: 'Confirm Remove Dev Content'
                }
            });
        }
    });

    var deptDevListView;
    // 设备列表
    var DeptDevListView = Backbone.View.extend({
        template: 'templates:settings:dept-dev-table',
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
                        return new TableItemView({model: model});
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

    var DeptDevView = Backbone.View.extend({
        template: 'templates:settings:dept-dev',
        navigate: true,
        events: {
            'click #add-dev': '_showDevPopView'
        },
        initialize: function (o) {
            if(o){
                this.opts = o;
            }
        },
        serialize: function () {
        },
        beforeRender: function () {

        },
        afterRender: function () {
            this.listView = new DeptDevListView(this.opts);
            this.setView('.list', this.listView).render();
        },
        _showDevPopView: function(){
            this.setView('.dev-pop-view', new DeptDevPopView(this.opts, this)).render();
        }
    });
    return DeptDevView;
});
