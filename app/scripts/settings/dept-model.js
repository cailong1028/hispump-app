/* global define*/
'use strict';
define([
    'underscore.string',
    'backbone'
], function(_s, Backbone){
    var DeptModel = Backbone.Model.extend({
        urlRoot: 'dept',
        idAttribute: 'dept_code',
        validate: function(attrs){
            if(!attrs.dept_code || _s.trim(attrs.dept_code) === ''){
                return 'invalidDeptCode';
            }
            if(!attrs.dept_name || _s.trim(attrs.dept_name) === ''){
                return 'invalidDeptName';
            }
        }
    });

    return DeptModel;
});

