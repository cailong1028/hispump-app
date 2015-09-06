/* global define ,app, gettext */
'use strict';
define([
    'underscore',
    'jquery',
    'backbone',
    'contacts/contact-model',
    'contacts/contact-information-ticket-collection',
], function(_, $, Backbone, ContactModel,InformationTicketsCollection) {

    var ContactInformationTicketsModel = Backbone.Model.extend({});

    var ContactInformationTicketItemView = Backbone.View.extend({
        template: 'templates:contacts:contacts-information-activities-item',
        tagName: 'li',
        className: 'timeline-list-item'
    });

    var ContactInformationTicketsView = Backbone.View.extend({
        template: 'templates:contacts:contacts-information-activities',
        initialize: function() {
            //目前只使用了第一页
            this.collection = new InformationTicketsCollection();
            this.timeArea = 'All';
            this.requester = this.options.requester;
            this.sort = 'createdDate,Desc';
            this.page = 0;
            this.model = new ContactInformationTicketsModel({timeArea:this.timeArea,requester:this.requester,sort:this.sort,page:this.page});
        },
        events: {
            'click .more-results' : 'moreResults'
        },
        beforeRender: function() {
        },
        afterRender: function() {
            this.fetchInfo(this.page);
        },
        setItemViews: function() {
            if(this.collection.length > 0){
                //如果有数据的话
                this.setViews({
                        '.timeline-list': this.collection.map(function(model) {
                            return new ContactInformationTicketItemView({model: model});
                        })
                });
                // 渲染子视图，显示结果。。。
                this.renderViews()
                    .promise()
                    .done(function() {
                        // 隐藏加载提示
                        this.$('.loading').hide();
                    });
            }else{
                //没有数据显示无数据的提示
                this.$('.non-items').show();
                //隐藏正在加载提示
                this.$('.loading').hide();
            }
        },
        setViewAllTicket: function(){
            var page = this.collection.page;
            if(page.totalPages > 1){
                this.$('.more-results').show();
                return;
            }
        },
        fetchInfo: function(page) {
            //显示正在加载提示
            this.$('.loading').show();
            //隐藏无数据提示
            this.$('.non-items').hide();
            this.$('.more-results').hide();
            //fetch 数据之后，bind一个触发事件
            this.collection.fetch({reset : true,push : false,data:{page:page,timeArea:this.timeArea,requester:this.requester,sort:this.sort}})
                .done(_.bind(this.setItemViews, this))
                .done(_.bind(this.setViewAllTicket, this));
        },
        moreResults: function(){
            console.log('navigate.to ticket...');
        }
    });

    var ContactsInformationView = Backbone.View.extend({
        template: 'templates:contacts:contacts-infomation',
        events: {
            'submit form.description': '_submitForm',
            'click button.delete': '_clickDeteleButton',
            'click button.restore': '_clickRestoreButton',
            'click button.send-verify-email' : '_clickSendVerifyEmailButton'
        },
        serialize: function() {
            var data = this.model.toJSON();
            if (data.address1 || data.address2){
                data.address = [data.address1, data.address2].join();
            }
            if (data.gender === 'Unknown') {
                delete data.gender;
            }
            return data;
        },
        beforeRender: function() {
            if (!this.model) {
                var done = this.async();
                this.model = new ContactModel(this.options);
                this.model
                    .fetch()
                    .done(function() {
                        done();
                    });
            }
        },
        afterRender: function() {
            this.setView('.timeline',new ContactInformationTicketsView({requester:this.options.id})).render();
            var saveBtn = this.$('form.description button[type="submit"]');
            var memo = this.$('textarea[name="memo"]');
            saveBtn.hide();
            memo.focus(function() {
                saveBtn.fadeIn(1000, function() {});
            });
            memo.blur(function() {
                saveBtn.fadeOut(1000, function() {});
            });
        },
        /* 延时显示按钮
        afterRender: function(){
            var saveBtn = this.$('form.description button[type="submit"]');
            var memo = this.$('textarea[name="memo"]');
            saveBtn.hide();
            memo.focus(function(){
                saveBtn.fadeIn(1000, function(){});
            });
            memo.blur(function(){
                saveBtn.fadeOut(1000, function(){});
            });
        },*/
        _submitForm: function(e) {
            e.preventDefault();
            var model = new ContactModel(this.model.pick(ContactModel.prototype.attributes));
            if(model.has('corporation')){
                var corporation = model.get('corporation');
                var corporationName = '';
                if(corporation.name){
                    corporationName = corporation.name;
                }
                model.unset('corporation');
                model.set('corporationName',corporationName);
            }
            model.save({'memo': this.$('form .memo').val()})
                .done(_.bind(function() {
                    $(window).info(gettext('Update contacts remarks successful'));
                    this.model = model;
                    this.render();
                }, this))
                .fail(function(){
                    $(window).info(gettext('Update contacts remarks failure'));
                });
        },
        _clickDeteleButton: function() {
            app.vent.trigger('confirm', {
                callback: _.bind(function(view){
                    this.model.destroy().done(function() {
                        $(window).info(gettext('Delete contacts successful'));
                        view.hide();
                        Backbone.history.navigate('/contacts', true);
                    })
                    .fail(function(){
                        $(window).info(gettext('Delete contacts failure'));
                    });
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
                Backbone.history.navigate('/contacts/blocked', true);
            }, this));
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
    return ContactsInformationView;
});
