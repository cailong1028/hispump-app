/* global define, app, gettext */
'use strict';
define([
    'underscore',
    'jquery',
    'underscore.string',
    'backbone',
    'corporations/corporations-collection',
    'corporations/corporations-model'
], function(_, $, _s, Backbone, CorporationsCollection, CorporationsModel) {
    if(app.___GET_TEXT___) {
        gettext('Delete Corporations');
        gettext('Delete Corporations And Contacts');
        gettext('Cancel');
        gettext('Confirm Delete Corporations');
        gettext('Delete Multiple Corporations?');
        gettext('Delete Corporation');
        gettext('Delete Corporation And Contacts');
        gettext('Confirm Delete Corporation');
        gettext('Delete Corporation?');
        gettext('Confirm Delete Corporation Title');
        gettext('Confirm Delete Corporation Content');
    }
    var CorporationsListView = Backbone.View.extend({
        template: 'templates:corporations:corporations-list',
        collection: new CorporationsCollection(),
        events: {
            'click input.picker': '_clickPicker',
            'click input.picker_td': '_clickPickerTd',
            'click .batchDelete': '_batchDelete'
        },
        params:{},
        initialize: function(o) {
            this.params = _.extend({}, o.params);
        },
        _renderBatchDeleteBtn: function(){
            var allItems = this.$('input.picker_td');
            var checkedItems = this.$('input.picker_td:checked');
            var picker = this.$('input.picker');

            picker.prop('checked', checkedItems.length === allItems.length);
            this.$('.batchDelete').attr('disabled', checkedItems.length === 0);
        },
        _clickPicker: function(e){
            this.$('input.picker_td').prop('checked', $(e.target).prop('checked'));
            this._renderBatchDeleteBtn();
        },
        _clickPickerTd: function(){
            //点击每行的pick
            this._renderBatchDeleteBtn();
        },
        _disablePickerAndbatch: function(){
            this.$('input.picker').attr('checked', false);
            this.$('.batchDelete').attr('disabled', true);
        },
        afterRender: function() {
            this._fetchResults();
        },
        filterAlphabet: function(a) {
            if (a) {
                this.params.alphabet = a;
            } else {
                delete this.params.alphabet;
            }
            this._fetchResults();
        },
        _setItemViews: function() {
            if (this.collection.length > 0) { // 如果包含多个结果
                // 设置表格内容
                this.setViews({
                    'tbody': this.collection.map(function(model) {
                        return new CorporationsItemView({model: model});
                    })
                });
                // 没有结果行隐藏。。。
                // 渲染子视图，显示结果。。。
                this.renderViews()
                    .promise()
                    .done(function() {
                        // 隐藏加载行
                        this.$('.loading').hide();
                    });
                this.$('input.picker').removeAttr('disabled');
            } else {// 没有结果。。。
                this.$('.loading').hide();
                this.$('.non-items').show();
                this.$('input.picker').attr('disabled','disabled');
            }
        },
        _fetchResults: function(page){
            page = page || 0;
            // 删除分页
            if (this.pagination === true) {
                this.pagination = false;
                this.$('#pagination').pagination('destroy');
                delete this.pagination;
            }
            // 删除所有已经存在的
            this.removeView('tbody');
            // 展示加载行
            this.$('.loading').show();
            // 隐藏没有数据行
            this.$('.non-items').hide();
            this.collection
                .fetch({
                    reset: true,
                    data: _.extend({page:page}, this.params)
                })
                .done(_.bind(this._setItemViews, this))
                .done(_.bind(function() {
                    if (this.collection.page.totalPages < 1) {
                        return;
                    }
                    var fetch = _.bind(this._fetchResults, this),
                        page = this.collection.page;
                    this.pagination = true;
                    this.$('#pagination').pagination({
                        startPage: page.number + 1,
                        totalPages: page.totalPages,
                        href: '/corporations?page={{number}}',
                        onPageClick: function(e, page) {
                            fetch(page - 1);
                        }
                    });
                }, this));
            // end function ;
            this._disablePickerAndbatch();
        },
        _batchDelete: function(e) {
            e.preventDefault();
            var that = this;
            var $checked = this.$('.picker_td:checked');
            if ($checked.length > 0) {
                /**
                 * 删除联系人
                 * @param withContacts boolean 是否同时删除联系人
                 */
                /*
                var removeCoropration = function(withContacts) {
                    var data = {};
                    if (withContacts) {
                        data = {'delete-contacts': ''};
                    }
                    return function(view) {
                        var defs = _.map($checked, function(input) {
                            var id = $(input).val();
                            var model = that.collection.get(id);
                            if (model) {
                                return model.destroy({data: data});
                            }
                            throw 'model by id ' + id + ' not found';
                        });
                        // 处理延迟发送的响应
                        // 以后需要增加过度效果
                        $.when.apply($, defs).done(function() {
                            that._fetchResults();
                            view.hide();
                        });
                    };
                };
                */
                app.vent.trigger('confirm', {
                    callback: function(view) {
                        var defs = [];
                        _.each($checked, function(input) {
                            var id = $(input).val();
                            var model = that.collection.get(id);
                            if (model) {
                                defs.push(model.destroy());
                            }
                        });
                        // 处理延迟发送的响应
                        // 以后需要增加过度效果
                        $.when.apply($, defs).done(function(){
                            $(window).info(gettext('Delete corporations successful'));
                            view.hide();
                            _.defer(function() {
                                that._fetchResults();
                            });
                        })
                        .fail(function(){
                            $(window).info(gettext('Delete corporations failure'));
                        });
                    },
                    text: {
                        title: 'Confirm Delete Corporation Title',
                        content: 'Confirm Delete Corporation Content'
                    }
                });
            }
        }
    });

    var CorporationsItemView = Backbone.View.extend({
        tagName: 'tr',
        events: {
            'click .corporation-delete': '_corporationDelete'
        },
        template: 'templates:corporations:corporations-item',
        serialize: function(){
            return this.model.toJSON();
        },
        initialize: function() {
            this.listenTo(this.model, 'destroy', function() {
                this.remove();
            });
        },
        _corporationDelete: function(e){
            //删除公司信息
            e.preventDefault();
            //var model = this.model;
            //var that = this;
            /**
             * 删除联系人
             * @param withContacts boolean 是否同时删除联系人
             */
            /*
            var removeCoropration = function(withContacts) {
                var data = {};
                if (withContacts) {
                    data = {'delete-contacts': ''};
                }
                return function(view) {
                    model.destroy({data: data}).done(function() {
                        that.remove();
                        view.hide();
                    }).fail(function() {
                        // TODO 处理失败
                    });
                };
            };
            */
            app.vent.trigger('confirm', {
                callback: _.bind(function(view) {
                    this.model.destroy().done(_.bind(function(){
                        $(window).info(gettext('Delete corporations successful'));
                        app.vent.trigger('delete-corporations:successful'); 
                    },this))
                    .fail(function(){
                        $(window).info(gettext('Delete corporations failure'));
                    });
                    view.hide();
                }, this),
                text: {
                    title: 'Confirm Delete Corporation Title',
                    content: 'Confirm Delete Corporation Content'
                }
            });
        }
    });

    var CorporationsQuickAddView = Backbone.View.extend({
        template: 'templates:corporations:corporations-quickadd',
        events: {
            'submit form': '_submitForm'
        },
        beforeRender: function(){
            //this.$('.error-messages').hide();
        },
        afterRender: function(){
           //
        },
        _submitForm: function(e){
            e.preventDefault();
            e.stopPropagation();
            var that = this;
            this.$('.error-messages').removeClass('show');
            if(_s.trim(this.$('input[name="name"]').val()) === ''){
                this.$('#invalidCorporationName').addClass('show');
            }
            var model = new CorporationsModel(this.$('form').serializeObject());
            this.$('.save').attr('disabled','disabled');
            model.save({}, {
                wait: true
            }).done(function() {
                that.$('.save').removeAttr('disabled');
                $(window).info(gettext('Quick add corporations successful'));
                that.$('.form-group .form-control').val('');
                app.vent.trigger('add-corporation:successful');

            }).fail(function(resp) {
                that.$('.save').removeAttr('disabled');
                $(window).info(gettext('Quick add corporations failure'));
                var data = resp.responseJSON;
                that.$('#' + data.errorCode).addClass('show');
            });
        }
    });

    var CorporationsView = Backbone.View.extend({
        template: 'templates:corporations:corporations',
        events: {
            'click .alphabet a': '_clickAlphabet'
        },
        // views:{
        //     '.corporations-quickadd': new CorporationsQuickAddView()
        // },
        params: {sort :'createdDate,desc'},
        serialize: function() {
            return {params: this.params};
        },
        initialize: function(o) {
            if (o && o.params) {
                this.params = o.params;
            }
            this.listenTo(app.vent, 'add-corporation:successful', function() {
                this.render();
            });
            this.listenTo(app.vent, 'delete-corporations:successful', function() {
                this.render();
            });
        },
        _clickAlphabet: function(e){
            e.preventDefault();
            e.stopPropagation(); // 停止冒泡
            this.$('.alphabet a').removeClass('active');
            var $target = $(e.target);
            $target.addClass('active');
            this.listView.filterAlphabet($target.attr('href'));
        },
        beforeRender: function() {
            this.setView('.corporations-quickadd', new CorporationsQuickAddView());
        },
        afterRender: function(){
            this.listView = new CorporationsListView({params: this.params});
            this.setView('.list', this.listView).render();
        }
    });

    return CorporationsView;
});
