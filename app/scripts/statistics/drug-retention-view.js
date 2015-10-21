/**
 * Created by cailong on 2015/10/12.
 */
/*global define*/
'use strict';
define([
    'backbone'
], function(Backbone){

    var drugRetentionTableView;
    var queryView;

    var DrugRetentionModel = Backbone.Model.extend({
        //urlRoot:
    });

    var DrugRetentionCollection = Backbone.Collection.extend({
        model: DrugRetentionModel
    });

    var QueryView = Backbone.View.extend({
        template: 'templates:statistics:drug-retention-query',
        afterRender: function(){
            this.$('.date').datetimepicker({
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
            });
        }
    });

    var DrugRetentionTableItemView = Backbone.View.extend({
        tagName: 'tr',
        template: 'templates:statistics:drug-retention-table-item',
        serialize: function() {
            return this.model.toJSON();
        }
    });

    var DrugRetentionTableView = Backbone.View.extend({
        template: 'templates:statistics:drug-retention-table',
        collection: new DrugRetentionCollection(),
        initialize: function(o) {
            this.params = o;
        },
        afterRender: function() {
            this._fetchResults();
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
                //return 'statistics/drug-retention';
                return 'statistics/drug-supplement-detail';
            }, this);
            this.collection.fetch({
                reset: true,
                data: {/*orderBy: 'createtime', sort: 'desc', */page: page}
            }).done(_.bind(function () {
                this._setItemViews;
                if (this.collection.page.totalPages < 1) {
                    return;
                }
                var fetch = _.bind(this._fetchResults, this);
                var page = this.collection.page;
                this.pagination = true;
                this.$('#pagination').pagination({
                    startPage: page.number + 1,
                    totalPages: page.totalPages,
                    href: '/statistics/drug-retention?page={{number}}',
                    onPageClick: function (e, page) {
                        fetch(page - 1);
                    }
                });
            }, this));
        },
        _setItemViews: function() {
            if (this.collection.length > 0) { // 如果包含多个结果
                // 设置表格内容
                this.setViews({
                    'tbody': this.collection.map(function(model) {
                        return new DrugRetentionTableItemView({model: model});
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

    var DrugRetentionView = Backbone.View.extend({
        template: 'templates:statistics:drug-retention',
        beforeRender: function(){
            this.setView('.query', queryView = new QueryView());
            this.listenTo(queryView, 'show:report', function() {
                this.setView('.list', drugRetentionTableView =  new DrugRetentionTableView(arguments)).render();
            });
        },
        afterRender: function(){
            //TODO 默认查询条件
            var options = {};
            this.setView('.list', drugRetentionTableView =  new DrugRetentionTableView(options)).render();
        }
    });

    return DrugRetentionView;

});

