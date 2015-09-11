/* global define, app,gettext */
'use strict';
define([
    'underscore',
    'backbone',
    'settings/agent-collection',
    'settings/agent-notclosed-ticket-model'
], function (_, Backbone, AgentCollection, NotClosedTicketNumModel) {
    if (app.___GETTEXT___) {
        // 确认删除客服提示标题
        gettext('Confirm Delete Agent Title');
        // 确定删除客服提示内容
        gettext('Confirm Delete Agent Content');
        //删除客服成功
        gettext('Delete agent successful');
        //不允许删除客服
        gettext('Delete Agent Forbidden Title');
        gettext('Delete Agent Forbidden Content');
    }
    var AgentsItemView = Backbone.View.extend({
        tagName: 'tr',
        template: 'templates:settings:agents-item',
        events: {
            'click button.delete': '_clickDeleteButton'
        },
        serialize: function () {
            var data = this.model.toJSON();
            return _.extend(data, {isCurrentManager: this.model.isCurrentManager(this.model)});
        },
        initialize: function () {
            // this.listenTo(this.model, 'destroy', function() {
            //     $(window).info(gettext('Delete agent successful'));
            //     this.remove();
            // });
        },
        _clickDeleteButton: function (e) {
            e.preventDefault();
            app.vent.trigger('confirm', {
                callback: _.bind(function (view) {
                    //var noteClosedTicketNumModel = new NotClosedTicketNumModel();
                    var agentId = this.model.get('loginname');
                    this.model.destroy().done(_.bind(function () {
                        $(window).info(gettext('Delete agent successful'));//TODO 提示信息需要国际化
                        this.remove();
                    }, this)).fail(function () {
                        $(window).info(gettext('Delete agent failure'));
                    });
                    view.hide();
                    // location.reload(true);
                }, this),
                text: {
                    title: 'Confirm Delete Agent Title',
                    content: 'Confirm Delete Agent Content'
                }
            });
        }
    });

    // 客服列表
    var AgentsListView = Backbone.View.extend({
        template: 'templates:settings:agents-table',
        collection: new AgentCollection(),
        initialize: function (o) {
            console.log('initialize');
            this.params = _.extend({}, o.params);
        },
        events: {
            'click button.forbidden-btn': '_clickOKButton'
        },
        afterRender: function () {
            if (this.params.filter === 'Deleted') {
                this.$('table').addClass('state-delete');
            }
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
            this.params.orderBy = $('#selectedSort').attr('data-sort');
            this.params.sort = $('#selectedSort').attr('data-type');
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
                    data: _.extend({page: page, unblock: ''}, this.params)
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

    var AgentsView = Backbone.View.extend({
        template: 'templates:settings:agents',
        events: {
            'change select.state': '_changeFilterState'
        },
        initialize: function () {
            /*
             this.listenTo(app.vent, 'add-contacts:successful', function() {
             this.render();
             });*/
        },
        serialize: function () {
            return {params: this.params};
        },
        beforeRender: function () {
            // confirmView = new DeleteConfirmView();
            // this.setView('.confirm-view', confirmView);
        },
        afterRender: function () {
            this.listView = new AgentsListView({params: this.params});
            this.setView('.list', this.listView).render();
            this.$('.dropdown-toggle').each(function () {
                $(this).dropdown();
            });
            this._initSort();
        },
        _initSort: function () {
            var that = this;
            var selectedSort = $('#selectedSort');
            var sortUl = $('#sortUl');
            var optLis = sortUl.children().not('[data-type="asc"], [data-type="desc"]');
            var typeLis = sortUl.find('[data-type="asc"], [data-type="desc"]');

            optLis.each(function () {
                $(this).unbind('click');
                $(this).click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    optLis.each(function () {
                        $(this).removeClass('active');
                    });
                    $(this).addClass('active');
                    selectedSort.text($(this).text());
                    selectedSort.attr('data-sort', $(this).attr('data-sort'));
                    sortUl.dropdown('toggle');
                    that.listView._fetchResults();
                });
            });
            typeLis.each(function () {
                $(this).unbind('click');
                $(this).click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    typeLis.each(function () {
                        $(this).removeClass('active');
                    });
                    $(this).addClass('active');
                    selectedSort.attr('data-type', $(this).attr('data-type'));
                    sortUl.dropdown('toggle');
                    that.listView._fetchResults();
                });
            });
        }
    });
    return AgentsView;
});
