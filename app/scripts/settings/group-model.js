/* global define*/
'use strict';
define(['backbone'], function(Backbone){
    var GroupModel = Backbone.Model.extend({
        validate: function(attrs){
            if(!attrs.name || !attrs.name.trim()){
                return 'invalidGroupName';
            }
        },
        urlRoot: 'groups'
    });
    return GroupModel;
});

