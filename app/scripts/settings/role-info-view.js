/* global define*/
'use strict';
define([
    'underscore',
    'backbone'
], function(_, Backbone) {

    var RoleAdministratorView = Backbone.View.extend({
        template : 'templates:settings:role-administrator-info',
        initialize: function(){
        }
    });
    var RoleAgentView = Backbone.View.extend({
        template : 'templates:settings:role-agent-info',
        initialize: function(){
        }
    });
    var RoleMonitorView = Backbone.View.extend({
        template : 'templates:settings:role-leader-info',
        initialize: function(){
        }
    });
    var RoleInfoView = Backbone.View.extend({
        template : 'templates:settings:role-info',
        initialize: function(){

        },
        afterRender: function(){
            if(this.options.id === 'administrator'){
                this.setView('.role-info-page', new RoleAdministratorView()).render();
            }else if(this.options.id === 'agent'){
                this.setView('.role-info-page', new RoleAgentView()).render();
            }else if(this.options.id === 'monitor'){
                this.setView('.role-info-page', new RoleMonitorView()).render();
            }
        },
    });
    return RoleInfoView;
});
