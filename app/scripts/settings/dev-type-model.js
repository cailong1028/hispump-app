/* global define*/
'use strict';
define(['backbone'], function(Backbone){
    var DevTypeModel = Backbone.Model.extend({
        url: function(){
            return 'dev-type';
        }
    });

    return DevTypeModel;
});

