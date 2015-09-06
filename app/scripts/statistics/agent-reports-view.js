/* global define */
'use strict';
define([
    'underscore',
    'backbone',
    'statistics/agent-reports-collection'
], function(_, Backbone, AgentReportsCollection) {
    var type = '24hours';
    var SelectedTimeView = Backbone.View.extend({
        template: 'templates:statistics:agent-selected-day',
        events: {
            'submit form': '_submitForm'
        },
        _submitForm: function(e) {
            //不触发按钮的默认事件
            e.preventDefault();
            var typeTime = this.$('#selectedMethod').val();
            Backbone.history.navigate('statistics/agentreports/' + typeTime, false);
            this.trigger('show:report', typeTime);
        }
    });
    var AgentReportsItemView = Backbone.View.extend({
        tagName: 'tr',
        template: 'templates:statistics:agent-reports-item',
        serialize: function() {
            return this.model.toJSON();
        }
    });

    var AgentReportsTdView = Backbone.View.extend({
        template: 'templates:statistics:agent-reports-td',
        serialize: function() {
            return this.model.toJSON();
        }
    });

    // 客服报表
    var AgentReportsListView = Backbone.View.extend({
        template: 'templates:statistics:agent-reports-table',
        collection: new AgentReportsCollection(),
        initialize: function(o) {
            if(o.params!==undefined && o.params!==null) {
                this.params = o.params;
            }
        },
        afterRender: function() {
            this._fetchResults();
        },
        _setItemViews: function() {
            var createdTicketsNum = 0;
            var openedTicketsNum = 0;
            var pendingTicketsNum = 0;
            var resolvedTicketsNum = 0;
            var closedTicketsNum = 0;
            this.setViews({
                'div': new AgentReportsTdView({model: this.collection.models[0]})
            });
            if (this.collection.length > 0) { // 如果包含多个结果
                // 设置表格内容
                this.setViews({
                    'tbody': this.collection.map(function(model) {
                        createdTicketsNum = createdTicketsNum + parseInt(model.get('createdTicketsNum'));
                        openedTicketsNum = openedTicketsNum + parseInt(model.get('openedTicketsNum'));
                        pendingTicketsNum = pendingTicketsNum + parseInt(model.get('pendingTicketsNum'));
                        resolvedTicketsNum = resolvedTicketsNum + parseInt(model.get('resolvedTicketsNum'));
                        closedTicketsNum = closedTicketsNum + parseInt(model.get('closedTicketsNum'));
                        return new AgentReportsItemView({model: model});
                    })
                });
                // 没有结果行隐藏。。。
                // 渲染子视图，显示结果。。。
                this.renderViews()
                    .promise()
                    .done(function() {
                        // 隐藏加载行
                        this.$('.loading').hide();
                        this.$('#createdTicketsNumSum').html(createdTicketsNum);
                        this.$('#openedTicketsNumSum').html(openedTicketsNum);
                        this.$('#pendingTicketsNumSum').html(pendingTicketsNum);
                        this.$('#resolvedTicketsNumSum').html(resolvedTicketsNum);
                        this.$('#closedTicketsNumSum').html(closedTicketsNum);
                    });
            } else {// 没有结果。。。
                this.$('.loading').hide();
                this.$('.non-items').show();
                this.$('.total').hide();
            }
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
            this.collection.url = _.bind(function(){
                return 'statistics/agentreports/' + this.params;
            }, this);
            this.collection.fetch({
                reset: true,
            })
            .done(_.bind(this._setItemViews, this));
        }
    });

    var agentReportsListView;
    var AgentReportsView = Backbone.View.extend({
        template: 'templates:statistics:agent-reports',
        beforeRender: function() {
            var selectedTimeView = new SelectedTimeView();
            this.listenTo(selectedTimeView, 'show:report', function(options) {
                this.params = options;
                this.listView = agentReportsListView =  new AgentReportsListView({params: this.params});
                this.setView('.list', this.listView).render();
            });
            this.setView('.selected-time', selectedTimeView);
        },
        afterRender: function() {
            this.listView = agentReportsListView =  new AgentReportsListView({params: type});
            this.setView('.list', this.listView).render();
        }
    });
    return AgentReportsView;
});
