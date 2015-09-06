/* global define, app, gettext*/
'use strict';
define([
    'underscore',
    'jquery',
    'backbone',
    'corporations/corporations-model',
    'contacts/contact-collection',
    'contacts/contact-model'
], function(_, $, Backbone, CorporationsModel, ContactsCollection, ContactModel) {
    var CorporationsContactsView = Backbone.View.extend({
        template: 'templates:corporations:corporations-contacts-list',
        collection: new ContactsCollection(),
        serialize: function() {
            return {
                content: this.collection.toJSON(),
                corporationId: this.corporationId
            };
        },
        initialize: function(o) {
            this.corporationId = o.corporationId;
        },
        beforeRender: function() {
            var done = this.async();
            this.collection.fetch({
                data: {
                    corporationId: this.corporationId,
                    page: 0,
                    size: 9
                },
                reset: true
            }).done(_.bind(function() {
                done();
            }, this));
        },
        afterRender: function() {
            if (this.collection.page.totalElements > 9) {
                this.$('.more-img').removeClass('hide');
            }
        }
    });

   var CorporationsContactsQuickAddView = Backbone.View.extend({
        template: 'templates:corporations:corporations-contacts-quickadd',
        beforeRender: function() {},
        afterRender: function() {},
    });

    var CorporationsInfoView = Backbone.View.extend({
        template: 'templates:corporations:corporations-info',
        events: {
            'submit form.quick-add-contact': '_quickAddContact',
            'submit form.save-corporation': '_saveCorporation',
            'click .update-corporation': '_updateCorporation',
            'click .delete-corporation': '_deleteCorporation'
        },
        initialize: function(o) {
            this.corporationId = o.id;
        },
        beforeRender: function() {
            this.setView('.corporations-contacts-quickadd', new CorporationsContactsQuickAddView());
            if (!this.model) {
                var done = this.async();
                this.model = new CorporationsModel(this.options);
                this.model.fetch().done(_.bind(function() {
                    this.insertView('.corporations-contacts', new CorporationsContactsView({corporationId: this.model.id}));
                    done();
                }, this));
            }
        },
        serialize: function() {
            return this.model.toJSON();
        },
        afterRender: function() {
            this.$('.error-messages').hide();
            //textarea focus时操作按钮出现
            var saveBtn = this.$('form.save-corporation button[type="submit"]');
            var memo = this.$('textarea[name="memo"]');
            saveBtn.hide();
            memo.focus(function() {
                saveBtn.fadeIn(1000, function() {});
            });
            memo.blur(function() {
                saveBtn.fadeOut(1000, function() {});
            });
        },
        _quickAddContact: function(e) {
            e.preventDefault();
            var $form = this.$('form.quick-add-contact');
            this.$('.error-messages').removeClass('show');
            var contactObj = _.extend($form.serializeObject(), {
                corporationId: this.corporationId
            });
            var contactModel = new ContactModel(contactObj);
            if (!contactModel.isValid()) {
                this.$('#' + contactModel.validationError).addClass('show');
                return;
            }
            this.$('.save').attr('disabled','disabled');
            var that = this;
            contactModel.save({}, {
                //wait: true,//you'd like to wait for the server before setting the new attributes on the model
                validate: false,
                wait: true
            }).done(_.bind(function( /*returnModel*/ ) {
                $(window).info(gettext('Quickly add current contact to the company successful'));
                delete this.model;
                /*this.beforeRender = _.bind(function(){
                    var done = this.async();
                    this.model = new CorporationsModel(this.options);
                    this.model.fetch({wait: true}).done(function () {
                        done();
                    }, this);
                    promptView.setInfo('添加成功').$el.modal('show');
                    setTimeout(_.bind(function () {
                        promptView.$el.modal('hide');
                    }, this), 1000);
                }, this);*/
                /*this.afterRender = _.bind(function() {
                    this.$('.error-messages').hide();
                    promptView.setInfo('添加成功').$el.modal('show');
                    setTimeout(_.bind(function() {
                        promptView.$el.modal('hide');
                    }, this), 1000);
                }, this);*/
                //this.$('.error-messages').hide();
                this.render();
                //this.getView('.corporations-contacts').render();
                //清空填写信息
                that.$('.save').removeAttr('disabled');
                var contactForm = this.$el.find('form.quick-add-contact');
                contactForm.find('[name="name"]').val('');
                contactForm.find('[name="email"]').val('');
                contactForm.find('[name="mobile"]').val('');
            }, this))
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
        },
        _saveCorporation: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var model = new CorporationsModel();
            model.set(this.model.pick(['id','name','domain','memo','description']));
            model.save({'memo': this.$('form .memo').val()})
                .done(_.bind(function() {
                    $(window).info(gettext('Update corporations remarks successfu'));
                    this.model = model;
                    // this.render(); // 重新绘制左侧公司信息
                }, this, model))
                .fail(function(){
                    $(window).info(gettext('Update corporations remarks failure'));
                });
        },
        _updateCorporation: function(e) { // 跳转到修改页面
            e.preventDefault();
            e.stopPropagation();
            Backbone.history.navigate('/corporations/form/' + this.model.id, true);
        },
        _deleteCorporation: function(e) {
            e.preventDefault();
            e.stopPropagation();
            app.vent.trigger('confirm', {
                callback: _.bind(function(view){
                    this.model.destroy().done(function() {
                        $(window).info(gettext('Delete corporations successful'));
                        view.hide();
                        Backbone.history.navigate('/corporations', true);
                    })
                    .fail(function(){
                        $(window).info(gettext('Delete corporations failure'));
                    });
                }, this),
                text: {
                    title: 'Confirm Delete Corporation Title',
                    content: 'Confirm Delete Corporation Content'
                }
            });
            // var removeCoropration = _.bind(function(withContacts) {
            //     var data = {};
            //     if (withContacts) {
            //         data = {'delete-contacts': ''};
            //     }
            //     return _.bind(function(view) {
            //         this.model.destroy({
            //             data: data
            //         }).done(function() {
            //             view.hide();
            //             Backbone.history.navigate('/corporations', true);
            //         });
            //     },this);
            // },this);
            // app.vent.trigger('dialog', {
            //     buttons: {
            //         'Submit Button' : removeCoropration(false),
            //         'Cancel Button' : function(view) {
            //             view.hide();
            //         }
            //     },
            //     text: {
            //         title: 'Confirm Delete Corporation Title',
            //         content: 'Confirm Delete Corporation Content'
            //     }
            // });
        }
    });
    return CorporationsInfoView;
});
