/* global define*/
'use strict';
define([
    'underscore.string',
    'backbone'
], function(_s, Backbone){
    var DeptModel = Backbone.Model.extend({
        urlRoot: 'dept',
        validate: function(attrs){
            if(!attrs.name || _s.trim(attrs.name) === ''){
                return 'invalidDeptName';
            }
        }
    });

    return DeptModel;
});

