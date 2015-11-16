/* global define*/
'use strict';
define([
    'underscore.string',
    'backbone'
], function(_s, Backbone){
    var DevModel = Backbone.Model.extend({
        urlRoot: 'devdrug',
        validate: function(attrs){
            /*if(!attrs.deptid){
                return 'requesterNameInvalid';
            }*/
            if(!attrs.cartid){
                return 'cartidInvalid';
            }
            if(!attrs.drugid){
                return 'DrugInvalid';
            }
            if(!attrs.drugwarning){
                return 'drugwarningInvalid';
            }
            if(!attrs.drugoverflow){
                return 'drugoverflowInvalid';
            }
        }
    });

    return DevModel;
});

