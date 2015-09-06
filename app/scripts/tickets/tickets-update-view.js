/* global define, app, gettext */
'use strict';
define([
    'underscore',
    'jquery',
    'backbone',
    'tickets/ticket-model',
    'tickets/tickets-new-requester-view',
    'tickets/cache',
    'helpers/uploader',
    'underscore.string',
    'jquery-select2',
    'vendor/backbone.cache'
], function (_, $, Backbone, TicketModel, AddNewRequesterView, ticketsCache, Uploader, _s) {
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

    var TicketsUpdateView = Backbone.View.extend({
        template: 'templates:tickets:tickets-update',
        events: {
            'click .addNewContacts': '_addNewContact',
            'click .cancel': '_cancel',
            'submit .ticket-form': '_submitForm',
            'click .delele-upload-file': '_deleteUploadFile',
            'click .attachment-action': '_validaAttach'
        },
        _initAgents: function() {
            if (this.model.attributes.group) {
                this._changeAssigneeByGroupIdAgent(this.model.attributes);
            }
        },
        serialize: function() {
            return _.extend(this.model.toJSON(), {
                ticketForm: domainModel.toJSON(),
                agents: agentCollection.toJSON(),
                groups: groupCollection.toJSON()
            });
        },
        initialize:function() {
            this.model = new TicketModel({id: this.id});
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
            //jshint expr: true
            var agentsCollection = getAgentsCollectionByGroupId(groupId);
            agentsCollection.fetch({reset: true}).done(function(){
                self._initSelectAgent.call(slctAssignee, username, {
                    data: agentsCollection,
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
                    data: agentsCollection,
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
                if (username === one.id) {
                    slct.append($('<option value="' + one.id + '" selected>' + one.name + '</option>'));
                } else {
                    slct.append($('<option value="' + one.id + '">' + one.name + '</option>'));
                }
            });
            opts.callback && _.isFunction(opts.callback) ?  opts.callback.call(slct) : void 0;
            //将事件定义放在callback之后, 这样callback中定义的change,不会触发再其后面定义的事件
            opts.onchange && _.isFunction(opts.onchange) ? slct.on('change', opts.onchange) : void 0;
        },
        beforeRender: function() {
            var done = this.async();
            $.when(domainModel.fetch(),
                groupCollection.fetch(),
                agentCollection.fetch(),
                this.model.fetch()).done(function() {
                done();
            });
        },
        afterRender: function() {
            this._initGroupChange();
            this._initAgents();
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
        _deleteUploadFile: function(e) {
            e.preventDefault();
            var delBtn = $(e.target);
            var model = new Backbone.Model();
            model.urlRoot = 'attachment';
            model.set({
                id: delBtn.attr('data-id')
            });
            model.destroy().done(function() {
                var parDiv = delBtn.parent();
                var br = delBtn.parent().next();
                parDiv.remove();
                br.remove();
            }).fail(function() {
                $(window).info('附件删除失败');
            });
        },
        _initRequester: function() {
            var requester = this.model.get('requester');

            var requesterView = new AddNewRequesterView();

            this.listenTo(requesterView, 'add-contact:successful', function(model) {
                this.$('#requester').val(model.id).trigger('change');
            });
            this.setView('.add-new-requester', requesterView).render();

            this.$('#requester').select2({
                minimumInputLength: 1,
                cache: true,
                // placeholder 可能不会出现
                placeholder: gettext('Select a Contact or Add new Contact'),
                query: suggestContacts(700),
                formatResult: formatResult,
                formatSelection: formatResult,
                initSelection: function (e, callback) {
                    if (requesterView.model) {
                        callback(requesterView.model.toJSON());
                    } else if (requester) {
                        callback(requester);
                    }
                }
            });
        },
        _addNewContact: function(e) {
            e.preventDefault();
            this.getView('.add-new-requester').show();
        },
        _validaAttach: function(e){
            e.preventDefault();
            e.stopPropagation();
            var $tgt = $(e.target),
                $attachParent = $tgt.parents('.ticket-attachment'),
                $attachmentA = $attachParent.find('.attachment-name');
            if($tgt.hasClass('fa-close')){
                $tgt.attr('title', gettext('Recovery'));
                $tgt.removeClass('fa-close').addClass('fa-reply');
                $attachmentA.removeClass('valid').addClass('invalid');
            }else{
                $tgt.attr('title', gettext('Delete'));
                $tgt.removeClass('fa-reply').addClass('fa-close');
                $attachmentA.removeClass('invalid').addClass('valid');
            }
        },
        _submitForm: function(e) {
            e.preventDefault();
            this.$('.error-messages').hide();

            var form = this.$('.ticket-form').serializeObject();
            form.requester = this.$('#requester').select2('val');
            form = _.pick(form, TicketModel.prototype.attributes);
            form.attachments = _.clone(this.attachments);//防止更新失败时,再次点击的时候this.attachments改变
            /*this.$('.ticket-attachment .attachment-name.valid').each(function() {
                form.attachments.push($(this).attr('data-id'));
            });*/
            this.$('.ticket-attachment .attachment-name.invalid a').each(function() {
                form.deleteAttachmentIds = form.deleteAttachmentIds || [];
                form.deleteAttachmentIds.push($(this).attr('data-id'));
            });
            // 校验form, 而不是this
            var model = new TicketModel(form);
            model.set('id', this.model.id);
            if (model.get('description')===undefined) {
                model.set('description','');
            }
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
                  return this.$('input[name="subject"]').focus();
                }
                return;
            }
            model.set('subject',_s.trim(model.get('subject')));
            return model.save({}, {
                wait: true
            }).done(function(model) {
                $(window).info(gettext('update ticket successful'));
                Backbone.history.navigate('/tickets/' + model.id, true);
            }).fail(function(){
                $(window).info(gettext('update ticket failure'));
            });
        },
        _cancel: function(e) {
            e.preventDefault();
            window.history.back();
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
            var slctAssignee = $('form select[name="assignee"]');
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
    return TicketsUpdateView;
});
