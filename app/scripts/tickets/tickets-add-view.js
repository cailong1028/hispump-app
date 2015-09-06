/* global define, app, client, gettext */
'use strict';
define([
    'underscore',
    'jquery',
    'backbone',
    'contacts/contact-model',
    'tickets/ticket-model',
    'tickets/tickets-new-requester-view',
    'tickets/cache',
    'helpers/uploader',
    'underscore.string',
    'jquery-select2',
    'vendor/backbone.cache'
], function(_, $, Backbone, ContactModel, TicketModel, AddNewRequesterView, ticketsCache, Uploader, _s) {
    var FilterDomainModel = Backbone.CachedModel.extend({
        url: 'tickets/ticketdomain',
        cacheObject: ticketsCache,
        cachekey: 'ticketdomain'
    });
    var GroupModel = Backbone.Model.extend({});
    var GroupCollection = Backbone.Collection.extend({
        url: 'groups/findall',
        model: GroupModel
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

    var groupCollection = new GroupCollection();
    var domainModel = new FilterDomainModel();
    var agentCollection = new AgentCollection();

    var suggestContacts  = function(quietMillis) {
        var timeout;
        return function(o) {
            window.clearTimeout(timeout);
            timeout = setTimeout(function() {
                $.getJSON(app.buildUrl('contacts/suggest'), {
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

    var enableFileTypes = [
        'text/csv',
        'text/rtf',
        'text/plain',
        'text/xml',
        'text/richtext',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/pdf',
        'application/rtf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-outlook',
        'application/vnd.ms-powerpoint',
        'application/vnd.ms-project',
        'application/vnd.ms-works',
        'application/x-compress',
        'application/x-compressed',
        'application/x-gtar',
        'application/x-gzip',
        'application/x-mswrite',
        'application/x-tar',
        'application/zip',
        'application/x-rar-compressed',
        'application/vnd.sealed.eml'
    ];

    var TicketsAddView = Backbone.View.extend({
        template: 'templates:tickets:tickets-add',
        views: {
        },
        events: {
            'click .addNewContacts': '_addNewContact',
            'click .cancel': '_cancel',
            'submit .ticket-form': '_submitForm',
            'click .save-close': '_submitForm',
            'click .save-continue': '_saveContinue'
        },
        serialize: function() {
            return _.extend({}, domainModel.toJSON(), {
                agents: agentCollection.toJSON(),
                groups: groupCollection.toJSON(),
                currAgent: client.profile().attributes
            });
        },
        beforeRender: function() {
            var done = this.async();
            this.model = new TicketModel();
            $.when(domainModel.fetch(),
                groupCollection.fetch(),
                agentCollection.fetch()).done(function() {
                done();
            });
        },
        afterRender: function() {
            this._initGroupChange();
            this.$('.dropdown-toggle').dropdown();
            this.$('#ticket-description').wysihtml5();
            // 初始化联系人
            this._initRequester();
            // 初始化上传附件
            this._initFileUpload();
            //初始化焦点
            $('#requester').focus();
        },
        _initFileUpload: function() {
            var uploader = new Uploader.MultipleObjectsView({
                acceptedFiles: enableFileTypes.join(',')
            });
            this.attachments = [];
            this.listenTo(uploader, 'upload:successful', function(file) {
                if (DEBUG) {
                    console.log('upload successful file uri:', file.uri);
                }
                this.attachments.push(file.uri);
            });
            this.listenTo(uploader, 'upload:removedfile', function(file) {
                if (DEBUG) {
                    console.log('uploaded removed file uri:', file.uri);
                }
                this.attachments = _.without(this.attachments, file.uri);
            });
            this.listenTo(uploader, 'upload:sending', function() {
                if (DEBUG) {
                    console.log('sending file');
                }
                // 正在发送时，提交按钮禁用
                this.$('.btn-group.submits > button').attr('disabled', 'disabled');
            });
            this.listenTo(uploader, 'upload:queuecomplete', function() {
                // 所有附件发送完毕后，附件按钮启用。
                this.$('.btn-group.submits > button').removeAttr('disabled');
            });
            this.insertView('#file-uploader', uploader).render();
        },
        _initRequester: function() {
            var requesterView = new AddNewRequesterView();
            this.listenTo(requesterView, 'add-contact:successful', function(model) {
                this.$('#requester').val(model.id).trigger('change');
            });
            this.setView('.add-new-requester', requesterView).render();

            this.$('#requester').select2({
                minimumInputLength: 1,
                cache: true,
                placeholder: gettext('Select a Contact'),
                // 保留query方法。。。这玩意会报错的。。
                query: suggestContacts(700),
                formatResult: formatResult,
                formatSelection: formatResult,
                initSelection: function (e, callback) {
                    if (requesterView.model) {
                        callback(requesterView.model.toJSON());
                    } else {
                        callback();
                    }
                }
            });
            this.on('change', function(e) {
                e.preventDefault();
            });
        },
        _addNewContact: function(e) {
            e.preventDefault();
            this.getView('.add-new-requester').show();
        },
        _submitForm: function(e) {
            e.preventDefault();
            this.$('.error-messages').hide();
            this._save().done(function(model) {
                $(window).info(gettext('add ticket successful'));
                Backbone.history.navigate('/tickets/' + model.id, true);
            }).fail(function(){
                $(window).info(gettext('add ticket failure'));
            });
        },
        _saveContinue: function(e) {
            e.preventDefault();
            var that = this;
            this.$('.dropdown-toggle').dropdown('toggle');
            this._save().done(function() {
                that.render();
                window.scrollTo(0,0);
            }).fail(function(){
                that.$('.btn-group.submits > button').removeAttr('disabled');
            });
        },
        _cancel: function(e) {
            e.preventDefault();
            window.history.back();
        },
        // 新增和更新时调用方法统一调用在model中定义的saveUpdateForm,此处不再使用
        _save: function() {
            this.$('.btn-group.submits > button').attr('disabled', 'disabled');
            var form = this.$('.ticket-form').serializeObject();
            form.requester = this.$('#requester').select2('val');
            form = _.pick(form, TicketModel.prototype.attributes);
            //添加来源
            form.source = 'web';

            // 校验form, 而不是this
            var model = new TicketModel();
            model.set(form);
            if (!model.isValid()) {
                var errSpan = this.$('#' + model.validationError);
                errSpan.show();
                if (errSpan.prev().hasClass('group-select')) {
                    // 只有input才能 获得焦点, span不行
                    errSpan.prev().prev().find('input.select2-focusser').focus();
                } else {
                    errSpan.prev().focus();
                }
                if(errSpan.attr('id') === 'requesterNameTooLang'){
                    this.$('.btn-group.submits > button').removeAttr('disabled');
                    this.$('input[name="subject"]').focus();
                    return;
                }
                this.$('.btn-group.submits > button').removeAttr('disabled');
                return;
            }
            model.set('subject',_s.trim(model.get('subject')));
            return model.save({attachments: this.attachments}, {
                wait: true
            });
        },
        _initGroupChange: function(){
            var self = this;
            this.$('form select[name="group"]').change(function(e){
                var slctGroup = $(e.target);
                self._changeAssigneeByGroupId(slctGroup.val());
            });
        },
        _changeAssigneeByGroupId: function(groupId){
            var self = this;
            var slctAssignee = $('form select[name="assignee"]')[0];
            //jshint expr: true
            var agentsCollection = getAgentsCollectionByGroupId(groupId);
            agentsCollection.fetch({reset: true}).done(function(){
                self._initSelect.call(slctAssignee, {
                    data: agentsCollection,
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
                    data: agentsCollection,
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
            var $this = $(this);
            $this.empty();
            _.each(opts.data, function (one) {
                $this.append($('<option value="' + one.id + '">' + one.name + '</option>'));
            });
            opts.callback && _.isFunction(opts.callback) ?  opts.callback.call($this) : void 0;
            //将事件定义放在callback之后, 这样callback中定义的change,不会触发再其后面定义的事件
            opts.onchange && _.isFunction(opts.onchange) ? $this.on('change', opts.onchange) : void 0;
        }
    });

    return TicketsAddView;
});
