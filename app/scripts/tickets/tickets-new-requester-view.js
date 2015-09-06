/**
 * Created by cailong on 2015/2/7.
 */
/*global define, gettext*/
'use strict';
define([
    'backbone',
    'jquery',
    'underscore',
    'contacts/contact-model',
    'bootstrap'
], function(Backbone, $, _, ContactModel){
    var AddNewRequesterView = Backbone.View.extend({
        template: 'templates:tickets:tickets-add-new-requester',
        className: 'modal fade',
        events: {
            // form 中的 按钮事件要放置在 重定义的 submit form之前
            'click .add-new-contact-cancel': 'hide',
            'submit form.quick-add-contact': '_addNewContact'
        },
        _addNewContact: function (e) {
            e.preventDefault();
            var form = this.$('form.quick-add-contact').serializeObject();
            var model = this.model = new ContactModel(form);
            this.$('.error-messages').removeClass('show');
            if (!model.isValid()) {
                this.$('#' + model.validationError).addClass('show');
                return;
            }
            model.save({}, {
                wait: true
            }).done(_.bind(function () {
                this.trigger('add-contact:successful', model);
                //clear form
                this.$('form input').each(function () {
                    $(this).val('');
                });
                this.hide();
            }, this))
            .fail(_.bind(function(resp){
                    this.$('.save').removeAttr('disabled');
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
        show: function () {
            this.$('.error-messages').hide();
            this.$el.modal('show');
        },
        hide: function (e) {
            if (e) {
                e.preventDefault();
            }
            this.$el.modal('hide');
        }
    });

    return AddNewRequesterView;
});
