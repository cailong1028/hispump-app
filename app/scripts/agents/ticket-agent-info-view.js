/* global define*/
'use strict';
define([
    'underscore',
    'backbone',
    'agents/ticket-agent-model',
    'settings/agent-tickets-collection'
], function(_, Backbone,TicketAgentModel,AgentTicketsCollection) {
    var TicketAgentInfoView = Backbone.View.extend({
        template: 'templates:agents:ticket-agent-info',
        beforeRender: function() {
            if (!this.model) {
                var userName;
                var done = this.async();
                this.model = new TicketAgentModel(this.options);
                this.model.fetch({
                    success:function(model){
                        userName = model.get('username');
                }},{wait: true}).done(_.bind(function(){
                    this.setView('.agentTicketList', new AgentTicketsView({username: userName}));
                    done();
                },this));
            }
        }
    });
    var AgentTicketsView = Backbone.View.extend({
        template: 'templates:settings:agent-tickets',
        events: {
            'click .alphabet a': '_clickAlphabet',
            'change select.state': '_changeFilterState'
        },
        initialize: function(o) {
            this.username = o.username;
            if (o && o.params) {
                this.params = o.params;
            }
        },
        serialize: function() {
            return {params: this.params};
        },
        beforeRender: function() {
        },
        afterRender: function() {
            this.listView = new AgentsTicketListView({params: this.params,username: this.username});
            this.setView('.list', this.listView).render();
        }
    });
    var AgentTicketsItemView = Backbone.View.extend({
        tagName: 'li',
        className:'timeline-list-item',
        template: 'templates:settings:agent-tickets-item',
        serialize: function() {
            return this.model.toJSON();
        },
        initialize: function() {
            this.listenTo(this.model, 'destroy', function() {
                this.remove();
            });
        }
    });

    var AgentInformationTicketsModel = Backbone.Model.extend({});

    var AgentsTicketListView = Backbone.View.extend({
        template: 'templates:settings:agent-ticket-list-table',
        collection: new AgentTicketsCollection(),
        initialize: function(o) {
            this.sort = 'createdDate,Desc';
            this.page = 0;
            this.model = new AgentInformationTicketsModel({sort: this.sort,page: this.page,assignee: this.username});
            this.username = o.username;
            this.params = _.extend({}, o.params);
        },
        afterRender: function() {
            if (this.params.filter === 'Deleted') {
                this.$('table').addClass('state-delete');
            }
            this._fetchResults(this.page);

        },
        _setItemViews: function() {
            if (this.collection.length > 0) { // 如果包含多个结果
                // 设置表格内容
                this.setViews({
                    '.timeline-list': this.collection.map(function(model) {
                        return new AgentTicketsItemView({model: model});
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


        setViewAllTicket: function(){
            var page = this.collection.page;
            if(page.totalPages > 1){
                this.$('.more-results').show();
                return;
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
            //this._fetchParams();
            this.collection
                .fetch({
                    reset: true,
                    push: false,
                    data: _.extend({assignee: this.username,page: page,sort: this.sort})
                })
                .done(_.bind(this._setItemViews, this))
                .done(_.bind(this.setViewAllTicket, this));
        },
    });

    return TicketAgentInfoView;
});
