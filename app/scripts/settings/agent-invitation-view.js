/* global define, app, gettext*/
'use strict';
define([
    'underscore',
    'underscore.string',
    'backbone',
    'jquery'
], function(_, _s, Backbone, $) {
    var InvitationModel = Backbone.Model.extend({
        urlRoot:'/admin/guide/invite',
        attributes: [
            'emails',
            // 'corporation'
        ],
        validate: function(attrs) {
            // 邮箱不存在
            if (!attrs.emails) {
                return 'mail_required';
            }
            // 邮箱为空格
            if (_s.trim(attrs.emails) === '') {
                return 'mail_required';
            }
            // 验证邮箱格式和是否重复
            var patterEmail = attrs.emails.split(/,|;|\s+/g);
            for (var i = 0; i < patterEmail.length; i++) {
                if (!patterEmail[i]) {
                    if (i + 1 === patterEmail.length) {
                        return ;
                    }
                }
                if (!app.validateEmail(patterEmail[i])) {
                    return 'invalid_email_fromat:' + patterEmail[i];
                }
                for (var j = i + 1; j < patterEmail.length; j++) {
                   if (patterEmail[i] === patterEmail[j]) {
                        return 'emails_duplicated:' + patterEmail[i];
                    }
                }
            }
            // 邮箱个数大于10个
            if (patterEmail.length > 10) {
                return 'invitations_exceeds_maximum_limit';
            }
        }
    });

    // var CorpGeneralModel = Backbone.Model.extend({
    //     url:'general',
    // });

    var InvitationView = Backbone.View.extend({
        template: 'templates:settings:agent-invitation',
        events: {
            'click button.submit': '_submitForm',
            'submit form': '_submitForm',
            'click button.cancel': '_clickCancelButton',
        },
        _clickCancelButton: function(e) {
            e.preventDefault();
            window.history.back(-1);
        },
        _submitForm: function(e) {
            e.preventDefault();
            this.$('.error-messages').removeClass('show');
            var model = new InvitationModel();
            // var corpGeneralModel = new CorpGeneralModel();
            // corpGeneralModel.fetch().done(_.bind(function(res){
            model.set('emails', this.$('#email').val());
                // model.set('corporation', res.title);
            if (!model.isValid()) {
                var err = model.validationError;
                if (err.indexOf(':') < 0) {
                    return this.$('#' + err).addClass('show');
                } else {
                    var errorId = err.substring(0, err.indexOf(':'));
                    var errorMsg = err.substring(err.indexOf(':') + 1, err.length);
                    if (errorId === 'invalid_email_fromat') {
                        this.$('#' + errorId).addClass('show');
                        this.$('#errormail').html(errorMsg);
                    }
                    if (errorId === 'emails_duplicated') {
                        this.$('#' + errorId).addClass('show');
                        this.$('#repeatmail').html(errorMsg);
                    }
                    return;
                }
            }
            model.save({}, {wait: true, validate: false})
            .done(_.bind(function() {
                $(window).info(gettext('Invitation agent successful'));
                this.$('#email').val('');
            },this))
            .fail(function() {
                $(window).info(gettext('Invitation agent failure'));
            });
            // },this));
        }
    });
    return InvitationView;
});
