/* global define, app, gettext */
'use strict';
define([
    'underscore',
    'jquery',
    'backbone',
    'contacts/contact-collection',
    'contacts/contact-model'
], function(_, $, Backbone, ContactCollection, ContactModel) {
    // gettext hook 用于获得国际化文本
    if (app.___GETTEXT___) {
        // 确认删除联系人弹出框标题
        gettext('Confirm Delete Contacts Title');
        // 确认删除联系人弹出框内容
        gettext('Confirm Delete Contacts Content');
        // 删除多个联系人
        gettext('Delete Multiple Contacts?');
        // 删除单个联系人
        gettext('Delete Contact?');
    }
    // var pickTimeout = null;

    var defaultFilter = 'All';

    var ContactsItemView = Backbone.View.extend({
        tagName: 'tr',
        template: 'templates:contacts:contacts-item',
        events: {
            'click button.delete': '_clickDeleteButton',
            'click button.restore' : '_clickRestoreButton',
            'click button.send-verify-email' : '_clickSendVerifyEmailButton'
        },
        serialize: function() {
            return this.model.toJSON();
        },
        initialize: function() {
            this.listenTo(this.model, 'destroy', function() {
                this.remove();
            });
        },
        _clickDeleteButton: function(e) {
            e.preventDefault();
            app.vent.trigger('confirm', {
                callback: _.bind(function(view) {
                    this.model.destroy().done(function(){
                        $(window).info(gettext('Delete contacts successful'));
                        app.vent.trigger('delete-contacts:successful'); 
                    },this)
                    .fail(function(){
                        $(window).info(gettext('Delete contacts failure'));
                    });
                    view.hide();
                }, this),
                text: {
                    title: 'Confirm Delete Contacts Title',
                    content: 'Confirm Delete Contacts Content'
                }
            });
        },
        _clickRestoreButton: function(e) {
            e.preventDefault();
            var model = new ContactModel({id: this.model.id});
            model.restore().done(_.bind(function() {
                $(window).info(gettext('Restore contacts successful'));
                this.remove();
            }, this))
            .fail(function(){
                 $(window).info(gettext('Restore contacts failure'));
            });
        },
        _clickSendVerifyEmailButton: function(e) {
            e.preventDefault();
            var model = new ContactModel({id: this.model.id});
            model.sendverifyemail().done(_.bind(function() {
                //this.remove();
                //TODO 国际化
                $(window).info('发送成功');
            }, this));
        }
    });

    // var _changeButtonState = function() {
    //     var $checked = this.$('.pick input[type=checkbox]:checked');
    //     this.$('button.pickact').prop('disabled', $checked.length === 0);
    //     pickTimeout = undefined;
    // };

    var ContactsListView = Backbone.View.extend({
        template: 'templates:contacts:contacts-table',
        collection: new ContactCollection(),
        events: {
            'click input.picker': '_clickPicker',
            'click input.picker_td': '_clickPickerTd',
            'click .multiple-delete': '_clickMultipleDelete',
            'click .multiple-restore': '_clickMultipleRestore',
            'click .multiple-send-mail': '_clickMultipleSendEmail'

        },
        initialize: function(o) {
            console.log ('initialize');
            this.params = _.extend({}, o.params);
            this.listenTo(app.vent, 'delete-contacts:successful', function() {
                this.render();
            });
        },
        afterRender: function() {
            console.log ('after');
            if (this.params.filter === 'Deleted') {
                this.$('table').addClass('state-delete');
            }else{
                this.$('table').removeClass('state-delete');
            }
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
        filterState: function(a) {
            this.params.filter = a;
            this._fetchResults();
            if (a === 'Deleted') {
                // this.$('table').addClass('state-delete');
                Backbone.history.navigate('/contacts/blocked', true);
            } else {
                // this.$('table').removeClass('state-delete');
                Backbone.history.navigate('/contacts', true);
            }
        },
        _clickMultipleDelete: function(e) {
            e.preventDefault();
            var that = this;
            var $checked = this.$('.pick-id input[type=checkbox]:checked');
            if ($checked.length > 0) {
                // TODO 过度效果
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
                            $(window).info(gettext('Delete contacts successful'));
                            view.hide();
                            _.defer(function() {
                                that._fetchResults();
                            });
                        })
                        .fail(function(){
                            $(window).info(gettext('Delete contacts failure'));
                        });
                    },
                    text: {
                        title: 'Confirm Delete Contacts Title',
                        content: 'Confirm Delete Contacts Content'
                    }
                });
            }
        },
        _clickMultipleRestore: function(e) {
            e.preventDefault();
            var $checked = this.$('.pick-id input[type=checkbox]:checked');
            if ($checked.length > 0) {
                // TODO 过度效果
                var defs = _.map($checked, function(input) {
                    var id = $(input).val();
                    var model = this.collection.get(id);
                    if (model) {
                        return model.restore();
                    }
                    throw 'contacts by id '+ id + 'not found';
                }, this);
                // 处理延迟发送的响应
                // 以后需要增加过度效果
                $.when.apply($, defs).done(_.bind(function(){
                    $(window).info(gettext('Restore contacts successful'));
                    this._fetchResults();
                }, this))
                .fail(function(){
                    $(window).info(gettext('Restore contacts failure'));
                });
            }
        },
        _resetPicker: function() {
            this.$('.picker').prop('checked', false);
            this.$('button.pickact').prop('disabled', true);
        },
        _renderBatchBtn: function(){
            var allItems = this.$('input.picker_td');
            var checkedItems = this.$('input.picker_td:checked');
            var picker = this.$('input.picker');

            picker.prop('checked', checkedItems.length === allItems.length);
            this.$('.batch').attr('disabled', checkedItems.length === 0);
        },
        _clickPicker: function(e){
            this.$('input.picker_td').prop('checked', $(e.target).prop('checked'));
            this._renderBatchBtn();
        },
        _clickPickerTd: function(){
            //点击每行的pick
            this._renderBatchBtn();
        },
        _setItemViews: function() {
            if (this.collection.length > 0) { // 如果包含多个结果
                // 设置表格内容
                this.setViews({
                    'tbody': this.collection.map(function(model) {
                        return new ContactsItemView({model: model});
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
        // 获取结果
        _fetchResults: function(page) {

            page = page || 0;
            // 删除所有已经存在的
            this.removeView('tbody');
            // 删除分页
             if (this.pagination === true) {
                this.pagination = false;
                try{
                    this.$('#pagination').pagination('destroy');
                }catch(e){
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
                        href: '/contacts?page={{number}}',
                        onPageClick: function(e, page) {
                            fetch(page - 1);
                        }
                    });
                }, this));
            // end function ;
            this._resetPicker();
        },
        _clickMultipleSendEmail: function(e) {
            e.preventDefault();
            var that = this;
            var $checked = this.$('.pick-id input[type=checkbox]:checked');
            if ($checked.length > 0) {
                var defs = _.map($checked, function(input) {
                    var id = $(input).val();
                    var model = that.collection.get(id);
                    if (model) {
                        //defs.push(model.destroy());
                        if (!model.attributes.verified) {
                            return model.sendverifyemail();
                        }
                    }
                    throw 'contact by id ' + id + 'not found.';
                });
                // 处理延迟发送的响应
                // 以后需要增加过度效果
                $.when.apply($, defs).then(function(){
                    _.delay(function() {
                        that._fetchResults();
                    }, 700);
                    //TODO 国际化
                    $(window).info('发送成功');
                });
            }
        },

    });

    var contactsListView;

    var QuickAddContactView = Backbone.View.extend({
        template: 'templates:contacts:quick-add-contacts',
        events: {
            'submit form': 'submitForm'
        },
        submitForm: function(e) {
            e.preventDefault();

            var model = new ContactModel(this.$(e.target).serializeObject());
            this.$('.error-messages').removeClass('show');
            if (!model.isValid()) {
                this.$('#' + model.validationError).addClass('show');
                return;
            }
            this.$('.save').attr('disabled','disabled');
            var that = this;
            model.save({}, {wait: true})
                .done(function() {
                    that.$('.save').removeAttr('disabled');
                    $(window).info(gettext('Quick add contacts successful'));
                    app.vent.trigger('add-contacts:successful');
                })
                .fail(_.bind(function(resp){
                    that.$('.save').removeAttr('disabled');
                    var data = resp.responseJSON;
                    if (data.type === 'ContactEmailAlreadyExists') {
                        this.$('#email_duplicate').addClass('show');
                    }
                    if (data.type === 'ContactMobileAlreadyExists') {
                        this.$('#mobile_duplicate').addClass('show');
                    }
                    $(window).info(gettext('Quick add contacts failure'));
                }, this));
        }
    });
    var ContactsView = Backbone.View.extend({
        template: 'templates:contacts:contacts',
        events: {
            'click .alphabet a': '_clickAlphabet',
            'change select.state': '_changeFilterState'
        },
        params: {
            filter: defaultFilter
        },
        initialize: function(o) {
            if (o && o.params) {
                this.params = o.params;
            }
            this.listenTo(app.vent, 'add-contacts:successful', function() {
                this.render();
            });
        },
        serialize: function() {
            return {params: this.params};
        },
        beforeRender: function() {
            this.setView('.quick-add-contacts', new QuickAddContactView());
        },
        afterRender: function() {
            this.listView = contactsListView =  new ContactsListView({params: this.params});
            this.setView('.list', this.listView).render();
        },
        _clickAlphabet: function(e) {
            e.preventDefault();
            e.stopPropagation(); // 停止冒泡
            this.$('.alphabet a').removeClass('active');
            var $target = $(e.target);
            $target.addClass('active');
            this.listView.filterAlphabet($target.attr('href'));
        },
        _changeFilterState: function(e) {
            var $e = $(e.target);
            this.listView.filterState($e.val());
        }
    });
    return ContactsView;
});
