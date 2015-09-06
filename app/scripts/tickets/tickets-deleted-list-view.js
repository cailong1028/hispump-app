/* global define, app, gettext */
'use strict';
define([
    'underscore',
    'backbone',
    'tickets/tickets-deleted-collection',
    'tickets/ticket-model'
], function(_, Backbone, TicketsDeletedColletion,TicketModel) {
    var pickTimeout = null;
    var TicketsItemView = Backbone.View.extend({
        tagName: 'tr',
        template: 'templates:tickets:tickets-deleted-item',
        events: {
            'click button.delete': '_clickDeleteButton',
            'click button.restore': '_clickRestoreButton'
        },
        serialize: function() {
            return this.model.toJSON();
        },
        initialize: function() {
            this.listenTo(this.model, 'destroy', function() {
                this.remove();
            });
        },
        _clickRestoreButton: function(e) {
            e.preventDefault();
            var model = new TicketModel({id: this.model.id});
            model.restore({wait: true})
                .done(function() {
                    $(window).info(gettext('restore ticket successful'));
                    Backbone.history.loadUrl();
                })
                .fail(function(){
                    $(window).info(gettext('restore ticket failure'));
                });
        },
        _clickDeleteButton: function(e) {
            e.preventDefault();
            app.vent.trigger('confirm', {
                callback: _.bind(function(view){
                    this.model.destroy();
                    view.hide();
                }, this),
                text: {
                    title: 'Confirm Delete Tieckets',
                    content: 'Delete Ticket?'
                }
            });
        }
    });
    var _changeButtonState = function() {
            if ($('input[name="pick"]:checked').length>0) {
                this.$('button.pickact').prop('disabled', false);
            } else {
                $('.picker').prop('checked',false);
                this.$('button.pickact').prop('disabled', true);
            }
            pickTimeout = undefined;
    };
    var TicketsDeletedTable = Backbone.View.extend({
        template: 'templates:tickets:tickets-deleted-table',
        collection: new TicketsDeletedColletion(),
        events: {
            'click .picker': '_clickPicker',
            'change .pick_td input': '_changePickCheckBox',
            'click #recovery': '_recovery'
        },
        _clickPicker: function(e) {
            var checked = $(e.target).prop('checked');
            this.$('.pick input').prop('checked', checked);
            if ($('.picker').prop('checked')) {
                this.$('button.pickact').prop('disabled', false);
            } else {
                this.$('button.pickact').prop('disabled', true);
            }
        },
        _renderBatchBtn: function(){
            var allItems = this.$('.pick_td input');
            var checkedItems = this.$('.pick_td input:checked');
            var picker = this.$('input.picker');
            picker.prop('checked', checkedItems.length === allItems.length);
        },
        _changePickCheckBox: function() {
            if (pickTimeout) { // 如果存在延时执行的方法，清除掉
                clearTimeout(pickTimeout);
            }
            // 延迟100ms执行
            pickTimeout = _.delay(/*before*/_.bind(_changeButtonState, this)/*end*/, 200);
            this._renderBatchBtn();
        },
        _recovery:function(e){
            e.preventDefault();
            var defs = _.map(this._getCheckedModels(), function(model) {
                return model.restore();
            }, this);
            $.when.apply($, defs).done(_.bind(function() {
                // TODO i18n
                $(window).info(gettext('restore ticket successful'));
                this._fetchResults();
                this.$('.pick input').prop('checked', '');
            }, this)).fail(function() {
                // TODO i18n
                $(window).info(gettext('restore ticket failure'));
            });
        },
        // 获取所有勾选的model
        _getCheckedModels: function() {
            return _.map(this.$('.pick_td input[type=checkbox]:checked'), function(e) {
                return new TicketModel({
                    id: $(e).val()
                });
            }, this);
        },
        initialize: function(o) {
            this.params = _.extend({}, o.params);
        },
        afterRender: function() {
            if (this.params.filter === 'Deleted') {
                this.$('table').addClass('state-delete');
            }
            this._fetchResults();

        },
        filterAlphabet: function(a) {
            if (a) {
                this.params.alphabet = a;
            } else {
                delete this.params.alphabet;
            }
            this._fetchResults();
        },
        _setItemViews: function() {
            if (this.collection.length > 0) { // 如果包含多个结果
                // 设置表格内容
                this.setViews({
                    'tbody': this.collection.map(function(model) {
                        return new TicketsItemView({model: model});
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
                $('.picker').prop('checked',false);
                this.$('.picker').prop('disabled', true);
                this.$('button.pickact').prop('disabled', true);
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
            if (this.pagination) {
                this.$('#pagination').pagination('destroy');
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
                    data: _.extend({page:page}, this.params)
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
                        href: '/settings/agents?page={{number}}',
                        onPageClick: function(e, page) {
                            fetch(page - 1);
                        }
                    });
                }, this));
        }
    });

    var ticketsDeletedTable;
    var TicketsDeletedListView = Backbone.View.extend({
        template: 'templates:tickets:tickets-deleted-list',
        initialize: function() {
        },
        serialize: function() {
            return {params: this.params};
        },
        beforeRender: function() {
        },
        afterRender: function() {
            this.listView = ticketsDeletedTable =  new TicketsDeletedTable({params: this.params});
            this.setView('.list', this.listView).render();
            this.$('.dropdown-toggle').each(function () {
                $(this).dropdown();
            });
        }
    });
    return TicketsDeletedListView;
});
