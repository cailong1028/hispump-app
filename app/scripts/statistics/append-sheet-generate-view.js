/**
 * Created by cailong on 2015/9/13.
 */
/*global define*/
'use strict';
define([
    'backbone',
    'settings/dev-model',
    'settings/dev-collection',
    'settings/dev-type-model',
    'settings/dev-type-collection'
], function(Backbone, DevModel, DevCollection, DevTypeModel, DevTypeCollection){

    var queryView;
    var appendSheetGenerateTableView;

    var QueryView = Backbone.View.extend({
        template: 'templates:statistics:append-sheet-generate-query',
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
        },
        _query: function(){
            this.trigger('show:report', this._fetchOptions());
        },
        _fetchOptions: function(){
            var retObj = {};
            var deptid = this.$('#deptid').val();
            var devType = this.$('#dev-type').val();
            //var begintime = $dates[0].data('DateTimePicker').date();
            //var endtime = $dates[1].data('DateTimePicker').date();

            _.extend(retObj, !deptid || deptid  === '' ? {} : {dept_code: deptid});
            _.extend(retObj, !devType || devType  === '' ? {} : {type: devType});
            //_.extend(retObj, !begintime || begintime === '' ? {} : {beginTime: moment(begintime).format(app.datetimeFormat)});
            //_.extend(retObj, !endtime || endtime  === '' ? {} : {endTime: moment(endtime).format(app.datetimeFormat)});

            return retObj;
        }
    });

    var AgentsItemView = Backbone.View.extend({
        tagName: 'tr',
        className: 'one-dev-tr',
        template: 'templates:statistics:append-sheet-generate-table-item',
        events: {
            'click .pick': '_pick'
        },
        serialize: function () {
            return this.model.toJSON();
        },
        initialize: function () {
        },
        _pick: function(){
            var pick_all = $('.pick-all-input');
            var tds = $('.one-dev-tr');
            var picks = $('.pick-input:checked');
            pick_all.prop('checked', picks.length === tds.length);
        }
    });

    // 设备列表
    var AppendSheetGenerateTableView = Backbone.View.extend({
        template: 'templates:statistics:append-sheet-generate-table',
        collection: new DevCollection(),
        initialize: function (o) {
            this.opts = o || {};
        },
        events: {
        },
        afterRender: function () {
            this._fetchResults();
        },
        _setItemViews: function () {
            if (this.collection.length > 0) { // 如果包含多个结果
                // 设置表格内容
                var that = this;
                this.setViews({
                    'tbody': this.collection.map(function (model) {
                        return new AgentsItemView({model: model});
                    })
                });
                // 没有结果行隐藏。。。
                // 渲染子视图，显示结果。。。
                this.renderViews()
                    .promise()
                    .done(function () {
                        // 隐藏加载行
                        this.$('.loading').hide();
                    });
            } else {// 没有结果。。。
                this.$('.loading').hide();
                this.$('.non-items').show();
            }
        },
        _fetchParams: function () {
            this.params = {};
            _.extend(this.params, this.opts);
            return this.params;
        },
        // 获取结果
        _fetchResults: function (page) {
            page = page || 0;
            // 删除所有已经存在的
            this.removeView('tbody');
            // 展示加载行
            this.$('.loading').show();
            // 隐藏没有数据行
            this.$('.non-items').hide();
            this._fetchParams();
            this.collection.fetch({
                reset: true,
                data: _.extend({orderBy: 'lastestmodifytime', sort: 'desc', page: page, size: 10000}, this.params)
            }).done(_.bind(this._setItemViews, this));
        }
    });

    var AppendSheetGenerateView = Backbone.View.extend({
        template: 'templates:statistics:append-sheet-generate',
        events: {
            'click #generate-append-sheet': '_generate',
            'click .pick-all': '_pickAll'
        },
        initialize: function (o) {
            if(o){
                this.opts = o;
            }
        },
        serialize: function () {
        },
        beforeRender: function () {
            var view = this;
            view.setView('.query', queryView = new QueryView());
            view.setView('.list', appendSheetGenerateTableView =  new AppendSheetGenerateTableView());
            view.listenTo(queryView, 'show:report', function(options) {
                view.setView('.list', appendSheetGenerateTableView =  new AppendSheetGenerateTableView(options)).render();
            });
        },
        afterRender: function () {
        },
        _pickAll: function () {
            var pick_all = this.$('.pick-all-input');
            appendSheetGenerateTableView.getViews('tbody').forEach(function(one){
                one.$('.pick-input').prop('checked', pick_all.prop('checked'));
            });
        },
        _generate: function(){
            var generateBtn = this.$('#generate-append-sheet');
            generateBtn.attr('disabled', 'disabled');
            var cartcodeList = [];
            appendSheetGenerateTableView.getViews('tbody').forEach(function(one){
                if(one.$('.pick-input').prop('checked')){
                    cartcodeList.push(one.model.get('cartcode'));
                }
            });
            if(cartcodeList.length === 0){
                return ;
            }
            var model = new Backbone.Model();
            model.url = function(){
                return 'statistics/generate-append-sheet';
            };
            model.save({cartcodeList: cartcodeList}).done(function(){
                $('window').info(gettext('Success to generate append sheet'));
                generateBtn.removeAttr('disabled');
                window.history.back();
            }).fail(function(){
                $('window').info(gettext('Fail to generate append sheet'));
                generateBtn.removeAttr('disabled');
            });
        }
    });
    return AppendSheetGenerateView;
});
