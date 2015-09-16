/* global define*/
/**
 * Created by lnye on 2014/12/30.
 */
'use strict';
define([
    'backbone',
    'settings/dev-model'
], function(Backbone, DevModel){
    var DevCollection = Backbone.Collection.extend({
        url: 'dev/list',
        model: DevModel
    });
    return DevCollection;
});
