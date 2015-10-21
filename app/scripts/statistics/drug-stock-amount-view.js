/**
 * Created by cailong on 2015/10/12.
 */
/*global define*/
'use strict';
define([
    'backbone'
], function(Backbone){

    var drugStockAmountTableView;
    var queryView;
    var $dates = [];

    var DrugStockAmountModel = Backbone.Model.extend({
        //urlRoot:
    });

    var DrugStockAmountCollection = Backbone.Collection.extend({
        model: DrugStockAmountModel
    });

    var QueryView = Backbone.View.extend({
        template: 'templates:statistics:drug-stock-amount-query',
        events: {
            'click #query': '_query'
        },
        afterRender: function(){
            _.each(this.$('.date'), function(oneDatePicker){
                $dates.push($(oneDatePicker).datetimepicker({
                    format: 'lll',
                    //Set this to true to allow the picker to be used even if the input field is readonly
                    ignoreReadonly:true,
                    //输入框获得焦点之后会自动弹出datetimepicker
                    allowInputToggle: true,
                    maxDate: moment(),
                    //viewDate: true,
                    //enabledHours: true,
                    showClear: true,
                    showClose: true,
                    showTodayButton: true
                }));
            });
        },
        _query: function(){
            this.trigger('show:report', this._fetchOptions());
        },
        _fetchOptions: function(){
            var retObj = {};
            var devType = this.$('#dev-type').val();
            var drugType = this.$('#drug-type').val();
            var drugClass = this.$('#drug-class').val();
            var begintime = $dates[0].data('DateTimePicker').date();
            var endtime = $dates[1].data('DateTimePicker').date();

            _.extend(retObj, devType === '0' ? {} : {drugList: devType});
            _.extend(retObj, drugType === '0' ? {} : {drugType: drugType});
            _.extend(retObj, drugClass === '0' ? {} : {drugName: drugClass});
            _.extend(retObj, !begintime || begintime === '' ? {} : {beginTime: moment(begintime).toISOString()});
            _.extend(retObj, !endtime || endtime  === '' ? {} : {endTime: moment(endtime).toISOString()});

            return retObj;
        }
    });

    var DrugStockAmountTableItemView = Backbone.View.extend({
        tagName: 'tr',
        template: 'templates:statistics:drug-stock-amount-table-item',
        serialize: function() {
            return this.model.toJSON();
        }
    });

    var DrugStockAmountTableView = Backbone.View.extend({
        template: 'templates:statistics:drug-stock-amount-table',
        collection: new DrugStockAmountCollection(),
        events: {
            'click .export-to-file': '_export'
        },
        initialize: function(o) {
            this.params = o;
        },
        afterRender: function() {
            this._fetchResults();
        },
        _export: function(e){
            e.preventDefault();
            e.stopPropagation();
            var $tgt = $(e.target);
            var type = $tgt.attr('data-type');
            //tableExport(domId, filename, exportType)
            tableExport('drug-stock-amount-table', gettext('Drug stock amount')+'_'+new Date().getTime(), type);
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
                return 'statistics/drug-stock-amount';
            }, this);
            this.collection.fetch({
                reset: true,
                data: {/*orderBy: 'createtime', sort: 'desc', */page: page}
            }).done(_.bind(function () {
                this._setItemViews();
                /*if (this.collection.page.totalPages < 1) {
                    return;
                }
                var fetch = _.bind(this._fetchResults, this);
                var page = this.collection.page;
                this.pagination = true;
                this.$('#pagination').pagination({
                    startPage: page.number + 1,
                    totalPages: page.totalPages,
                    href: '/statistics/drug-stock-amount?page={{number}}',
                    onPageClick: function (e, page) {
                        fetch(page - 1);
                    }
                });*/
            }, this)).fail(_.bind(function(){
                this.$('.loading').hide();
                // 隐藏没有数据行
                this.$('.non-items').hide();
                $(window).info(gettext('Query error'));
            }, this));
        },
        _setItemViews: function() {
            if (this.collection.length > 0) { // 如果包含多个结果
                // 设置表格内容
                this.setViews({
                    'tbody': this.collection.map(function(model, i) {
                        model.set('index', i + 1);
                        return new DrugStockAmountTableItemView({model: model});
                    })
                });
                // 没有结果行隐藏。。。
                // 渲染子视图，显示结果。。。
                this.renderViews().promise().done(function() {
                    this.$('.loading').hide();
                });
            } else {// 没有结果。。。
                this.$('.loading').hide();
                this.$('.non-items').show();
                this.$('.total').hide();
            }
        }
    });

    var DrugStockAmountView = Backbone.View.extend({
        template: 'templates:statistics:drug-stock-amount',
        beforeRender: function(){
            this.setView('.query', queryView = new QueryView());
            this.listenTo(queryView, 'show:report', function() {
                this.setView('.list', drugStockAmountTableView =  new DrugStockAmountTableView(arguments)).render();
            });
        },
        afterRender: function(){
            //TODO 默认查询条件
            var options = {};
            this.setView('.list', drugStockAmountTableView =  new DrugStockAmountTableView(options)).render();
        }
    });

    return DrugStockAmountView;

});
