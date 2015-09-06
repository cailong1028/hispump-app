/* global define, app, client, gettext */
'use strict';
define([
    'jquery',
    'underscore',
    'backbone',
    'tickets/ticket-model',
    'tickets/cache',
    'moment',
    'jquery-select2',
    'bootstrap',
    'vendor/jquery-querystring'
], function($, _, Backbone, TicketModel, ticketsCache, moment) {
    if (app.___GETTEXT___) {
        // 确定删除选定的工单
        gettext('Confirm Delete Selected Tickets');
        //被删除的工单无法进行编辑，您可以在“已删除工单”中查看到该工单，并且可以进行恢复和永久删除操作
        gettext('The Deleted Tieckets will not edit,please look up in deleted list');
    }
    var DEFAULT_SORT = 'createdDate,desc';
    // 用于延时调用
    var pickTimeout;
    // 处理状态改变
    var _changeButtonState = function() {
        var $checked = this.$('.pick_td input:checked');
        this.$('thead button').prop('disabled', $checked.length === 0);
        pickTimeout = undefined;
    };
    // 座席model
    var AgentModel = Backbone.Model.extend({});
    // 组座席
    var GroupMemberCollection = Backbone.CachedCollection.extend({
        model: AgentModel,
        cacheObject: ticketsCache,
        url: function() {
            return 'groups/' + this.options.groupId + '/members';
        },
        initialize: function(data, o) {
            this.options = o || {};
            if(!o || !o.groupId) {
                throw 'require options groupId';
            }
            this.cacheKey = 'GroupMembers_' + o.groupId;
        }
    });

    // 全部座席，同时缓存
    var AgentCollection = Backbone.Collection.extend({
        model: AgentModel,
        url: 'agents'
    });

    var agentCollection = new AgentCollection();
    // 工单集合
    var TicketColletion = Backbone.Collection.extend({
        url: 'tickets/filter',
        model: TicketModel,
        params: {},
        pageable: {},
        initialize: function(data, options) {
            this.params = options.params || {};
            if (this.params.page) {
                this.pageable.page = this.params.page;
                delete this.params.page;
            }
        },
        fetchPage: function(page) {
            var sort = this.pageable.sort;
            if(this.params.unassigned==='unassigned'){
                this.params.unassigned='';
                //$('#assigned-to-me').prop('checked', '');
            }
            var params = this.params;
            var size = this.pageable.size;
            var pageable = {
                page: page || 0
            };
            if (sort) {
                params.sort = sort;
            }
            if (_.isNumber(size)) {
                pageable.size = size;
            }
            if (pageable.page === 0) {
                this.queryString = $.QueryString.stringify(_.extend({}, params));
            } else {
                this.queryString = $.QueryString.stringify(_.extend({}, params, pageable));
            }
            $('.picker').prop('checked',false);
            $('.picker').prop('disabled',false);
            return this.fetch({
                data: this.queryString,
                reset: true
            }).done(function() { window.scrollTo(0,0); });
        }
    });


    var FilterDomainModel = Backbone.Model.extend({
        url: 'tickets/ticketdomain'
    });

    var GroupModel = Backbone.Model.extend({});
    var GroupCollection = Backbone.Collection.extend({
        url: 'groups/findall',
        model: GroupModel
    });

    // 缓存数据
    var groupCollection = new GroupCollection();
    var domainModel = new FilterDomainModel();

    var TicketsFilterView = Backbone.View.extend({
        template: 'templates:tickets:tickets-list-filter',
        events: {
            'change .checkbox input[name="assigned-to-me"]': '_searchTicketsAssignedToMe',
            'change .checkbox input[name="unassigned"]': '_searchTicketsUnssigned',
            'change .checkbox input[name="priority[]"]': '_searchTickets',
            'change input.form-control': '_searchTickets',
            'change select.form-control': '_searchTickets',
            'change .checkbox input[name="createdBy"]': '_searchTicketsCreateByMe'
        },
        serialize: function() {
            return _.extend({}, domainModel.toJSON(), {
                groups: groupCollection.toJSON(),
                params: this.collection.params
            });
        },
        beforeRender: function() {
            var done = this.async();
            $.when(domainModel.fetch(), groupCollection.fetch()).done(function() {
                done();
            });
        },
        afterRender: function() {
            this.$('#create-by-me').val(client.profile().get('username'));
            this._initAssignedWithMe();
            this._initPriority();
            this._initCreatedWithin();
            this._initSelect2State();
            this._initSelect2Type();
            this._initSelect2Groups();
            this._initSelect2Agents();
            this._initSelect2Requester();
            this._initSelect2Source();
            this._initUnassigned();
            this._initExpiresIn();
        },
        // 到期时间
        _initExpiresIn: function() {
            if(this.collection.params.expiresIn === 'expired'){
                this.$('#expiresIn').val('expired');
            }
            if(this.collection.params.expiresIn === 'today'){
                this.$('#expiresIn').val('today');
            }
        },
        // 我的工单
        _initAssignedWithMe: function() {
            if (_.has(this.collection.params, 'assigned-to-me')) {
                this.$('#assigned-to-me').attr('checked', 'checked');
            }
        },
        // 未指派
        _initUnassigned: function() {
            if (_.has(this.collection.params, 'unassigned')) {
                this.$('#unassigned').attr('checked', 'checked');
            }
        },
        _reset: function() {
            this.$('#assigned-to-me').removeAttr('checked');
            this.$('#create-by-me').removeAttr('checked');
            this.$('#unassigned').removeAttr('checked');
            this.$('#createWithin').val('');
            this.$('.priorities input').each(function() {
                $(this).removeAttr('checked');
            });
            this.$('#ticket-state').val('');
            this.$('#ticket-groups').val('');
            this.$('#ticket-assignee').val('');
            this.$('#ticket-requester').val('');
        },
        // 创建时间
        _initCreatedWithin: function() {
            this.$('#createWithin').val(this.collection.params.createWithin);
        },
        // 优先级
        _initPriority: function() {
            if (_.has(this.collection.params, 'priority')) {
                return;
            }
            var priority = this.collection.params.priority;
            priority = _.flatten([priority]);
            this.$('.priorities input').each(function() {
                var $this = $(this);
                if (_.contains(priority, $this.val())) {
                    $this.attr('checked', 'checked');
                }
            });
        },
        // 状态选择框
        _initSelect2State: function() {
            this.$('#ticket-state').val(this.collection.params.state).select2();
        },
        // 类型
        _initSelect2Type: function() {
            // var data = domainModel.toJSON();
            this.$('#ticket-type').val(this.collection.params.type).select2();
        },
        // 客服组
        _initSelect2Groups: function() {
            var $groups = this.$('#ticket-groups');
            var groups = this.collection.params.groups;
            if (groups && groups.length > 0) {
                $groups.val(this.collection.params.groups);
            }
            $groups.select2();
        },
        // 客服
        _initSelect2Agents: function() {
            this.$('#ticket-assignee').select2({
                minimumInputLength: 1,
                multiple: true,
                containerCssClass: 'form-control form-control-agent',
                ajax: {
                    url: app.buildUrl('agents'),
                    dataType: 'json',
                    quietMillis: 250,
                    data: function(term) {
                        return {term: term}; // search term
                    },
                    results: function(data) {
                        return {results: data};
                    }
                },
                // 委派座席使用用户名
                id: function(object) {
                    return object.username;
                },
                formatResult: function(object) {
                    var markup = '<div>' + object.name + '</div>';
                    return markup;
                },
                formatSelection: function(object) {
                    return object.name;
                }
            }).on('change', _.bind(this._searchTickets, this));
        },
        // 请求人
        _initSelect2Requester: function() {
            this.$('#ticket-requester').select2({
                minimumInputLength: 1,
                multiple: true,
                containerCssClass: 'form-control',
                ajax: {
                    url: app.buildUrl('contacts/suggest'),
                    dataType: 'json',
                    quietMillis: 250,
                    data: function(term) {
                        return {term: term};
                    },
                    results: function(data) {
                        return {results: data};
                    }
                },
                formatResult: function(object) {
                    var markup = '<div>' + object.name + '</div>';
                    return markup;
                },
                formatSelection: function(object) {
                    return object.name;
                }
            }).on('change', _.bind(this._searchTickets, this));
        },
        _searchTickets: function() {
            var data = this.$('form').serializeObject();
            if (this.$('#ticket-assignee').select2('val').length > 0) {
                if($('#unassigned').prop('checked')){
                    $('#unassigned').prop('checked', '');
                    this.$('form').removeAttr('unassigned');
                    data = this.$('form').serializeObject();
                }
            }
            data.assignee = this.$('#ticket-assignee').select2('val');
            data.requester = this.$('#ticket-requester').select2('val');
            this.collection.params = data;
            this.collection.fetchPage();
        },
        _searchTicketsAssignedToMe: function() {
            if ($('#assigned-to-me').prop('checked')) {
                if ($('#unassigned').prop('checked')) {
                    $('#unassigned').prop('checked', '');
                    this.$('form').removeAttr('unassigned');
                }
                if ($('#create-by-me').prop('checked')) {
                    $('#create-by-me').prop('checked', '');
                    this.$('form').removeAttr('create-by-me');
                }
            }
            var data = this.$('form').serializeObject();
            data.assignee = this.$('#ticket-assignee').select2('val');
            data.requester = this.$('#ticket-requester').select2('val');
            this.collection.params = data;
            this.collection.fetchPage();
        },
        _searchTicketsCreateByMe: function() {
            if ($('#create-by-me').prop('checked')) {
                if ($('#unassigned').prop('checked')) {
                    $('#unassigned').prop('checked', '');
                    this.$('form').removeAttr('unassigned');
                }
                if ($('#assigned-to-me').prop('checked')) {
                    $('#assigned-to-me').prop('checked', '');
                    this.$('form').removeAttr('assigned-to-me');
                }
            }
            var data = this.$('form').serializeObject();
            data.assignee = this.$('#ticket-assignee').select2('val');
            data.requester = this.$('#ticket-requester').select2('val');
            this.collection.params = data;
            this.collection.fetchPage();
        },
        _searchTicketsUnssigned: function() {
            var data = this.$('form').serializeObject();
            if ($('#unassigned').prop('checked')) {
                if($('#assigned-to-me').prop('checked')){
                    $('#assigned-to-me').prop('checked', '');
                    this.$('form').removeAttr('assigned-to-me');
                    data = this.$('form').serializeObject();
                }
                if($('#create-by-me').prop('checked')){
                    $('#create-by-me').prop('checked', '');
                    this.$('form').removeAttr('create-by-me');
                    data = this.$('form').serializeObject();
                }
                this.$('#ticket-assignee').select2('val', '');

            } else {
                data.assignee = this.$('#ticket-assignee').select2('val');
            }
            data.requester = this.$('#ticket-requester').select2('val');
            this.collection.params = data;
            this.collection.fetchPage();
        },
        // 来源
        _initSelect2Source: function() {
            this.$('#ticket-source').val(this.collection.params.source).select2();
        }
    });

    // 选择客服的逻辑
    var _clickAssigneeDropdown = function(){
        if (this.assigneeLoaded === true) {
            return;
        }
        this.assigneeLoaded = true;
        this.once('beforeRender', function() {
            this.assigneeLoaded = false;
        });
        var that = this;
        var group = this.model.get('group');
        var menu = this.$('.assignee .dropdown-menu');
        // 用于设置选项内容
        var title = this.$('.assignee .dropdown-toggle span');
        // 添加座席到menu里面
        var applyAgents = function(agent) {
            var item = $('<li><a>' + agent.get('name') + '</a></li>').click(function(e) {
                e.preventDefault();
                that.model.assignTo(agent.get('username')).done(function() {
                    $(window).info(gettext('update tickets successful'));
                    title.html(agent.get('name'));
                }).fail(function() {
                    $(window).info(gettext('update tickets failure'));
                });
            });
            menu.append(item);
        };
        // 委派给我的动作
        var assignToMe = $('<li><a>' + gettext('Assign to me') + '</a></li>').click(function(e) {
            e.preventDefault();
            that.model.assignToMe().done(function() {
                title.html(client.profile().get('name'));
                $(window).info(gettext('update tickets successful'));
            }).fail(function(){
                $(window).info(gettext('update tickets failure'));
            });
        });
        var removeAssign = $('<li><a>--</a></li>').click(function(e) {
            e.preventDefault();
            that.model.assignTo('').done(function() {
                title.html('--');
                $(window).info(gettext('update tickets successful'));
            }).fail(function(){
                $(window).info(gettext('update tickets failure'));
            });
        });
        if (group) {
            // 如果有组 筛选组中的座席
            var members = new GroupMemberCollection([], {groupId: group.id});
            members.fetch().done(function() {
                menu.empty()
                    .append(removeAssign)
                    .append(assignToMe);
                members.each(applyAgents);
            });
        } else {
            // 所有座席都可以选择
            agentCollection.fetch().done(function() {
                menu.empty()
                    .append(removeAssign)
                    .append(assignToMe);
                agentCollection.each(applyAgents);
            });
        }
    };
    var TicketsTableItemView = Backbone.View.extend({
        tagName: 'tr',
        template: 'templates:tickets:tickets-list-table-item',
        events: {
            'click .type.dropdown a': '_clickTypeDropdownItem',
            'click .state.dropdown a': '_clickStateDropdownItem',
            'click .priority.dropdown a': '_clickPriorityDropdownItem'
        },
        serialize: function() {
            var ifoverdue = '';
            var ifoverdueI18n = '';
            var date = new Date();
            var now = date.getTime();
            if(this.model.get('expiredDate') !== undefined && this.model.get('expiredDate') !== ''){
                var expiredTime = new Date(this.model.get('expiredDate')).getTime();
                var endTimeToday = new Date(moment().endOf('day')).getTime();
                if (now > expiredTime) {
                //逾期:到期时间小于现在时间
                    ifoverdue = 'overdue';
                    ifoverdueI18n = gettext('Over due');
                } else if (now < expiredTime && expiredTime < endTimeToday){
                //今日到期:到期时间在现在时间到今天24点之间
                    ifoverdue = 'todayexpire';
                    ifoverdueI18n = gettext('Due Today');
                }
            }
            return _.extend(this.model.toJSON(), {
                ticketDomain: domainModel.toJSON()},
                {isoverdue: ifoverdue, isoverdueI18n: ifoverdueI18n}
            );
        },
        _clickTypeDropdownItem: function(e) {
            e.preventDefault();
            var target = $(e.target);
            var val = target.data('value');
            var text = target.text();
            var title = this.$('.type .dropdown-toggle span');

            this.model.changeType(val).done(_.bind(function(){
                title.html(text);
            }, this),function(){
                $(window).info(gettext('update tickets successful'));
            }).fail(function(){
                $(window).info(gettext('update tickets failure'));
            });
        },
        _clickStateDropdownItem: function(e) {
            e.preventDefault();
            var target = $(e.target);
            var val = target.data('value');
            var text = target.text();
            var title = this.$('.state .dropdown-toggle span');
            this.model.changeState(val).done(_.bind(function(){
                title.html(text);
            }, this),function(){
                $(window).info(gettext('update tickets successful'));
            }).fail(function(){
                $(window).info(gettext('update tickets failure'));
            });
        },
        _clickPriorityDropdownItem: function(e) {
            e.preventDefault();
            var target = $(e.target);
            var val = target.data('value');
            var text = target.text();
            var title = this.$('.priority .dropdown-toggle span');

            this.model.changePriority(val).done(_.bind(function(){
                title.html(text);
            }, this),function(){
                $(window).info(gettext('update tickets successful'));
            }).fail(function(){
                $(window).info(gettext('update tickets failure'));
            });
        },
        afterRender: function() {
            this.$('.dropdown-toggle').each(function() {
                $(this).dropdown();
            });
            this.$('#assignee').on('show.bs.dropdown',_.bind(_clickAssigneeDropdown, this));
        }
    });

    var TicketsTableView = Backbone.View.extend({
        template: 'templates:tickets:tickets-list-table',
        events: {
            'click input.picker': '_clickPicker',
            'click .pick_td input': '_clickCheckbox',
            'click button.assign-to-me': '_clickAssignToMe',
            'click button.assign-to': '_clickAssignTo',
            'click button.mark-as-spam': '_clickMarkAsSpam',
            'click button.close-tickets': '_clickCloseTickets',
            'click button.delete-tickets': '_clickDeleteTickets',
            'click .assign-to-model button.assign': '_clickModelAssign',
            'click .assign-to-model button.cancel': '_clickModelCancel'
        },
        initialize: function() {
            this.listenTo(this.collection, 'request', function() {
                this._resetItems();
                this.$('.loading').show();
            });
            this.listenTo(this.collection, 'sync', function() {
                this.$('.loading').hide();
                this._insertItems();
            });
            this.listenTo(this.collection, 'error', function() {
                // TODO 处理异常情况
                this.$('.loading').hide();
                this.$('.non-items').show();
            });
        },
        afterRender: function() {
            this.$('.picker').prop('checked',false);
            this.$('.picker').prop('disabled',false);
            this.$('button.assign-to-me').prop('disabled', true);
            this.$('button.assign-to').prop('disabled', true);
            this.$('button.close-tickets').prop('disabled', true);
            this.$('button.delete-tickets').prop('disabled', true);
        },
        // 重置状态
        _resetItems: function() {
            this.removeView('tbody');
            if (this.pagination === true) {
                this.pagination = false;
                this.$('#pagination').pagination('destroy');
            }
        },
        _insertItems: function() {
            if (this.collection.page && this.collection.page.totalPages < 1) {
                this.$('.non-items').show();
                this.$('.picker').prop('checked',false);
                this.$('.picker').prop('disabled',true);
                return;
            }
            this.$('.non-items').hide();
            var collection = this.collection;
            collection.each(function(model) {
                this.insertView('tbody', new TicketsTableItemView({
                    model: model
                }));
            }, this);
            this.renderViews().promise().done(_.bind(function() {
                var page = collection.page;
                this.pagination = true;
                var query = _.extend({}, collection.params, collection.pageable);
                delete query.page;
                query = $.QueryString.stringify(query);
                var href = '/tickets?' + query + (query ? '&' : '') + 'page={{number}}';
                this.$('.pagination').pagination({
                    startPage: page.number + 1,
                    totalPages: page.totalPages,
                    href: href,
                    onPageClick: function(e, page) {
                        collection.fetchPage(page - 1);
                    }
                });
            }, this));

        },
        // 标记为垃圾
        _clickMarkAsSpam: function(e) {
            e.preventDefault();
            var defs = _.map(this._getCheckedModels(), function(model) {
                return model.markAsSpam();
            }, this);
            $.when.apply($, defs).done(_.bind(function() {
                // TODO i18n
                $(window).info('已成功将选中工单提取');
            }, this)).fail(function() {
                // TODO i18n
                $(window).info('批量操作失败');
            });
        },
        _clickCloseTickets: function(e) {
            e.preventDefault();
            var defs = _.map(this._getCheckedModels(), function(model) {
                return model.close();
            }, this);
            $.when.apply($, defs).done(_.bind(function() {
                // TODO i18n
                $(window).info(gettext('update tickets successful'));
                this.collection.fetchPage();
            }, this)).fail(function() {
                // TODO i18n
                $(window).info(gettext('update tickets failure'));
            });
        },
        _clickDeleteTickets: function(e) {
            e.preventDefault();
            app.vent.trigger('confirm', {
                callback: _.bind(function(view){
                    view.hide();
                    var defs = _.map(this._getCheckedModels(), function(model) {
                        return model.moveToTrash();
                    }, this);
                    $.when.apply($, defs).done(_.bind(function() {
                        $(window).info(gettext('delete successful'));
                        this.collection.fetchPage();
                    }, this)).fail(function() {
                        $(window).info(gettext('delete failure'));
                    });
                }, this),
                text: {
                    title: 'Confirm Delete Selected Tickets',
                    content: 'The Deleted Tieckets will not edit,please look up in deleted list'
                }
            });
        },
        _clickAssignTo: function(e) {
            e.preventDefault();
            // popup
            this.$('.assign-to-model').modal('show');
            this._initSelect2AssginAgents();
        },
        _clickAssignToMe: function(e) {
            e.preventDefault();
            var defs = _.map(this._getCheckedModels(), function(model) {
                return model.assignToMe();
            }, this);
            $.when.apply($, defs).done(_.bind(function() {
                $(window).info(gettext('update tickets successful'));
                this.collection.fetchPage();
            }, this)).fail(function() {
                $(window).info(gettext('update tickets failure'));
            });
        },
        _clickModelAssign: function(e) {
            e.preventDefault();
            // TODO 委派到客服
            var data = this.$('#assginForm').serializeObject();
            data.assignee = this.$('#choose-assignee').select2('val');
            if (data.assignee.length===0) {
                this.$('#agentRequired').addClass('show');
                return;
            }
            this.$('.assign-to-model').modal('hide');
            var defs = _.map(this._getCheckedModels(), function(model) {
                return model.assignTo(data.assignee);
            }, this);
            $.when.apply($, defs).done(_.bind(function() {
                $(window).info(gettext('update tickets successful'));
                this.collection.fetchPage();
            }, this)).fail(function() {
                $(window).info(gettext('update tickets failure'));
            });
            this.$('#choose-assignee').select2('val','');
        },
        _clickModelCancel: function(e) {
            e.preventDefault();
            this.$('.assign-to-model').modal('hide');
        },
        // 获取所有勾选的model
        _getCheckedModels: function() {
            return _.map(this.$('.pick_td input[type=checkbox]:checked'), function(e) {
                return new TicketModel({
                    id: $(e).val()
                });
            }, this);
        },
        _renderBatchBtn: function(){
            var allItems = this.$('.pick_td input');
            var checkedItems = this.$('.pick_td input:checked');
            var picker = this.$('input.picker');
            picker.prop('checked', checkedItems.length === allItems.length);
        },
        // 点击全选按钮
        _clickPicker: function(e) {
            //不要preventDefault
            this.$('.pick_td input').prop('checked', $(e.target).prop('checked'));
            pickTimeout = _.delay( /*before*/ _.bind(_changeButtonState, this) /*end*/ , 200);
        },
        // 改变列表页表头的按钮状态
        _clickCheckbox: function() {
            // pickTimeout用于延时处理，checkbox状态变化浏览器需要一段时间
            pickTimeout = _.delay( /*before*/ _.bind(_changeButtonState, this) /*end*/ , 200);
            this._renderBatchBtn();
        },
        // 指派给客服
        _initSelect2AssginAgents: function() {
            this.$('#agentRequired').removeClass('show');
            this.$('#choose-assignee').select2({
                minimumInputLength: 1,
                maximumSelectionSize:1,
                multiple: true,
                containerCssClass: 'form-control form-control-agent',
                ajax: {
                    url: app.buildUrl('agents'),
                    dataType: 'json',
                    quietMillis: 250,
                    data: function(term) {
                        return {term: term}; // search term
                    },
                    results: function(data) {
                        return {results: data};
                    }
                },
                // 委派座席使用用户名
                id: function(object) {
                    return object.username;
                },
                formatResult: function(object) {
                    var markup = '<div>' + object.name + '</div>';
                    return markup;
                },
                formatSelection: function(object) {
                    return object.name;
                }
            });
        }
    });


    // 最外层的列表页
    var TicketsListView = Backbone.View.extend({
        template: 'templates:tickets:tickets-list',
        navigate: true,
        initialize: function(o) {
            o = o || {};
            var params = o.params || $.QueryString.parse();
            var collection = this.collection = new TicketColletion([], {
                sort: DEFAULT_SORT,
                params: params
            });
            this.listenTo(collection, 'sync', function() {
                if (this.navigate !== true) {
                    return;
                }
                Backbone.history.navigate('/tickets' + (collection.queryString ? '?' + collection.queryString: ''), false);
            });
        },
        beforeRender: function() {
            var ticketsFilterView = new TicketsFilterView({
                collection: this.collection
            });
            var ticketsTableView = new TicketsTableView({
                collection: this.collection
            });

            this.setView('#ticketsFilterForm', ticketsFilterView);
            this.setView('#ticketsTableView', ticketsTableView);

        },
        afterRender: function() {
            this.$('.dropdown-toggle').each(function() {
                $(this).dropdown();
            });
            this._initSortNavigation();
        },
        fetch: function(filter) {
            if (filter) {
                this.navigate = false;
                this.$('.ticket-filter li').removeClass('active');
                this.$('.ticket-filter .' + filter).addClass('active');
                this.$('.ticket-filter .dropdown-toggle .title')
                    .html(this.$('.ticket-filter .dropdown-menu li .title').html());
            }
            this.collection.fetchPage();
        },
        // 获取数据
        _initSortNavigation: function() {
            var selectedOrder = this.$('.ticket-sort .title');
            var nav = this.$('.ticket-sort .dropdown-menu');
            var that = this;
            var clickSort = function(type, callback) {
                var $this = $(this);
                $this.click(function(e) {
                    e.preventDefault();
                    nav.find('li[data-type=' + type + ']').removeClass('active');
                    $this.addClass('active');
                    _.defer(function() {
                        var sort = that._getSort();
                        if (that.collection.pageable.sort !== sort) {
                            that.collection.pageable.sort = sort;
                            that.collection.fetchPage();
                        }
                    });
                    if (callback) {
                        callback.call($this);
                    }
                });
            };
            nav.find('li[data-type=order]').each(function() {
                clickSort.call(this, 'order', function() {
                    selectedOrder.html($(this).find('span').html());
                });
            });
            nav.find('li[data-type=direction]').each(function() {
                clickSort.call(this, 'direction');
            });
        },
        _getSort: function() {
            var sort = _.map(this.$('.ticket-sort li.active a'), function(e) {
                return $(e).data('value');
            });
            return sort.join(',');
        }
    });

    return TicketsListView;
});
