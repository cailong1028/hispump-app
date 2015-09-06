/* global define */
'use strict';
define([
    'underscore',
    'backbone',
    'search/search-result-collection',
    'search/search-contact-collection',
    'search/search-corporation-collection',
    'search/search-ticket-collection'
], function(_, Backbone, SearchResultCollection, SearchContactsCollection, SearchCorporationsCollection,SearchTicketsCollection) {
    var requestType = ['all','contacts','corporations','tickets'];

    var SEARCH_NAV_MODULES_SELECTOR = '#search-navbar';
    var SearchModel = Backbone.Model.extend({});

    //联系人单条数据view
    var SearchContactsItemView = Backbone.View.extend({
        tagName: 'tr',
        template: 'templates:search:search-contacts-item',
        serialize: function() {
            return this.model.toJSON();
        },
        initialize: function() {
            this.listenTo(this.model, 'destroy', function() {
                this.remove();
            });
        }
    });
    //公司单条数据view
    var SearchCorporationsItemView = Backbone.View.extend({
        tagName : 'tr',
        template : 'templates:search:search-corporations-item',
        serialize : function() {
            return this.model.toJSON();
        }
    });

    var SearchTicketsChildModel = Backbone.Model.extend({
    });
    var SearchTicketsChildItemView = Backbone.View.extend({
        tagName : 'li',
        template: 'templates:search:search-tickets-child-item',
        serialize : function () {
            return this.model.toJSON();
        }
    });
    //工单单条数据view
    var SearchTicketsItemView = Backbone.View.extend({
        tagName : 'tr',
        template : 'templates:search:search-tickets-item',
        serialize : function () {
            return this.model.toJSON();
        },
        renderChild : function(list){
            if(_.size(list) === 0) {return null;}
            _.each(list,function(model){
                var ticketChild = new SearchTicketsChildModel();
                ticketChild.set('description',model.description);
                ticketChild.set('id',model.id);
                ticketChild.set('createdBy',model.createdBy);
                this.insertView('.status-child', new SearchTicketsChildItemView({model : ticketChild})).render();
            }, this);
        },
        afterRender : function(){
            this.renderChild(this.model.get('status'));
        }
    });
    //全部类型单条数据view
    var SearchResultsItemView = Backbone.View.extend({
        tagName : 'tr',
        template : 'templates:search:search-result-item',
        serialize : function () {
            return this.model.toJSON();
        },
        renderChild : function(list){
            if(_.size(list) === 0) {return null;}
            _.each(list,function(model){
                var ticketChild = new SearchTicketsChildModel();
                ticketChild.set('description',model.description);
                ticketChild.set('id',model.id);
                ticketChild.set('createdBy',model.createdBy);
                this.insertView('.status-child', new SearchTicketsChildItemView({model : ticketChild})).render();
            }, this);
        },
        afterRender : function(){
            this.renderChild(this.model.get('status'));
        }
    });
    //检索联系人列表view
    var SearchResultListView = Backbone.View.extend({
        template: 'templates:search:search-table',
        initialize: function(o) {
            //得到查询参数
            this.params = _.extend({}, o.params);
            //通过不同的 active 值选择使用哪个 collection all/contact/corporation/ticket
            if(this.params.active === requestType[0]){
                this.collection = new SearchResultCollection();
            }else if(this.params.active === requestType[1]) {
                this.collection = new SearchContactsCollection();
            }else if(this.params.active === requestType[2]) {
                this.collection = new SearchCorporationsCollection();
            }else if (this.params.active === requestType[3]) {
                this.collection = new SearchTicketsCollection();
            }
        },
        setItemViews: function() {
            if(this.collection.length > 0){
                //如果有数据的话
                //判断使用哪种数据承载视图
                if(this.params.active === requestType[0]){
                    this.setViews({
                        'tbody': this.collection.map(function(model) {
                            return new SearchResultsItemView({model: model});
                        })
                    });
                }else if(this.params.active === requestType[1]) {
                    // 设置表格内容
                    this.setViews({
                        'tbody': this.collection.map(function(model) {
                            return new SearchContactsItemView({model: model});
                        })
                    });
                }else if(this.params.active === requestType[2]) {
                    this.setViews({
                        'tbody': this.collection.map(function(model) {
                            return new SearchCorporationsItemView({model: model});
                        })
                    });
                }else if (this.params.active === requestType[3]) {
                    this.setViews({
                        'tbody': this.collection.map(function(model) {
                            return new SearchTicketsItemView({model: model});
                        })
                    });
                }
                // 渲染子视图，显示结果。。。
                this.renderViews()
                    .promise()
                    .done(function() {
                        // 隐藏加载提示
                        this.$('.now-search').hide();
                    });
            }else{
                //没有数据显示无数据的提示
                this.$('.no-search').show();
                //隐藏正在加载提示
                this.$('.now-search').hide();
            }
        },
        beforeRender: function() {
            //render 之前 界面还没有渲染
        },
        afterRender: function() {
            this.fetchSearchResult();
        },
        fetchSearchResult : function(page){
            page = page || 0;
            // 删除tboby 中已经存在的内容
            this.removeView('tbody');
            // 删除分页
            if (this.pagination) {
                this.$('#pagination').pagination('destroy');
                delete this.pagination;
            }
            //显示正在加载提示
            this.$('.now-search').show();
            //隐藏无数据提示
            this.$('.no-search').hide();
            //fetch 数据之后，bind一个触发事件
            this.collection.fetch({reset : true,data:{page:page,term:encodeURIComponent(this.params.term)}})
                .done(_.bind(this.setItemViews, this))
                .done(_.bind(function() {//处理分页
                    if (this.collection.page.totalPages < 1) {
                        return;
                    }
                    var fetch = _.bind(this.fetchSearchResult, this),
                        page = this.collection.page;
                    this.pagination = true;
                    var hrefroot = this.params.active;
                    //当检索全部类型数据的时候 root为空
                    if(hrefroot === requestType[0]){
                        hrefroot = '';
                    }
                    this.$('#pagination').pagination({
                        startPage: page.number + 1,
                        totalPages: page.totalPages,
                        href: hrefroot + '?page={{number}}',
                        onPageClick: function(e, page) {
                            fetch(page - 1);
                        }
                    });
                }, this));
        }
    });

    var searchResultListView;

    //检索主面板view
    var SearchResultsView = Backbone.View.extend({
        template: 'templates:search:search',
        events: {
            'submit form': 'searchForm'
        },
        initialize: function() {

        },
        beforeRender: function() {
            //渲染之前初始化查询model input检索框中的数据
                if (!this.model) {
                    this.model = new SearchModel(this.options);
                }else{
                }
        },
        afterRender: function() {
            //加载列表数据view this.options 是查询参数
            //navbar 切换
            this.$(SEARCH_NAV_MODULES_SELECTOR + ' li.active').removeClass('active');
            this.$(SEARCH_NAV_MODULES_SELECTOR + ' li.' + this.options.active).addClass('active');
            this.listView = searchResultListView =  new SearchResultListView({params:this.options});
            this.setView('.resultlist', this.listView).render();
        },
        searchForm: function(e){
            //不触发按钮的默认事件
            e.preventDefault();
            var data = this.$('form').serializeObject();
            //导航至router 中的 search 查询url data.term 为查询条件
            Backbone.history.navigate('/search/all?term=' + data.term, true);
        }
    });
    return SearchResultsView;
});
