/* global define, app, gettext*/
'use strict';
define([
    'underscore',
    'backbone',
    'settings/agent-model',
    'settings/agent-tickets-collection'
], function(_, Backbone, AgentModel,AgentTicketsCollection) {
    var confirmView;
    var AgentInfoView = Backbone.View.extend({
        template: 'templates:settings:agent-info',
        events: {
            'click button.cancel': '_clickCancelButton',
            'click button.Update Agent': '_clickUpdateAgent',
            'click button.restore': '_clickRestoreButton',
            'click button.Reset password': '_clickResetPassword'
        },
        beforeRender: function() {
            if (!this.model) {
                var userName;
                var done = this.async();
                this.model = new AgentModel(this.options);
                this.model.fetch({
                    success:function(model){
                        userName = model.get('username');
                }},{wait: true}).done(_.bind(function(){
                    this.setView('.agentTicketList', new AgentTicketsView({username: userName}));
                    done();
                },this));
            }
        },
        _clickCancelButton: function(e) {
            e.preventDefault();
            // history回退
            window.history.back(-1);
        },
        _clickUpdateAgent: function(e){
            e.preventDefault();
        },
        _clickResetPassword:function(e){
            e.preventDefault();
        },
        _clickRestoreButton: function(e) {
            e.preventDefault();
            var model = new AgentModel({id: this.model.id});
            app.vent.trigger('confirm', {
                callback: _.bind(function(view){
                    model.restore().done(_.bind(function() {
                        $(window).info(gettext('Restore agent successful'));
                        Backbone.history.navigate('/settings/agents/trash', true);
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
        },
        _clickAlphabet: function(e) {
            e.preventDefault();
            e.stopPropagation(); // 停止冒泡
            this.$('.alphabet a').removeClass('active');
            var $target = $(e.target);
            $target.addClass('active');
            this.listView.filterAlphabet($target.attr('href'));
        },
        _changeFilterState: function(e) {
            var $e = $(e.target);
            this.listView.filterState($e.val());
        }
    });
    var AgentTicketsItemView = Backbone.View.extend({
        tagName: 'li',
        className:'timeline-list-item',
        template: 'templates:settings:agent-tickets-item',
        events: {
            'click button.delete': '_clickDeleteButton'
        },
        serialize: function() {
            return this.model.toJSON();
        },
        initialize: function() {
            this.listenTo(this.model, 'destroy', function() {
                this.remove();
            });
        },
        _clickDeleteButton: function(e) {
            e.preventDefault();
            confirmView.show({
                callback: _.bind(function(view){
                    this.model.destroy();
                    view.$el.modal('hide');
                }, this)
            });
        }
    });

    var AgentInformationTicketsModel = Backbone.Model.extend({});

    var AgentsTicketListView = Backbone.View.extend({
        template: 'templates:settings:agent-ticket-list-table',
        collection: new AgentTicketsCollection(),
        initialize: function(o) {
            console.log ('initialize');
            this.sort = 'createdDate,Desc';
            this.page = 0;
            this.model = new AgentInformationTicketsModel({sort: this.sort,page: this.page,assignee: this.username});
            this.username = o.username;
            this.params = _.extend({}, o.params);
        },
        afterRender: function() {
            console.log ('after');
            if (this.params.filter === 'Deleted') {
                this.$('table').addClass('state-delete');
            }
            this._fetchResults(this.page);

        },
        filterAlphabet: function(a) {
            if (a) {
                this.params.alphabet = a;
            } else {
                delete this.params.alphabet;
            }
            this._fetchResults();
        },
        filterState: function(a) {
            this.params.filter = a;
            this._fetchResults();
            if (a === 'Deleted') {
                this.$('table').addClass('state-delete');
            } else {
                this.$('table').removeClass('state-delete');
            }
        },
        _resetPicker: function() {
            this.$('.picker').prop('checked', false);
            this.$('button.pickact').prop('disabled', true);
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
        // _fetchParams: function () {
        // 	this.params={};
        // 	var username=($('#username').attr('data-type'));
        //     this.params.username = username;
        //     return this.params;
        // },
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
            this.$('.more-results').hide();
            //this._fetchParams();
            this.collection
                .fetch({
                    reset: true,
                    push: false,
                    data: {assignee: this.username,page: page,sort: this.sort}
                })
                .done(_.bind(this._setItemViews, this))
                .done(_.bind(this.setViewAllTicket, this));
            // end function ;
            this._resetPicker();
        },
    });

    return AgentInfoView;
});
