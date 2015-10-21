/* global define ,client*/
'use strict';
define([
    'underscore',
    'backbone',
    'moment',
    'agent/home-package-model',
    'agent/home-activities-collection',
    'settings/dev-collection',
    'amcharts',
    'moment-timezone'
], function(_,Backbone,moment,HomePackageModel,HomeActivitiesCollection, DevCollection, AmCharts) {

    var homeDevTableView;
    var chartView;

    //汇总
    var ChartView = Backbone.View.extend({
        template : 'templates:agent:home-chart',
        afterRender: function(){
            this._renderChart();
        },
        _renderChart: function(){
            var chartData = [{
                status: "在线",
                count: 100
            }, {
                status: "离线",
                count: 301
            }];

            var collection = new Backbone.Collection();
            collection.url = function(){
                return 'dev/status/info';
            };

            collection.fetch().done(function(data){
                // PIE CHART
                new AmCharts.AmPieChart({
                    dataProvider: data,
                    titleField: "status",
                    valueField: "count",
                    outlineColor: "#FFFFFF",
                    outlineAlpha: 0.8,
                    outlineThickness: 2,
                    depth3D: 15,
                    angle: 30,
                    labelText: "[[title]]",
                    urlTarget: "127.0.0.1:5000"
                }).write("chartdiv");
            });
        }
    });

    var HomeDevTableItemView = Backbone.View.extend({
        template : 'templates:agent:home-dev-table-item',
        tagName: 'tr',
        events: {
        },
        serialize: function () {
            return _.extend(this.model.toJSON(), {status: homeDevTableView.status});
        },
        initialize: function () {
        }
    });

    //个人侧写 profile
    //一个展示的view 一个编辑的view
    var HomeDevTableView = Backbone.View.extend({
        template : 'templates:agent:home-dev-table',
        collection: new DevCollection(),
        status: '2',
        initialize: function (o) {
            if(o){
                this.opts = o;
            }
        },
        events: {
            'click .dropdown-li, .dropdown-li a, .dropdown-li a span': '_clickLi',
            'click .dropdown-li-interval, .dropdown-li-interval a, .dropdown-li-interval a span': '_clickIntervalLi'
        },
        beforeRender: function(){
            this.collection.url = function(){
                return 'dev/list/status';
            };
        },
        afterRender: function () {
            this._fetchResults();
        },
        _clickIntervalLi: function(e){
            e.preventDefault();
            e.stopPropagation();
            var $tgt = $(e.target);
            if(!$tgt.hasClass('dropdown-li-interval')){
                $tgt = $tgt.parents('.dropdown-li-interval');
            }
            if($tgt.hasClass('active')){
                return;
            }
            this.$('#selectedInterval').attr('data-value', $tgt.attr('data-value'));

            this.$('#selectedInterval').text($tgt.find('a span').text());
            $tgt.siblings().removeClass('active');
            $tgt.addClass('active');
            this.$('li.dropdown').removeClass('open');
            //this.$('.dropdown-menu').dropdown('toggle');
            //this.$('.dropdown-menu').toggle();
            this.trigger('do-flush', $tgt.attr('data-value'))
        },
        _clickLi: function(e){
            e.preventDefault();
            e.stopPropagation();
            var $tgt = $(e.target);
            if(!$tgt.hasClass('dropdown-li')){
                $tgt = $tgt.parents('.dropdown-li');
            }
            if($tgt.hasClass('active')){
                return;
            }

            this.$('#selectedStatus').attr('data-value', $tgt.attr('data-value'));
            this.status = $tgt.attr('data-value');
            this.$('#selectedStatus').text($tgt.find('a span').text());
            $tgt.siblings().removeClass('active');
            $tgt.addClass('active');
            this.$('li.dropdown').removeClass('open');
            //this.$('.dropdown-menu').dropdown('toggle');
            //this.$('.dropdown-menu').toggle();
            this._fetchResults();
        },
        _fetchParams: function () {
            this.params = {};
            this.params.status = this.$('#selectedStatus').attr('data-value');
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
            this.collection.fetch({
                reset: true,
                data: _.extend({orderBy: 'lastestmodifytime', sort: 'desc', page: page}, this.params)
            }).done(_.bind(this._setItemViews, this)).done(_.bind(function () {
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
        },
        _setItemViews: function () {
            if (this.collection.length > 0) { // 如果包含多个结果
                // 设置表格内容
                this.setViews({
                    'tbody': this.collection.map(function (model) {
                        return new HomeDevTableItemView({model: model});
                    })
                });
                // 没有结果行隐藏。。。
                // 渲染子视图，显示结果。。。
                this.renderViews().promise().done(function () {
                    // 隐藏加载行
                    this.$('.loading').hide();
                });
            } else {// 没有结果。。。
                this.$('.loading').hide();
                this.$('.non-items').show();
            }
        }
    });

    var HomeView = Backbone.View.extend({
        template: 'templates:agent:home',
        model: new HomePackageModel(),
        //此处拿到所有的数据
        initialize: function(){
            this.intervalTime = 10;
            //this.debounceFunc = _.debounce(this._flush, 100);
        },
        serialize: function(){

        },
        beforeRender: function(){
            this.setView('#pie-chart-div', chartView = new ChartView());
            this.setView('#information', homeDevTableView = new HomeDevTableView());
            this.listenTo(homeDevTableView, 'do-flush', this._doFlush);
        },
        afterRender: function(){
            this._doFlush();
        },
        _doFlush: function(intervalTime){
            var that = this;
            intervalTime ? that.intervalTime = intervalTime : void(0);
            intervalTime = parseInt(intervalTime);
            if(intervalTime === 0){
                clearInterval(that.currInterval);
                that.currInterval = null;
                return;
            }
            if(that.currInterval){
                return;
            }
            var beginTime = _.now();
            that.currInterval = setInterval(function(){
                console.log('do interval');
                var _onceTime = that.intervalTime - parseInt((_.now() -  beginTime)/1000);
                that.$('#timer').text(_onceTime < 0 ? 0 : _onceTime);
                if(_onceTime < 1){
                    beginTime = _.now();
                    that._flush();
                }
            }, 1000);
        },
        beforeRemove: function(){
            clearInterval(this.currInterval);
        },
        _flush: function(){
            chartView._renderChart();
            homeDevTableView._fetchResults();
        }
    });
    return HomeView;
});
