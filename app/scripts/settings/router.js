/* global define, app */
'use strict';
define([
    'backbone',
    'settings/settings-view',
    'settings/general-view',
    'settings/group-view',
    'settings/group-add-view',
    'settings/group-update-view',
    'settings/agents-view',
    'settings/agents-deleted-view',
    'settings/agent-add-view',
    'settings/agent-update-view',
    'settings/agent-info-view',
    'settings/agent-resetpassword-view',
    'settings/agent-invitation-view',
    'settings/agent-roles-view',
    'settings/role-view',
    'settings/role-info-view',
    'settings/ticket-types-view',
    'settings/mail-view',
    'settings/sla-view',
    'settings/agent-authority-view'
], function(Backbone, SettingsView, GeneralView,
        GroupView, GroupAddView, GroupUpdateView,
        AgentView, AgentsDeletedView, AgentAddView,AgentUpdateView,
        AgentInfoView, AgentResetpasswordView, AgentInvitationView, AgentRoleView,
        RoleView, RoleInfoView, TicketTypesView, MailView, SlaView, AgentAuthority) {
    var activedLayoutNavigation = function() {
        app.vent.trigger('navbar:active', 'settings');
    };
    var SettingsRouter = Backbone.Router.extend({
        routes: {
            'settings': '_settings',
            'settings/general': '_general',
            'settings/group': '_group',
            'settings/group/form': '_groupAdd',
            'settings/group/\:id/form': '_groupUpdate',
            'settings/agents': '_agents',
            'settings/agents/form': '_agentAdd',
            'settings/agents/trash': '_agentsTrash',
            'settings/agents/invitation': '_invitation',
            'settings/agents/\:id/roles': '_agentRole',
            'settings/agents/\:id/authority': '_agentAuthority',
            'settings/agents/\:id/form': '_agentUpdate',
            'settings/agents/\:id': '_agentInfo',
            'settings/agents/\:id/resetpassword': '_resetpassword',
            'settings/roles': '_roles',
            'settings/roles/\:id': '_rolesInfo',
            'settings/ticket-types': '_ticketTypes',
            'settings/mail': '_mail',
            'settings/sla': '_slaview'
        },
        _settings: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new SettingsView()).render();
        },
        _general: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new GeneralView()).render();
        },
        _group: function() {
            // TODO 配置管理组首页功能
            activedLayoutNavigation();
            app.$layout.setMainView(new GroupView()).render();
        },
        _groupAdd: function(){
            //添加组页面
            activedLayoutNavigation();
            app.$layout.setMainView(new GroupAddView()).render();
        },
        _groupUpdate: function(id){
            //组更新页面
            activedLayoutNavigation();
            app.$layout.setMainView(new GroupUpdateView({id: id})).render();
        },
        _agents: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new AgentView()).render();
        },
        _agentAdd: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new AgentAddView()).render();
        },
        _agentUpdate: function(id) {
            activedLayoutNavigation();
            app.$layout.setMainView(new AgentUpdateView({id: id})).render();
        },
        _agentInfo: function(id) {
            activedLayoutNavigation();
            app.$layout.setMainView(new AgentInfoView({id: id})).render();
        },
        _agentRole: function(id){
            activedLayoutNavigation();
            app.$layout.setMainView(new AgentRoleView({id: id})).render();
        },
        _resetpassword: function(id) {
            activedLayoutNavigation();
            app.$layout.setMainView(new AgentResetpasswordView({id:id})).render();
        },
        _invitation: function(){
            activedLayoutNavigation();
            app.$layout.setMainView(new AgentInvitationView()).render();
        },
        _roles: function(){
            activedLayoutNavigation();
            app.$layout.setMainView(new RoleView()).render();
        },
        _rolesInfo: function(id){
            activedLayoutNavigation();
            app.$layout.setMainView(new RoleInfoView({id:id})).render();
        },
        _agentsTrash: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new AgentsDeletedView()).render();
        },
        _ticketTypes: function(){
            activedLayoutNavigation();
            app.$layout.setMainView(new TicketTypesView()).render();
        },
        _mail: function(){
            activedLayoutNavigation();
            app.$layout.setMainView(new MailView()).render();
        },
        _slaview: function(){
            activedLayoutNavigation();
            app.$layout.setMainView(new SlaView()).render();
        },
        _agentAuthority: function(id){
            activedLayoutNavigation();
            app.$layout.setMainView(new AgentAuthority({userid: id})).render();
        }
    });
    return SettingsRouter;
});
