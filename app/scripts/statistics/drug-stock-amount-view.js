/**
 * Created by cailong on 2015/10/12.
 */
/*global define*/
'use strict';
define([
    'backbone',
    'settings/dev-type-collection'
], function(Backbone, DevTypeCollection){

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
            this.$('#deptid').select2({
                multiple: true,
                minimumInputLength: 1,
                cache: true,
                allowClear: true,
                placeholder: gettext('Select a dept'),
                // 保留query方法。。。这玩意会报错的。。
                query: suggest(200, 'dept/suggest'),
                formatResult: function(data){
                    //data.id = data.dept_code;
                    return data.dept_code+' / '+data.dept_name;
                },
                formatSelection: function(data){
                    //data.id = data.dept_code;
                    return data.dept_code+' / '+data.dept_name;
                },
                initSelection: function (e, callback) {
                    /*if (requesterView.model) {
                     callback(requesterView.model.toJSON());
                     } else {
                     callback();
                     }*/
                }
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
            var deptid = this.$('#deptid').val();
            var devType = this.$('#dev-type').val();
            var drugName = this.$('#drug-name').val();
            //var begintime = $dates[0].data('DateTimePicker').date();
            //var endtime = $dates[1].data('DateTimePicker').date();

            _.extend(retObj, !deptid || deptid  === '' ? {} : {deptid: deptid});
            _.extend(retObj, !devType || devType  === '' ? {} : {devType: devType});
            _.extend(retObj, !drugName || drugName === '' ? {} : {drugid: drugName});
            //_.extend(retObj, !begintime || begintime === '' ? {} : {beginTime: moment(begintime).format(app.datetimeFormat)});
            //_.extend(retObj, !endtime || endtime  === '' ? {} : {endTime: moment(endtime).format(app.datetimeFormat)});

            return retObj;
        }
    });

    var DrugStockAmountTableItemView = Backbone.View.extend({
        tagName: 'tr',
        className: 'one-stock-amount',
        template: 'templates:statistics:drug-stock-amount-table-item',
        events: {
            'click .pick': '_pick'
        },
        serialize: function() {
            return this.model.toJSON();
        },
        afterRender: function(){
        },
        _pick: function(){
            var pick_all = $('.pick-all-input');
            var tds = $('.one-stock-amount');
            var picks = $('.pick-input:checked');
            pick_all.prop('checked', picks.length === tds.length);
        }
    });

    var DrugStockAmountTableView = Backbone.View.extend({
        template: 'templates:statistics:drug-stock-amount-table',
        collection: new DrugStockAmountCollection(),
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
            var paramsData = _.extend({page: page}, this.params);
            this.collection.fetch({
                reset: true,
                data: paramsData
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
        events: {
            'click #generate-all-append-sheet': '_generateAllAppendSheet',
            'click #generate-append-sheet-by-query': '_generateAppendSheetByQuery',
            'click #generate-append-sheet-by-check': '_generateAppendSheetByCheck',
            'click .pick-all': '_pickAll'
        },
        beforeRender: function(){
            this.setView('.query', queryView = new QueryView());
            this.listenTo(queryView, 'show:report', function(options) {
                this.setView('.list', drugStockAmountTableView =  new DrugStockAmountTableView(options)).render();
            });
        },
        afterRender: function(){
            //TODO 默认查询条件
            var options = {};
            this.setView('.list', drugStockAmountTableView =  new DrugStockAmountTableView(options)).render();
        },
        _pickAll: function () {
            var pick_all = this.$('.pick-all-input');
            drugStockAmountTableView.getViews('tbody').forEach(function(one){
                one.$('.pick-input').prop('checked', pick_all.prop('checked'));
            });
        },
        _generateAllAppendSheet: function(){
            this.$('.generate-append-sheet').attr('disabled', 'disabled');
            var model = new Backbone.Model();
            model.url = function(){
                return 'statistics/generate-all-append-sheet';
            };
            model.fetch().done(_.bind(function(){
                this.$('.generate-append-sheet').removeAttr('disabled');
                //TODO 跳转到补药清单列表
            }, this)).fail(_.bind(function(err){
                this.$('.generate-append-sheet').removeAttr('disabled');
                $('window').info('Fail to generate append sheet');
            }, this));
        },
        _generateAppendSheetByQuery: function(){
            this.$('.generate-append-sheet').attr('disabled', 'disabled');
            var model = new Backbone.Model();
            model.url = function(){
                return 'statistics/generate-append-sheet-by-query';
            };
            model.fetch({data: queryView._fetchOptions()}).done(_.bind(function(){
                this.$('.generate-append-sheet').removeAttr('disabled');
                //TODO 跳转到补药清单列表
            }, this)).fail(_.bind(function(err){
                this.$('.generate-append-sheet').removeAttr('disabled');
                $('window').info('Fail to generate append sheet');
            }, this));
        },
        _generateAppendSheetByCheck: function(){
            this.$('.generate-append-sheet').attr('disabled', 'disabled');
            var checkedWarnList = [];
            drugStockAmountTableView.getViews('tbody').forEach(function(one){
                if(one.$('.pick-input').prop('checked')){
                    checkedWarnList.push(one.model.attributes);
                }
            });
            var model = new Backbone.Model();
            model.url = function(){
                return 'statistics/generate-append-sheet-by-check';
            };
            model.save({checkedWarnList: checkedWarnList}).done(_.bind(function(){
                this.$('.generate-append-sheet').removeAttr('disabled');
                //TODO 跳转到补药清单列表
            }, this)).fail(_.bind(function(err){
                this.$('.generate-append-sheet').removeAttr('disabled');
                $('window').info('Fail to generate append sheet');
            }, this));
        }
    });

    return DrugStockAmountView;

});
