/* global define*/
/**
 * Created by lnye on 2014/12/30.
 */
'use strict';
define([
    'backbone',
    'settings/dev-type-model'
], function(Backbone, DevTypeModel){
    var DevTypeCollection = Backbone.Collection.extend({
        url: 'dev-type',
        model: DevTypeModel
    });
    return DevTypeCollection;
});
