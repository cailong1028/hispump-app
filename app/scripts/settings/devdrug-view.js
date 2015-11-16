/**
 * Created by cailong on 2015/9/13.
 */
/*global define*/
'use strict';
define([
    'backbone',
    'settings/devdrug-model',
    'settings/devdrug-collection',
    'settings/dev-type-model',
    'settings/dev-type-collection',
    'settings/dev-collection'
], function(Backbone, DevdrugModel, DevdrugCollection, DevTypeModel,
            DevTypeCollection, DevCollection){

    var listView;

    var suggest  = function(quietMillis, url) {
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

    var formatResult = function(data) {
        if (data.email) {
            return data.name + ' / <small><i class="fa fa-envelope fa-fw"></i> ' + data.email +'</small>';
        } else if (data.mobile) {
            return data.name + ' / <small><i class="fa fa-mobile fa-fw"></i> ' + data.mobile +'</small>';
        }
        return data.name;
    };

    var DevdrugTableItemView = Backbone.View.extend({
        tagName: 'tr',
        template: 'templates:settings:devdrug-table-item',
        events: {
            'click button.delete': '_clickDeleteButton',
            'blur input.number': '_modifyCurrDevdrug',
            'keyup input.number': '_whenEnterKey'
        },
        serialize: function () {
            return this.model.toJSON();
        },
        initialize: function () {
        },
        _whenEnterKey: function(e){
            if(e.keyCode === 13){
                var $tgt  = $(e.target);
                $tgt.trigger('blur');
            }
        },
        _modifyCurrDevdrug: function(e){
            var $tgt = $(e.target);
            $tgt.next().removeClass('hide');
            _.delay(_.bind(function(){
                var currdrugwarning = this.model.get('drugwarning');
                var currdrugoverflow = this.model.get('drugoverflow');
                var drugwarning = this.$('input.drug-warning-input').val();
                var drugoverflow = this.$('input.drug-overflow-input').val();
                this.model.set('drugwarning', drugwarning ? parseInt(drugwarning) : 0);
                this.model.set('drugoverflow', drugoverflow ? parseInt(drugoverflow) : 0);
                this.model.save({},{validate: false, wait: true}).done(_.bind(function(){
                    $tgt.next().addClass('hide');
                    this.render();
                }, this)).fail(_.bind(function(){
                    $tgt.next().addClass('hide');
                    this.model.set('drugwarning', currdrugwarning);
                    this.model.set('drugoverflow', currdrugoverflow);
                    this.render();
                    $(window).info(gettext('Fail to modify devdrug'));
                }, this));
            }, this), 500 );
        },
        _clickDeleteButton: function (e) {
            e.preventDefault();
            app.vent.trigger('confirm', {
                callback: _.bind(function (view) {
                    this.model.destroy().done(_.bind(function () {
                        $(window).info(gettext('Delete devdrug successful'));//TODO 提示信息需要国际化
                        this.remove();
                    }, this)).fail(function () {
                        $(window).info(gettext('Delete devdrug failure'));
                    });
                    view.hide();
                }, this),
                text: {
                    title: 'Confirm Delete devdrug Title',
                    content: 'Confirm Delete devdrug Content'
                }
            });
        }
    });

    // 设备列表
    var DevdrugTableView = Backbone.View.extend({
        template: 'templates:settings:devdrug-table',
        collection: new DevdrugCollection(),
        initialize: function (o) {
            if(o){
                this.opts = o;
            }
        },
        events: {
            'click button.forbidden-btn': '_clickOKButton'
        },
        afterRender: function () {
            this._fetchResults();
        },
        _setItemViews: function () {
            if (this.collection.length > 0) { // 如果包含多个结果
                // 设置表格内容
                this.setViews({
                    'tbody': this.collection.map(function (model) {
                        return new DevdrugTableItemView({model: model});
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
        _clickOKButton: function () {
            //this.$('#forbiddenModel').modal('hide');
        },
        //
        _fetch: function(opts){
            this.params = {};
            if(opts){
                _.extend(this.params, opts);
            }
            this._fetchResults();
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
            this.collection
                .fetch({
                    reset: true,
                    data: _.extend({page: page}, this.params || {})
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

    var DevView = Backbone.View.extend({
        template: 'templates:settings:devdrug',
        events: {
            'submit form': '_submit',
            'reset form': '_reset',
            'keyup .number': '_number'
        },
        initialize: function (o) {
            if(o){
                this.opts = o;
            }
        },
        serialize: function () {

        },
        beforeRender: function () {
            if(this.opts){
                this.listView = listView = new DevdrugTableView(this.opts);
            }else{
                this.listView = listView = new DevdrugTableView();
            }
            this.setView('.list', this.listView);
        },
        afterRender: function () {
            this._initdept();
            this._initCart();
            this._initDrug();
        },
        _submit: function(e){
            e.preventDefault();
            var serObj = this.$('form').serializeObject();
            this.listView._fetch(serObj);
        },
        _reset: function(e){
            this.$('#deptid').select2('val', null);
            this.$('#cartid').select2('val', null);
            this.$('#drugid').select2('val', null);
        },
        _number: function(e){
            var $tgt = $(e.target);
            $tgt.val($tgt.val().replace(/\D/gi, ''));
        },
        _initdept: function(){
            this.$('#deptid').select2({
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
            }).on('change', _.bind(this._changeCarts, this));
        },
        _initCart: function(){
            this.$('#cartid').select2({
                multiple: true,
                minimumInputLength: 1,
                cache: true,
                allowClear: true,
                placeholder: gettext('Select a dev'),
                // 保留query方法。。。这玩意会报错的。。
                query: suggest(200, 'dev/list/suggest'),
                formatResult: formatResult,
                formatSelection: formatResult,
                initSelection: function (e, callback) {
                    /*if (requesterView.model) {
                     callback(requesterView.model.toJSON());
                     } else {
                     callback();
                     }*/
                }
            });
        },
        _initDrug: function(){
            var format = function(data){
                if (data.pinyin) {
                    return data.name + ' / <small>' + data.pinyin +'</small>';
                } else{
                    return data.name;
                }
            };
            this.$('#drugid').select2({
                minimumInputLength: 1,
                cache: true,
                allowClear: true,
                placeholder: gettext('Select a drug'),
                // 保留query方法。。。这玩意会报错的。。
                query: suggest(200, 'drug/list/suggest'),
                formatResult: format,
                formatSelection: format,
                initSelection: function (e, callback) {
                    /*if (requesterView.model) {
                     callback(requesterView.model.toJSON());
                     } else {
                     callback();
                     }*/
                }
            });
        },
        _changeCarts: function(){
            //clear cartid first
            this.$('#cartid').select2('val', null);
            var col = new DevCollection();
            var opts = {};
            var currDeptCode = this.$('#deptid').val();
            if(!currDeptCode || currDeptCode === ''){
                return this._initCart();
            }
            col.fetch({reset: true, data: _.extend(opts, {dept_code: currDeptCode})}).done(_.bind(function(){
                var arr = _.map(col.models, function(model){
                    return _.extend(model.attributes, {text: model.get('name')});
                });

                this.$('#cartid').select2({
                    multiple: true,
                    data: arr
                });
            },this)).fail();
        }
    });
    return DevView;
});
