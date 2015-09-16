/* global define*/
'use strict';
define([
    'underscore.string',
    'backbone'
], function(_s, Backbone){
    var DevModel = Backbone.Model.extend({
        urlRoot: 'dev',
        validate: function(attrs){
            if(!app.validateMAC(attrs.id)){
                return 'invalidMAC';
            }
            if(!attrs.name || _s.trim(attrs.name) === ''){
                return 'invalidDevName';
            }
            if(!attrs.type || attrs.type === 0 || attrs.type === '0'){
                return 'Dev_type_required';
            }
        }
    });

    return DevModel;
});

