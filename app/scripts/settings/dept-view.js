/**
 * Created by cailong on 2015/9/15.
 */
/*global define*/
'user strict';
define([
    'backbone',
    'settings/dept-model',
    'settings/dept-collection'/*,
    'settings/dept-dev-view'*/
], function(Backbone, DeptModel, DeptCollection/*, DeptDevView*/){
    var DeptItemView = Backbone.View.extend({
        tagName: 'tr',
        template: 'templates:settings:dept-table-item',
        events: {
            'click button.delete': '_deleteDept'
        },
        serialize: function () {
            return this.model.toJSON();
        },
        initialize: function () {
        },
        _deleteDept: function (e) {
            e.preventDefault();
            app.vent.trigger('confirm', {
                callback: _.bind(function (view) {
                    this.model.destroy().done(_.bind(function () {
                        $(window).info(gettext('Delete dept successful'));//TODO 提示信息需要国际化
                        this.remove();
                    }, this)).fail(function () {
                        $(window).info(gettext('Delete dept failure'));
                    });
                    view.hide();
                }, this),
                text: {
                    title: 'Confirm Delete Dept Title',
                    content: 'Confirm Delete Dept Content'
                }
            });
        }
    });

    // 科室列表
    var DeptListView = Backbone.View.extend({
        template: 'templates:settings:dept-table',
        collection: new DeptCollection(),
        initialize: function (o) {
        },
        events: {
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
                        return new DeptItemView({model: model});
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
            this.collection.fetch({
                reset: true,
                data: {orderBy: 'dept_code', sort: 'asc', page: page}
            }).done(_.bind(this._setItemViews, this))
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

    var DeptView = Backbone.View.extend({
        template: 'templates:settings:dept',
        events: {
            'change select.state': '_changeFilterState',
            'change select#dev-types': '_changeDevType'
        },
        initialize: function () {
        },
        serialize: function () {
        },
        beforeRender: function () {
        },
        afterRender: function () {
            this.listView = new DeptListView();
            this.setView('.list', this.listView).render();
        }
    });
    return DeptView;
});
