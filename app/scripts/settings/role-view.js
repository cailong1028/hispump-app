/* global define*/
'use strict';
define([
    'underscore',
    'backbone'
], function(_, Backbone) {

    var RoleListView = Backbone.View.extend({
        template : 'templates:settings:role-list',
        initialize: function(){
        }
    });

    var RoleView = Backbone.View.extend({
        template : 'templates:settings:role',
        initialize: function(){
        },
        afterRender: function(){
            this.setView('.list', new RoleListView()).render();
        }
    });
    return RoleView;
});
