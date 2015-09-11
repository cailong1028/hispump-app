/* global define ,client*/
'use strict';
define([
    'underscore',
    'backbone',
    'moment',
    'agent/home-package-model',
    'agent/home-activities-collection',
    'moment-timezone'
], function(_,Backbone,moment,HomePackageModel,HomeActivitiesCollection) {

    //汇总
    var TicketTotalView = Backbone.View.extend({
        template : 'templates:agent:home-ticket-total',
        events : {
            'click ul li:eq(0)' : '_overdue',//我的逾期
            'click ul li:eq(1)' : '_processing',//我的处理中
            'click ul li:eq(2)' : '_paused',//我的等待回复
            'click ul li:eq(3)' : '_today',//我的今日到期
            'click ul li:eq(4)' : '_noassinged'//全部未指派
        },
        _overdue: function() {
            Backbone.history.navigate('/tickets?assigned-to-me=me&expiresIn=expired',true);
        },
        _processing: function() {
            Backbone.history.navigate('/tickets/filters/my-tickets',true);
        },
        _paused: function() {
            Backbone.history.navigate('/tickets?assigned-to-me=me&state=Pending',true);
        },
        _today: function() {
            Backbone.history.navigate('/tickets?assigned-to-me=me&expiresIn=today',true);
        },
        _noassinged: function() {
            Backbone.history.navigate('/tickets?unassigned=',true);
        }
    });

    var ActivateItemView = Backbone.View.extend({
        template : 'templates:agent:home-ticket-item',
        //tagName: 'tr',
        tagName: 'li'
    });

    //工单列表 可以是一个集合
    var ActiviesView = Backbone.View.extend({
        template : 'templates:agent:home-activies',
        events : {
            'click .more' : '_more'
        },
        initialize: function() {
            this.collection = new HomeActivitiesCollection();
            this.timestamp = moment().toISOString();
        },
        setItemViews: function() {
            if(this.collection.length > 0){
                //如果有数据的话
                this.setViews({
                    '.list': this.collection.map(function(model) {
                        return new ActivateItemView({model: model});
                    })
                });
                // 渲染子视图，显示结果。。。
                this.renderViews()
                    .promise()
                    .done(function() {
                        // 隐藏加载提示
                        this.$('.loading').hide();
                    });
            }else{
                //没有数据显示无数据的提示
                this.$('.non-items').show();
                //隐藏正在加载提示
                this.$('.loading').hide();
            }
        },
        beforeRender: function() {
            //render 之前 界面还没有渲染
        },
        afterRender: function() {
            this.fetchSearchResult();
        },
        fetchSearchResult : function(page){
            //显示正在加载提示
            this.$('.loading').show();
            //隐藏无数据提示
            this.$('.non-items').hide();
            //fetch 数据之后，bind一个触发事件
            this.collection.fetch({reset : false,push : true,data:{page:page,timestamp:this.timestamp}})
                .done(_.bind(this.setItemViews, this))
                .done(_.bind(function() {//处理分页
                    var page = this.collection.page;
                    //联调时放开注释进行测试
                    if (page.totalPages < 1 || page.number+1 === page.totalPages) {
                         this.$('.more').hide();
                         return;
                    }
                }, this));
        },
        _more: function(e){
            console.log();
            e.preventDefault();
            var page = this.collection.page;
            this.fetchSearchResult(page.number+1);
        }
    });

    //个人侧写 profile
    //一个展示的view 一个编辑的view
    var UserProfileView = Backbone.View.extend({
        template : 'templates:agent:home-user-profile',
    });

    var HomeView = Backbone.View.extend({
        template: 'templates:agent:home',
        model: new HomePackageModel(),
        //此处拿到所有的数据
        initialize: function(){
        },
        serialize: function(){

        },
        beforeRender: function(){
        },
        afterRender: function(){
            this.model.fetch().done(_.bind(this.renderAllView, this));
        },
        renderAllView: function(){
            this.setView('.ticket-total', new TicketTotalView({model : this.model.get('totalTicket')})).render();
            // 获取用户的信息 client 直接可获取返回一个model
            this.setView('.information', new UserProfileView({model : client.profile()})).render();
            this.setView('.activies', new ActiviesView()).render();
        }
    });
    return HomeView;
});
