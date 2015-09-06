/**
 * Created by cailong on 2015/1/20.
 */
/*global define, gettext, app, moment*/
'use strict';
define([
    'underscore',
    'backbone',
    'jquery',
    'tickets/ticket-info-model',
    'tickets/tickets-history-model',
    'tickets/tickets-history-collection',
    'tickets/cache',
    'underscore.string'
], function (_, Backbone, $, TicketInfoModel, TicketsHistoryModel, TicketsHistoryCollection, ticketsCache, _s) {

    if (app.___GETTEXT___) {
        //生成有工单状态国际化文件需要
        gettext('Opened');
        gettext('Resolved');
        gettext('Pending');
        // 确定删除选定的工单
        gettext('Confirm Delete Selected Tickets');
        //被删除的工单无法进行编辑，您可以在“已删除工单”中查看到该工单，并且可以进行恢复和永久删除操作
        gettext('The Deleted Tieckets will not edit,please look up in deleted list');
        //确定删除工单备注
        gettext('Confirm Delete Tickets Memo');
        //确定删除工单备注
        gettext('Confirm Delete Tickets Memo Content');
    }
    var FilterDomainModel = Backbone.CachedModel.extend({
        url: 'tickets/ticketdomain',
        cacheCache: ticketsCache,
        cachekey: 'ticketdomain'
    });
    var GroupModel = Backbone.Model.extend({});
    var GroupCollection = Backbone.CachedCollection.extend({
        url: 'groups/findall',
        model: GroupModel,
        cacheCache: ticketsCache,
        initialize: function() {
            this.cacheKey = 'Groups';
        }
    });
    var AgentModel = Backbone.Model.extend({});
    // 全部座席，同时缓存
    var AgentCollection = Backbone.Collection.extend({
        model: AgentModel,
        url: 'agents'
    });
    var getAgentsCollectionByGroupId = function(groupId){
        var GroupAgentsCollection = Backbone.CachedCollection.extend({
            model: AgentModel,
            url: groupId === '' ? 'agents' : 'groups/' + groupId + '/members',
            // 处理缓存
            cacheObject: ticketsCache,
            cacheKey: 'Group_' + groupId + '_Agents'
        });
        return new GroupAgentsCollection();
    };
    var _replaceSerializeNumber = function(description){
        description = description || '';
        //jshint unused: false
        //加数字标记为工单序列号的链接
        return description.replace(/(<a[\S\s]*>)*#([0-9]+)(<\/a>)*/g, function(match, p1, p2, p3, offset){
            return '<a href="tickets/'+p2+'">#'+p2+'</a>';
        });
    };
    var groupAgentsCollectionMap = {};
    var groupCollection = new GroupCollection();
    var domainModel = new FilterDomainModel();
    var agentCollection = new AgentCollection();
    var ticketsFlow;
    var ticketsDetail;
    var TicketsFlow = Backbone.View.extend({
        template: 'templates:tickets:tickets-flow',
        initSize: 5,
        size: 5,
        timeFlag: '',
        events: {
            'click .avatar-wrap-collapse,a.count_number_action': 'showMore',
            'click #FwdButton_description': 'toggleEditor',
            'click #FwdButton_forward': 'toggleEditor',
            'click #reply-submit': '_submitReplyForm',
            'submit form#reply-form': '_submitReplyForm',
            'click #reply-cancel': 'toggleEditor'
        },
        initialize: function() {
            this.listenTo(this.options.ticketInfoModel,'change',
                function(){
                    if(this.model.get('show-activite')) {
                        this.render();
                    }
                }
            );
        },
        //className: 'flows',
        beforeRender: function () {
            this.model = this.options.ticketInfoModel;

        },
        afterRender: function () {
            _.delay(_.bind(function(){
                this.$('#show_more').addClass('hide');
                this.$('#DescriptionNotAllowEmpty').addClass('hide');
                this.$('#DescriptionSizeExceedsTheAllowableLimit').addClass('hide');
                this.page = 0;//需要在此处初始化page
                this.$('.ticket-description').html(_replaceSerializeNumber(this.model.get('description')));
                //设置prepend
                prependView(true);
                var ticketStatusCollection = new TicketsHistoryCollection();
                ticketStatusCollection.getStatuses(this.model.get('id'), 0, this.initSize,this.model.get('show-activite')).done(_.bind(function(){
                    var leftCount = ticketStatusCollection.page.totalPages;
                    if (leftCount > 1) {
                        this.$('#show_more').addClass('show');
                    }
                    this.removeView('div.flows', new TicketsFlowConversition());
                    ticketStatusCollection.each(_.bind(function(one){
                        this.timeinit = one.attributes.createdDate;
                        this.insertView('div.flows', new TicketsFlowConversition({model: one}));
                    }, this));
                    $.when(this.renderViews()).done(_.bind(function(){
                        var ticketConversations = this.getView('div.flows');
                        if(ticketConversations){
                            this.timeFlag = ticketConversations.model.get('createdDate');
                        }
                    }, this));
                }, this));
            },this),1000);
        },
        showMore: function(e){
            e.preventDefault();
            e.stopPropagation();
            this.timeFlag = this.timeinit;
            //getStatuses
            //以timeFlag 为标记 使用两次查询 并组合数据的方式展示
            prependView(true);
            var ticketStatusCollection = new TicketsHistoryCollection();
            ticketStatusCollection.getNextStatuses(this.model.get('id'), this.page, this.size, this.timeFlag, this.model.get('show-activite')).done(_.bind(function(){
                var leftCount = ticketStatusCollection.page.totalPages;
                if (leftCount === 1) {
                    this.$('#show_more').html('');
                }
                this.renderCollection(ticketStatusCollection);
                _.each(ticketStatusCollection.models, _.bind(function(oneModel){
                    this.timeinit = oneModel.get('createdDate');
                }, this));
            }, this)).fail(_.bind(function(){
                $(window).info(gettext('Fail To Show More Tickets'));
            }, this));
        },
        renderCollection: function(ticketStatusCollection){
            _.each(ticketStatusCollection.models, _.bind(function(oneModel){
                this.insertView('div.flows', new TicketsFlowConversition({model: oneModel})).render();
            }, this));
        },
        _submitReplyForm: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.memo();
        },
        toggleEditor: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.$('#DescriptionNotAllowEmpty').addClass('hide');
            this.$('#reply-div').toggleClass('hide');
            if (!this.$('#reply-div').hasClass('hide')) {
                //this.$('#ticket-attr-reply').focus();
                //this.$('#ticket-attr-reply').next().find('.wysihtml5-editor').focus();
                //this.$('#ticket-attr-reply').next().next().focus();
                this.$('#ticket-attr-reply').wysihtml5();
                this.$('#ticket-attr-reply').data('wysihtml5').editor.focus();
                //wysihtml5-editor
            } else {
                this.$('#reply-div').val('');
                this.render();
            }
        },
        memo: function () {
            var historyModel = new TicketsHistoryModel();
            var data = {
                description: this.$('#ticket-attr-reply').data('wysihtml5').editor.getValue(),
                type: 'Memo',
                visibility: 'AgentOnly'
            };
            historyModel.set(data);
            if (historyModel.get('description')==='') {
                this.$('#DescriptionNotAllowEmpty').removeClass('hide');
                return;
            }
            if (_s.replaceAll(_s.replaceAll(historyModel.get('description'),'&nbsp;', ''),' ', '')==='') {
                this.$('#DescriptionNotAllowEmpty').removeClass('hide');
                return;
            }
            if (historyModel.get('description') && historyModel.get('description').length > 2000) {
                this.$('#DescriptionSizeExceedsTheAllowableLimit').addClass('show');
                return;
            }
            this.$('.save').attr('disabled','disabled');
            historyModel.addMemo(data, ticketsDetail.model.id).done(_.bind(function (returnModel) {
                historyModel.set(returnModel);
                this.$('#reply-div').addClass('hide');
                this.$('#ticket-attr-reply').val('');
                prependView(false);
                var oneView = new TicketsFlowConversition({model: historyModel});
                ticketsFlow.insertView('div.flows', oneView).render();
                //备注信息为html
                oneView.$('.ticket-description').html(_replaceSerializeNumber(historyModel.attributes.description));
                this.$('#ticket-attr-reply').data('wysihtml5').editor.setValue('');
                $(window).info(gettext('add memo successful'));
                this.render();
            }, this)).fail(function () {
                this.$('.save').removeAttr('disabled');
                $(window).info(gettext('add memo failure'));
            });
        },
        forward: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.$('#reply-div').toggleClass('hide');
            var historyModel = new TicketsHistoryModel();
            var data = {
                ticketId: ticketsDetail.model.id, statusDto: {
                    /**
                     * 活动Activity,
                     * 备注Memo,
                     * 转发Reply
                     */
                    description: this.$('#ticket-attr-reply').val(), type: 'Reply', visibility: 'AgentOnly'
                }
            };
            historyModel.set(data);
            historyModel.save({}, {wait: true}).done(_.bind(function () {
                this.$('#reply-div').addClass('hide');
                this.$('#ticket-attr-reply').val('');
                prependView(false);
                ticketsFlow.insertView('div.flows', new TicketsFlowConversition({model: historyModel})).render();
                $(window).info('转发成功');
            }, this)).fail(function () {
                $(window).info('转发失败');
            });
        }
    });

    var TicketsFlowConversition = Backbone.View.extend({
        template: 'templates:tickets:tickets-flow-conversition',
        className: 'conversation_thread',
        events: {
            'click a.ticket-conversation-edit': '_edit',
            'click a.ticket-conversation-trash': '_trash',
            'click .ticket-conversation-reply-cancel': '_cancel',
            'click .ticket-conversation-reply-submit': '_submit'
        },
        serialize: function () {
            return this.model.toJSON();
        },
        afterRender: function () {
            this.wEditor = this.$('.ticket-conversation-content').wysihtml5();
            if (this.model.get('type') === 'Memo'){
                this.$('.timeline-description').html(_replaceSerializeNumber(this.model.attributes.description));
            }
            this.$('#DescriptionSizeExceedsTheAllowableLimitUpdate').addClass('hide');
            this.$('#EditDescriptionNotAllowEmpty').addClass('hide');
        },
        _edit: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.$('.ticket-conversation-reply-div').toggleClass('hide');
            this.$('.info').toggleClass('hide');
            this.$('#EditDescriptionNotAllowEmpty').addClass('hide');
            this.$('.ticket-conversation-content').data('wysihtml5').editor.setValue(this.model.attributes.description).focus();
        },
        _trash: function (e) {
            e.preventDefault();
            e.stopPropagation();
            app.vent.trigger('confirm', {
                callback: _.bind(
                            function(view){
                                view.hide();
                                this.model.destroy()
                                    .done(_.bind(function () {
                                                this.$el.animate({opacity: 0.5}, 1000, _.bind(function () {
                                                    this.remove();
                                                }, this.$el));
                                        this.$el.info(gettext('delete memo successful'));
                                    }, this))
                                    .fail(_.bind(function () {
                                        this.$el.info(gettext('delete memo failure'));
                                    }, this));
                }, this),
                text: {
                    title: 'Confirm Delete Tickets Memo',
                    content: 'Confirm Delete Tickets Memo Content'
                }
            });
        },
        _cancel: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.$('.ticket-conversation-reply-div').toggleClass('hide');
            this.$('.info').removeClass('hide');
            this.$('#EditDescriptionNotAllowEmpty').addClass('hide');
        },
        _submit: function (e) {
            e.preventDefault();
            e.stopPropagation();
            var historyModel = new TicketsHistoryModel();
            var data = {
                description: this.$('.ticket-conversation-content').data('wysihtml5').editor.getValue(),
                type: 'Memo',
                visibility: 'AgentOnly'
            };
            historyModel.set(data);
            if (historyModel.get('description')==='') {
                this.$('#EditDescriptionNotAllowEmpty').removeClass('hide');
                return;
            }
            if (_s.replaceAll(_s.replaceAll(historyModel.get('description'),'&nbsp;', ''),' ', '')==='') {
                this.$('#EditDescriptionNotAllowEmpty').removeClass('hide');
                return;
            }
            if (historyModel.get('description') && historyModel.get('description').length > 2000) {
                this.$('#DescriptionSizeExceedsTheAllowableLimitUpdate').addClass('show');
                return;
            }
            this.model.update({description: this.$('.ticket-conversation-content').data('wysihtml5').editor.getValue()}, _.bind(function (changedModel) {
                this.model = changedModel;
                this.$('.ticket-conversation-content').data('wysihtml5').editor.setValue('');
                this.$('.timeline-description').html(_replaceSerializeNumber(changedModel.get('description')));
                this.$('.ticket-conversation-reply-div').toggleClass('hide');
            }, this));
            this.render();
            var _hide = _.bind(function() {
                this.$('.ticket-conversation-reply-div').toggleClass('hide');
            }, this);
            _.delay(_hide, 200);
        }
    });
    var TicketsDetail = Backbone.View.extend({
        template: 'templates:tickets:tickets-detail',
        events: {
            'submit .tickets-update': '_ticketsUpdate',
            'click .triangle-down-requester-info': '_requesterInfo',
            'click .triangle-down-ticket-attr': '_ticketAttr',
            'click .cancel': '_expiredCancel'
        },
        initialize: function() {
            this.listenTo(this.model,'change:priority', function() {
                    this.render();
                    this.$('.expiredDate').datetimepicker({
                        pickTime: true,
                        minDate: moment(),
                        defaultDate: moment(this.model.get('expiredDate'))
                    });
            });
        },
        _expiredCancel: function(){
            this.$('#popover-expires').addClass('hide');
            this.render();
        },
        _updateExpiredDate: function(date) {
            var expiredDate = moment(date).toISOString();
            var UpdateModel = Backbone.Model.extend({
                url: function() {
                    return  'tickets/' + this.id +'?expired-date=' + expiredDate;
                },
                updateExpiredDate: function(o) {
                    o = o || {};
                    return this.sync('update', this, o);
                }
            });
            var model = new UpdateModel({id: this.model.id});
            var that = this;
            model.updateExpiredDate({wait: true})
                .done(function() {
                    that.model
                        .fetch({},{wait: true})
                        .done(function(){
                            that.render();
                        });
                    $(window).info(gettext('upateExpiredDate successful'));
                }).fail(function(){
                    $(window).info(gettext('upateExpiredDate failure'));
                });
        },
        _requesterInfo: function(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.$('.requester-info').toggleClass('hide');
            if (!this.$('.requester-info').hasClass('hide')) {
                this.$('.requester-info').removeClass('hide');
            }
        },
        _ticketAttr: function(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.$('.tickets-update').toggleClass('hide');
            if (!this.$('.tickets-update').hasClass('hide')) {
                this.$('.tickets-update').removeClass('hide');
            }
        },
        _initAgents: function() {
            var flag = 'false';
            if (this.model.get('group')) {
                _.each(groupCollection.models, _.bind(function(oneModel){
                    if (this.model.attributes.group.id === oneModel.get('id')){
                        flag = 'true';
                    }
                }, this));
                if (flag === 'false') {
                    this.model.attributes.group.id = '';
                }
                this._changeAssigneeByGroupIdAgent(this.model.attributes);
            }
        },
        _initGroupChange: function(){
            var self = this;
            this.$('form select[name="group"]').change(function(e){
                var slctGroup = $(e.target);
                self._changeAssigneeByGroupId(slctGroup.val());
            });
        },
        _changeAssigneeByGroupIdAgent: function(params){
            var username;
            var name;
            var groupId = params.group.id;
            if (params.assignee) {
                username = params.assignee.username;
                name = params.assignee.name;
            }
            var self = this;
            var slctAssignee = $('form select[name="assignee"]');
            //var _groupAgents = getAgentsCollectionByGroupId(groupId);
            //jshint expr: true
            groupAgentsCollectionMap[groupId] ? void 0 : groupAgentsCollectionMap[groupId] = getAgentsCollectionByGroupId(groupId);
            groupAgentsCollectionMap[groupId].fetch({reset: true}).done(function(){
                self._initSelectAgent.call(slctAssignee, username, {
                    data: groupAgentsCollectionMap[groupId],
                    format: function(data){
                        var retArr = [{id: '', name: '--', text: '--'}];
                        if (username) {
                            retArr.push({id: username, name: name, text: name});
                        }
                        data.each(function(one){
                            if(one.get('username')!==username){
                                retArr.push({id: one.get('username'), name: one.get('name'), text: one.get('name')});
                            }
                        });
                        return retArr;
                    }
                });
            }).fail(function(){
                //空组
                self._initSelect.call(slctAssignee, {
                    data: groupAgentsCollectionMap[groupId],
                    format: function(){
                        var retArr = [{id: '', name: '--', text: '--'}];
                        return retArr;
                    }
                });
            });
        },
        _initSelectAgent: function(username,opts){
            //data, onchange, format, callback, osd
            //jshint expr: true
            if(!opts && !opts.data){
                throw gettext('Need Options And Data When Init Select');
            }
            opts.data = opts.format && _.isFunction(opts.format) ? opts.format(opts.data) : opts.data;
            var slct = this;
            slct.empty();
            _.each(opts.data, function (one) {
                if (username===one.id) {
                    slct.append($('<option value="' + one.id + '" selected>' + one.name + '</option>'));
                } else {
                    slct.append($('<option value="' + one.id + '">' + one.name + '</option>'));
                }
            });
            opts.callback && _.isFunction(opts.callback) ?  opts.callback.call(slct) : void 0;
            //将事件定义放在callback之后, 这样callback中定义的change,不会触发再其后面定义的事件
            opts.onchange && _.isFunction(opts.onchange) ? slct.on('change', opts.onchange) : void 0;
        },
        _changeAssigneeByGroupId: function(groupId){
            var self = this;
            var slctAssignee = $('form select[name="assignee"]');
            //var _groupAgents = getAgentsCollectionByGroupId(groupId);
            //jshint expr: true
            groupAgentsCollectionMap[groupId] ? void 0 : groupAgentsCollectionMap[groupId] = getAgentsCollectionByGroupId(groupId);
            groupAgentsCollectionMap[groupId].fetch({reset: true}).done(function(){
                self._initSelect.call(slctAssignee, {
                    data: groupAgentsCollectionMap[groupId],
                    format: function(data){
                        var retArr = [{id: '', name: '--', text: '--'}];
                        data.each(function(one){
                            retArr.push({id: one.get('username'), name: one.get('name'), text: one.get('name')});
                        });
                        return retArr;
                    }
                });
            }).fail(function(){
                //空组
                self._initSelect.call(slctAssignee, {
                    data: groupAgentsCollectionMap[groupId],
                    format: function(){
                        var retArr = [{id: '', name: '--', text: '--'}];
                        return retArr;
                    }
                });
            });
        },
        _initSelect: function(opts){
            //data, onchange, format, callback, osd
            //jshint expr: true
            if(!opts && !opts.data){
                throw gettext('Need Options And Data When Init Select');
            }
            opts.data = opts.format && _.isFunction(opts.format) ? opts.format(opts.data) : opts.data;
            var slct = this;
            slct.empty();
            _.each(opts.data, function (one) {
                slct.append($('<option value="' + one.id + '">' + one.name + '</option>'));
            });
            opts.callback && _.isFunction(opts.callback) ?  opts.callback.call(slct) : void 0;
            //将事件定义放在callback之后, 这样callback中定义的change,不会触发再其后面定义的事件
            opts.onchange && _.isFunction(opts.onchange) ? slct.on('change', opts.onchange) : void 0;
        },
        _ticketsUpdate: function(e){
            e.preventDefault();
            var currTicketModel = new TicketInfoModel();
            var assignee = $('#tickets-update-agent').val();
            var group = $('#tickets-update-group').val();
            var priority = $('#tickets-update-priority').val();
            var state = $('#tickets-update-status').val();
            var type = $('#tickets-update-type').val();
            var requester = this.model.get('requester').id;
            var componetTicketModel = this.model.pick('id', 'subject');
            currTicketModel.set('assignee', assignee);
            currTicketModel.set('group', group);
            currTicketModel.set('id', componetTicketModel.id);
            currTicketModel.set('priority', priority);
            currTicketModel.set('requester', requester.id);
            currTicketModel.set('state', state);
            currTicketModel.set('subject', componetTicketModel.subject);
            currTicketModel.set('type', type);
            var model = new TicketInfoModel(currTicketModel);
            model.save({}, {wait: true,validate: false}).done(_.bind(function(){
                if (state === 'Closed') {
                    this.$('.input-group').addClass('hide');
                    this.$('.expired-date').removeClass('hide');
                } else {
                    this.$('.input-group').removeClass('hide');
                    this.$('.expired-date').addClass('hide');
                }
                this.model.set('priority',priority);
                $(window).info(gettext('save successful'));
                ticketsDetail.$('#show-state').text(gettext(state));
            }, this)).fail(function(){
                $(window).info(gettext('save failure'));
            });
        },
        serialize: function () {
            //return this.model.toJSON();
            return _.extend(this.model.toJSON(), {
                ticketForm: domainModel.toJSON(),
                agents: agentCollection.toJSON(),
                groups: groupCollection.toJSON()
            });
        },
        beforeRender: function () {
            var done = this.async();
            $.when(domainModel.fetch(),
                groupCollection.fetch(),
                agentCollection.fetch(),
                this.model.fetch()
            ).done(function() {
                done();
            });
        },
        afterRender: function () {
            this._initAgents();
            this._initGroupChange();
            // 日期组件
            this.initUpdateExpires();
            if (this.model.get('state') === 'Closed') {
                this.$('#expired-date').addClass('hide');
            }

        },
        /**
         * 初始化更改过期时间
         */
        initUpdateExpires: function() {
            // init date time picker
            var $date = this.$('.date.expires').datetimepicker({
                minDate: moment(),
                defaultDate: moment().add({minutes: 14}),
                format: 'llll',
                stepping: 15,
                sideBySide: false,
                inline: true,
            });
            // 使用backbone的popover样式，但是自定义了几个方法。
            var popover = _.extend({
                _defer: function(func) {
                    if (!!!this._timeout) {
                        this._timeout = _.defer(_.bind(function() {
                            func.apply(this).done(_.bind(function() {
                                this._timeout = undefined;
                            }, this));
                        }, this));
                    }
                }
            }, {
                $target: this.$('#popover-expires'),
                // 显示popover
                showPopover: function() {
                    this._defer(function() {
                        var def = $.Deferred();
                        // 首先显示出来
                        this.$target.show();
                        // 渐入动画
                        _.defer(_.bind(function() {
                            this.$target.addClass('in');
                        }, this));
                        _.delay(function() {
                            def.resolve();
                        }, 150);
                        return def.promise();
                    });

                },
                // 隐藏popover
                hidePopover: function() {
                    // 减出动画
                    this._defer(function() {
                        var def = $.Deferred();
                        this.$target.removeClass('in');
                        // 动画大概完毕后，隐藏
                        _.delay(_.bind(function() {
                            this.$target.hide();
                            def.resolve();
                        }, this), 150);
                        return def.promise();
                    });

                },
                // toggle
                togglePopover: function() {
                    var funcName = this.$target.hasClass('in') ? 'hidePopover' : 'showPopover';
                    if (DEBUG) {
                        console.log('toggle popover', funcName);
                    }

                    this[funcName].call(this);
                },
            });
            this.$('#expired-date').click(function() {
                popover.togglePopover();
            });
            var _updateExpiredDate = _.bind(this._updateExpiredDate, this);
            this.$('button.update-expires').click(function() {
                // TODO update expires
                var expires = $date.data('DateTimePicker').date();
                _updateExpiredDate(expires);
                if (DEBUG) {
                    console.log('update expires date', expires.toISOString());
                }
                popover.togglePopover();
            });


        }
    });
    var TicketsView = Backbone.View.extend({
        template: 'templates:tickets:tickets',
        views: {
            //'.tickets-flow': ticketsFlow = new TicketsFlow(),
            //'.tickets-detail': ticketsDetail = new TicketsDetail(this.options)

        },
        events: {
            'click .tickets-info>h3': '_toggleInfoDiv',
            'submit form.tickets-update': 'submitUpdateForm',
            'click #more-action-edit': '_updateTicket',
            'click #fix-forward': '_forward',
            'click #fix-memo': '_forward',
            'click #fix-close': '_close',
            'click #recovery': '_recovery',
            'click #cancelDeleted': '_cancelDeleted',
            'click #delete': '_delete',
            'click #cancel': '_cancelDeleted',
            'click #show-activity': '_showActivity',
            'click #hide-activity': '_hideActivity',
        },
        initialize: function () {
            this.listenTo(app.vent, 'change:show-activite',function(){ this.render();});
        },
        beforeRender: function () {
            //在beforeRender中定义的方法 不要在setView或者insertView之后使用Render方法,应为beforeRender之后自然会走render方法,如果在afterRender中执行set和insert View,则需要手动调用Render方法绘制.但需要注意此时Render方法执行了两次
            //在beforeRender方法中不要使用$('')方式获取dom元素并进行操作,因为没有render,元素还没有绘制
            //但是可以在beforeRender中事先定义事件,比如:$('.clickMe').click();
            this.$('#more-action').click(function () {
                $('.dropdown-toggle').dropdown();
            });
            if (!this.model) {
                var done = this.async();
                this.model = new TicketInfoModel({id: this.options.id});
                this.model.fetch({}, {wait: true}).done(_.bind(function () {
                    this.setView('.tickets-flow', ticketsFlow = new TicketsFlow({ticketInfoModel: this.model}));
                    this.setView('.tickets-detail', ticketsDetail = new TicketsDetail({model: this.model}));
                    done();
                }, this));
            }
            var $win = $(window);
            //var fixedActionsPanel = $('.tickets .fixed-actions');
            $win.scroll(function () {
                if ($win.scrollTop() > 100) {
                    $('.tickets .fixed-actions').width($('.tickets .fixed-actions').width());
                    $('.tickets .fixed-actions').addClass('stuck');
                } else {
                    $('.tickets .fixed-actions').width($('.tickets .fixed-actions').width());
                    $('.tickets .fixed-actions').removeClass('stuck');
                }
            });
        },
        afterRender: function () {
            this.$('#more-action').dropdown();
            if (this.model.get('show-activite') === undefined){
                this.$('#hide-activity').addClass('hide');
                this.$('#show-activity').removeClass('hide');
            } else {
                this.$('#hide-activity').removeClass('hide');
                this.$('#show-activity').addClass('hide');
            }
            var that = this;
            _.delay(_.bind(
                    function(){
                        that.$('#hide-activity').removeAttr('disabled');
                        that.$('#show-activity').removeAttr('disabled');
                    }),1100);
        },
        _showActivity: function(e){
            e.preventDefault();
            e.stopPropagation();
            app.vent.trigger('change:show-activite');
            this.model.set('show-activite','show-activite');
            this.$('#hide-activity').removeClass('hide');
            this.$('#show-activity').addClass('hide');
            this.$('#hide-activity').attr('disabled','disabled');
        },
        _hideActivity: function(e){
            e.preventDefault();
            e.stopPropagation();
            app.vent.trigger('change:show-activite');
            this.model.unset('show-activite');
            this.$('#hide-activity').addClass('hide');
            this.$('#show-activity').removeClass('hide');
            this.$('#show-activity').attr('disabled','disabled');
        },
        _toggleInfoDiv: function (e) {
            e.preventDefault();
            e.stopPropagation();
            var trigger = $(e.target);
            trigger.siblings().toggle();
            //icon change
            trigger.toggleClass('passive');
        },
        _forward: function (e) {
            e.preventDefault();
            e.stopPropagation();
            ticketsFlow.toggleEditor();
        },
        _close: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.model.update('状态', '关闭', {state: 'Closed'});
            //更新detail区域
            ticketsDetail.$('#show-state').text(gettext('Closed'));
            ticketsDetail.$('#tickets-update-status').val('Closed');
            $('#expired-date').addClass('hide');
            if (this.$('#show-activity').is(':hidden')) {
                app.vent.trigger('change:show-activite');
                this.model.set('show-activite','show-activite');
                this.$('#hide-activity').removeClass('hide');
                this.$('#show-activity').addClass('hide');
                this.$('#hide-activity').attr('disabled','disabled');
            }
        },
        _updateTicket: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Backbone.history.navigate('/tickets/form/' + this.model.id, true);
        },
        _recovery: function (e) {
            e.preventDefault();
            var RestoreModel = Backbone.Model.extend({
                url: function() {
                    return  'tickets/' + this.id +'?restore';
                },
                restore: function(o) {
                    o = o || {};
                    return this.sync('update', this, o);
                }
            });
            var model = new RestoreModel({id: this.model.id});
            var that = this;
            model.restore({wait: true})
                .done(function() {
                    that.model
                    .fetch({},{wait: true})
                        .done(function(){
                            that.render();
                        });
                    $(window).info(gettext('restore ticket successful'));
                })
                .fail(function(){
                    $(window).info(gettext('restore ticket failure'));
                });
        },
        _delete:function(e){
            e.preventDefault();
            var RestoreModel = Backbone.Model.extend({
                url: function() {
                    return  'tickets/' + this.id +'?move-to-trash';
                },
                delete: function(o) {
                    o = o || {};
                    return this.sync('update', this, o);
                }
            });
            var model = new RestoreModel({id: this.model.id});
            var that = this;
            app.vent.trigger('confirm', {
                callback: _.bind(function(view){
                    view.hide();
                    model.delete({wait: true})
                        .done(function() {
                            that.model
                            .fetch({},{wait: true})
                                .done(function(){
                                that.render();
                        });
                        $(window).info(gettext('delete ticket successful'));
                        })
                        .fail(function(){
                        $(window).info(gettext('delete ticket failure'));
                        });
                }, this),
                text: {
                    title: 'Confirm Delete Selected Tickets',
                    content: 'The Deleted Tieckets will not edit,please look up in deleted list'
                }
            });
        },
        _cancelDeleted: function(){
            history.go(-1);
        }
    });

    var prependView = function (bool) {
        if (bool) {
            ticketsFlow.insert = function ($root, $el) {
                $root.prepend($el);
            };
        } else {
            ticketsFlow.insert = function ($root, $el) {
                $root.append($el);
            };
        }

    };

    return TicketsView;
});
