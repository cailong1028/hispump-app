/* global define */
'use strict';
define([
    'underscore',
    'backbone',
    'statistics/drug-supplement-collection',
    'helpers/tableExport'
], function(_, Backbone, AgentReportsCollection) {
    var type = '24hours';
    var QueryView = Backbone.View.extend({
        template: 'templates:statistics:drug-supplement-detail-query',
        events: {
            'submit form': '_submitForm'
        },
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


                /*format: 'llll',
                //Set this to true to allow the picker to be used even if the input field is readonly
                ignoreReadonly:true,
                //输入框获得焦点之后会自动弹出datetimepicker
                allowInputToggle: true,
                maxDate: moment()*/

                /*minDate: moment(),
                defaultDate: moment().add({minutes: 14}),
                format: 'llll',
                stepping: 15,
                sideBySide: false,
                inline: true,*/
            });
        },
        _submitForm: function(e) {
            //不触发按钮的默认事件
            e.preventDefault();
            var typeTime = this.$('#selectedMethod').val();
            Backbone.history.navigate('statistics/agentreports/' + typeTime, false);
            this.trigger('show:report', typeTime);
        }
    });
    var DrugSupplementDetailListItemView = Backbone.View.extend({
        tagName: 'tr',
        template: 'templates:statistics:drug-supplement-detail-table-item',
        serialize: function() {
            return this.model.toJSON();
        }
    });

    var DrugSupplementDetailListView = Backbone.View.extend({
        template: 'templates:statistics:drug-supplement-detail-table',
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
            if (this.collection.length > 0) { // 如果包含多个结果
                // 设置表格内容
                this.setViews({
                    'tbody': this.collection.map(function(model) {
                        return new DrugSupplementDetailListItemView({model: model});
                    })
                });
                // 没有结果行隐藏。。。
                // 渲染子视图，显示结果。。。
                this.renderViews()
                    .promise()
                    .done(function() {
                        this.$('.loading').hide();
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
                return 'statistics/drug-supplement-detail';
            }, this);
            this.collection.fetch({
                reset: true
            })
            .done(_.bind(this._setItemViews, this))
            .done(_.bind(function () {
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
        }
    });

    var drugSupplementDetailListView;
    var DrugSupplementDetailView = Backbone.View.extend({
        template: 'templates:statistics:drug-supplement-detail',
        beforeRender: function() {
            var queryView = new QueryView();
            this.listenTo(queryView, 'show:report', function(options) {
                this.params = options;
                this.listView = drugSupplementDetailListView =  new DrugSupplementDetailListView({params: this.params});
                this.setView('.list', this.listView).render();
            });
            this.setView('.query', queryView);
        },
        afterRender: function() {
            this.listView = drugSupplementDetailListView =  new DrugSupplementDetailListView({params: type});
            this.setView('.list', this.listView).render();
        }
    });
    return DrugSupplementDetailView;
});
