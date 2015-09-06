/* global define, app, gettext */
'use strict';
define([
    'underscore',
    'backbone',
    'settings/agent-model',
    'settings/agent-collection'
], function(_, Backbone, AgentModel, AgentCollection) {
    if (app.___GETTEXT___) {
        // 确定恢复客服标题
        gettext('Confirm Restore Agent Title');
        // 确定恢复客服内容
        gettext('Confirm Restore Agent Content');
    }

    var AgentsDeletedItemView = Backbone.View.extend({
        tagName: 'tr',
        template: 'templates:settings:agents-deleted-item',
        events: {
            'click button.restore': '_clickRestoreButton'
        },
        serialize: function() {
            return this.model.toJSON();
        },
        initialize: function() {
            // this.listenTo(this.model, 'destroy', function() {
            //     this.remove();
            // });
        },
        _clickRestoreButton: function(e) {
            e.preventDefault();
            console.log('_clickRestoreButton');
            app.vent.trigger('confirm', {
                callback: _.bind(function(view){
                    var model = new AgentModel({id: this.model.id});
                    model.restore().done(_.bind(function() {
                        $(window).info(gettext('Restore agent successful'));
                        this.remove();
                        agentsListView.render();
                    }, this))
                    .fail(function(){
                        $(window).info(gettext('Restore agent failure'));
                    });
                    view.hide();
                }, this),
                text: {
                    title: 'Confirm Restore Agent Title',
                    content: 'Confirm Restore Agent Content'
                }
            });
        }
    });

    // 客服列表
    var AgentsListView = Backbone.View.extend({
        template: 'templates:settings:agents-table',
        collection: new AgentCollection(),
        initialize: function(o) {
            console.log ('initialize');
            this.params = _.extend({}, o.params);
        },
        afterRender: function() {
            console.log ('after');
            if (this.params.filter === 'Deleted') {
                this.$('table').addClass('state-delete');
            }
            this._fetchResults();

        },
        _setItemViews: function() {
            if (this.collection.length > 0) { // 如果包含多个结果
                // 设置表格内容
                this.setViews({
                    'tbody': this.collection.map(function(model) {
                        return new AgentsDeletedItemView({model: model});
                    })
                });
                // 没有结果行隐藏。。。
                // 渲染子视图，显示结果。。。
                this.renderViews()
                    .promise()
                    .done(function() {
                        // 隐藏加载行
                        this.$('.loading').hide();
                    });
            } else {// 没有结果。。。
                this.$('.loading').hide();
                this.$('.non-items').show();
            }
        },
        _fetchParams: function () {
            this.params={};
            var sort=[];
            sort.push('lastModifiedDate');
            sort.push('desc');
            this.params.sort = sort.join(',');
            return this.params;
        },
        // 获取结果
        _fetchResults: function(page) {
            page = page || 0;
            // 删除所有已经存在的
            this.removeView('tbody');
            // 删除分页
            if (this.pagination === true) {
                this.pagination = false;
                try{
                    this.$('#pagination').pagination('destroy');
                }catch(e){
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
                    data: _.extend({page:page,block: ''}, this.params)
                })
                .done(_.bind(this._setItemViews, this))
                .done(_.bind(function() {
                    if (this.collection.page.totalPages < 1) {
                        return;
                    }
                    var fetch = _.bind(this._fetchResults, this),
                        page = this.collection.page;
                    this.pagination = true;
                    this.$('#pagination').pagination({
                        startPage: page.number + 1,
                        totalPages: page.totalPages,
                        href: '/settings/agents/trash?page={{number}}',
                        onPageClick: function(e, page) {
                            fetch(page - 1);
                        }
                    });
                }, this));
        }
    });

    var agentsListView;
    var AgentsDeletedView = Backbone.View.extend({
        template: 'templates:settings:agents-trash',
        events: {
        },
        serialize: function() {
            return {params: this.params};
        },
        afterRender: function() {
            this.listView = agentsListView =  new AgentsListView({params: this.params});
            this.setView('.list', this.listView).render();
            this.$('.dropdown-toggle').each(function () {
                $(this).dropdown();
            });
            this._initSort();
        },
        _initSort: function () {
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
                    agentsListView._fetchResults();
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
                    agentsListView._fetchResults();
                });
            });
        }
    });
    return AgentsDeletedView;
});
