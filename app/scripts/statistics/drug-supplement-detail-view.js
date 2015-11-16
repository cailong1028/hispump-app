/* global define */
'use strict';
define([
    'underscore',
    'backbone',
    'settings/dev-type-collection',
    'helpers/tableExport'
], function(_, Backbone, DevTypeCollection) {
    var queryView;
    var $dates = [];
    var QueryView = Backbone.View.extend({
        template: 'templates:statistics:drug-supplement-detail-query',
        events: {
            'click button[type="submit"]': '_query'
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
            //药车类型
            this.$('#dev-type').select2('val', null);
            var col = new DevTypeCollection();
            col.fetch({reset: true}).done(_.bind(function(){
                var arr = _.map(col.models, function(model){
                    return _.extend(model.attributes, {text: model.get('name')});
                });
                this.$('#dev-type').select2({
                    multiple: true,
                    placeholder: gettext('Select dev type'),
                    data: arr
                });
            },this)).fail();
            //药物名称
            var suggest = function(quietMillis, url) {
                var timeout;
                return function(o) {
                    window.clearTimeout(timeout);
                    timeout = setTimeout(function() {
                        $.getJSON(app.buildUrl(url), {
                            term: o.term
                        }, function(res) {
                            o.callback({more: false, results: res});
                        });
                    }, quietMillis);
                };
            };
            this.$('#drug-name').select2({
                multiple: true,
                minimumInputLength: 1,
                cache: true,
                allowClear: true,
                placeholder: gettext('Select a drug'),
                // 保留query方法。。。这玩意会报错的。。
                query: suggest(200, 'drug/list/suggest'),
                formatResult: function(data){
                    if (data.pinyin) {
                        return data.name + ' / <small>' + data.pinyin +'</small>';
                    } else{
                        return data.name;
                    }
                },
                formatSelection: function(data){
                    if (data.pinyin) {
                        return data.name + ' / <small>' + data.pinyin +'</small>';
                    } else{
                        return data.name;
                    }
                },
                initSelection: function (e, callback) {
                    /*if (requesterView.model) {
                     callback(requesterView.model.toJSON());
                     } else {
                     callback();
                     }*/
                }
            });
        },
        _query: function(){
            this.trigger('show:report', this._fetchOptions());
        },
        _fetchOptions: function(){
            var retObj = {};
            var devType = this.$('#dev-type').val();
            var drugName = this.$('#drug-name').val();
            var begintime = $dates[0].data('DateTimePicker').date();
            var endtime = $dates[1].data('DateTimePicker').date();

            _.extend(retObj, devType === '0' ? {} : {devType: devType});
            _.extend(retObj, drugName === '0' ? {} : {drugid: drugName});
            _.extend(retObj, !begintime || begintime === '' ? {} : {beginTime: moment(begintime).format(app.datetimeFormat)});
            _.extend(retObj, !endtime || endtime  === '' ? {} : {endTime: moment(endtime).format(app.datetimeFormat)});

            return retObj;
        }
    });
    var DrugSupplementDetailListItemView = Backbone.View.extend({
        tagName: 'tr',
        template: 'templates:statistics:drug-supplement-detail-table-item',
        serialize: function() {
            return this.model.toJSON();
        }
    });

    var DrugSupplementModel = Backbone.Model.extend({
        urlRoot: 'statistics/drug-append'
    });

    var DrugSupplementCollection = Backbone.Collection.extend({
        url: 'statistics/drug-append',
        model: DrugSupplementModel
    });

    var DrugSupplementDetailListView = Backbone.View.extend({
        template: 'templates:statistics:drug-supplement-detail-table',
        collection: new DrugSupplementCollection(),
        events: {
            'click .export-to-file': '_export'
        },
        initialize: function(o) {
            this.params = o ? o : {};
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
            tableExport('drug-supplement-detail-table', gettext('Drug supplement detail')+'_'+new Date().getTime(), type);
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
            var paramsData = _.extend({page: page}, this.params);
            //TODO 改变地址栏url
            //Backbone.history.navigate('statistics/drug-period-expire?' + paramsData, false);
            this.collection.fetch({
                reset: true,
                data: paramsData
            }).done(_.bind(function () {
                this._setItemViews();
            }, this)).done(_.bind(function () {
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
                        model.set('index', i+1);
                        return new DrugSupplementDetailListItemView({model: model});
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

    var drugSupplementDetailListView;
    var DrugSupplementDetailView = Backbone.View.extend({
        template: 'templates:statistics:drug-supplement-detail',
        beforeRender: function() {
            var queryView = new QueryView();
            this.listenTo(queryView, 'show:report', function(options) {
                this.params = options;
                this.listView = drugSupplementDetailListView =  new DrugSupplementDetailListView(options);
                this.setView('.list', this.listView).render();
            });
            this.setView('.query', queryView);
        },
        afterRender: function() {
            this.listView = drugSupplementDetailListView =  new DrugSupplementDetailListView();
            this.setView('.list', this.listView).render();
        }
    });

    return DrugSupplementDetailView;
});
