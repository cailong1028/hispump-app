/**
 * Created by cailong on 2015/1/21.
 */
/*global define, gettext*/
'use strict';
define([
    'underscore',
    'underscore.string',
    'backbone'
], function (_, s, Backbone) {
    var TicketInfoModel = Backbone.Model.extend({
        urlRoot: 'tickets',

        validate: function (attrs) {
            if (!s.trim(attrs.requester)) {
                return 'requesterNameInvalid';
            }
            if (!s.trim(attrs.subject)) {
                return 'subjectCanNotBeNull';
            }
            //subject 不能超过128个字符
            if (attrs.subject && attrs.subject.length > 128) {
                return 'requesterNameTooLang';
            }
            //不能超过4k
            if (attrs.description && attrs.description.length > 500) {
                return 'DescriptionSizeExceedsTheAllowableLimit';
            }
        },
        update: function (attrName, attrValue, changedAttrs, callback, showInfoInModal) {
            var _showInfoInModal = showInfoInModal === undefined ? true : showInfoInModal;
            if(this.attributes.requester && this.attributes.requester.id){
                this.attributes.requester = this.attributes.requester.id;
            }else{
                delete this.attributes.requester;
            }
            if(this.attributes.group && this.attributes.group.id){
                this.attributes.group = this.attributes.group.id;
            }else{
                delete this.attributes.group;
            }
            if(this.attributes.assignee && this.attributes.assignee.username){
                this.attributes.assignee = this.attributes.assignee.username;
            }else{
                delete this.attributes.assignee;
            }
            this.attributes = _.pick(this.attributes, function (value, key) {
                var keyArr = ['id', 'description', 'priority', 'state', 'subject', 'type', 'source', 'requester', 'group', 'assignee'];
                var flag = false;
                for (var i = 0; i < keyArr.length; i++) {
                    if (key === keyArr[i]) {
                        return true;
                    } else {
                        continue;
                    }
                }
                return flag;
            });
            if(changedAttrs){
                _.extend(this.attributes, changedAttrs);
            }
            this.save({}, {wait: true}).done(_.bind(function () {
                if(_showInfoInModal){
                    $(window).info(gettext('update ticket successful'));
                }
                if (callback) {
                    callback.call(this);
                }
            }, this)).fail(_.bind(function () {
                if(_showInfoInModal){
                    $(window).info(gettext('update ticket failure'));
                }
            }, this));
        }
    });
    return TicketInfoModel;
});
