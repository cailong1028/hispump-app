/* global define, client */
'use strict';
define([
    'jquery',
    'underscore',
    'underscore.string',
    'backbone',
    'vendor/jquery-querystring'
], function ($, _, s, Backbone) {
    var MockSuccess = function() {};
    var ChangeTicketModel = Backbone.Model.extend({
        url:  function() {
            var data = this.toJSON();
            delete data.id;
            return 'tickets/' + this.id + '?'+ $.QueryString.stringify(data);
        }
    });
    var TicketModel = Backbone.Model.extend({
        urlRoot: 'tickets',
        attributes: [
            'id',
            'requester', // 请求人
            'assignee', // 委派客服
            'group', // 组
            'subject', // 主题
            'description', // 描述
            'type', // 类型
            'state', // 状态
            'priority', // 优先级
            'source', // 来源
            'attachments' // 附件
        ],
        validate: function (attrs) {
            if (!s.trim(attrs.requester)) {
                return 'requesterNameInvalid';
            }
            if (!s.trim(attrs.subject)) {
                return 'subjectCanNotBeNull';
            }
            //subject 不能超过128个字符
            if (attrs.subject && attrs.subject.length > 128) {
                return 'subjectTooLang';
            }
            //不能超过4k
            if (attrs.description && attrs.description.length > 500) {
                return 'DescriptionSizeExceedsTheAllowableLimit';
            }
        },
        changeState: function (state, o) {
            o = o || {};
            var model = this;
            var success = o.success || MockSuccess;
            o.success = function() {
                model.set('state', state);
                success.apply(model, arguments);
            };
            return this.sync('update', new ChangeTicketModel({
                id: this.id,
                state: state
            }), o);
        },
        changePriority: function (priority, o) {
            o = o || {};
            var model = this;
            var success = o.success || MockSuccess;
            o.success = function() {
                model.set('priority', priority);
                success.apply(model, arguments);
            };
            return this.sync('update', new ChangeTicketModel({
                id: this.id,
                priority: priority
            }), o);

        },
        changeType: function (type, o) {//缺少更改状态类型的接口
            o = o || {};
            var model = this;
            var success = o.success || MockSuccess;
            o.success = function() {
                model.set('type', type);
                success.apply(model, arguments);
            };
            return this.sync('update', new ChangeTicketModel({
                id: this.id,
                type: type
            }), o);

        },
        assignTo: function(agent, o) {
            o = o || {};
            var model = this;
            var success = o.success || MockSuccess;
            o.success = function() {
                model.set('assignee', agent);
                success.apply(model, arguments);
            };
            return this.sync('update', new ChangeTicketModel({
                id: this.id,
                'assign-to': agent
            }), o);
        },
        /**
         * 关闭
         */
        close: function(o) {
            o = o || {};
            var model = this;
            var success = o.success || MockSuccess;
            o.success = function() {
                model.set('state', 'Closed');
                success.apply(model, arguments);
            };
            return this.sync('update', new ChangeTicketModel({
                id: this.id,
                close: ''
            }), o);
        },
        /**
         * 删除
         */
        moveToTrash: function(o) {
            o = o || {};
            var model = this;
            var success = o.success || MockSuccess;
            o.success = function() {
                model.set('delete', true);
                success.apply(model, arguments);
            };
            return this.sync('update', new ChangeTicketModel({
                id: this.id,
                'move-to-trash': ''
            }), o);
        },
        /**
         * 恢复
         */
        restore: function(o) {
            o = o || {};
            var model = this;
            var success = o.success || MockSuccess;
            o.success = function() {
                model.set('delete', false);
                success.apply(model, arguments);
            };
            return this.sync('update', new ChangeTicketModel({
                id: this.id,
                restore: ''
            }), o);
        },
        markAsSpam: function(o) {
            o = o || {};
            var model = this;
            var success = o.success || MockSuccess;
            o.success = function() {
                model.set('spam', true);
                success.apply(model, arguments);
            };

            return this.sync('update', new ChangeTicketModel({
                id: this.id,
                'mark-as-spam': ''
            }), o);
        },
        markNotSpam: function(o) {
            o = o || {};
            var model = this;
            var success = o.success || MockSuccess;
            o.success = function() {
                model.set('spam', false);
                success.apply(model, arguments);
            };
            return this.sync('update', new ChangeTicketModel({
                id: this.id,
                'mark-as-not-spam': ''
            }), o);
        },
        /**
         * 指派给我
         */
        assignToMe: function(o) {
            o = o || {};
           var model = this;
            var success = o.success || MockSuccess;
            o.success = function() {
                model.set('assignee', client.profile().username);
                success.apply(model, arguments);
            };
            return this.sync('update', new ChangeTicketModel({
                id: this.id,
                'assign-to-me': ''
            }), o);
        }
    });
    return TicketModel;
});
