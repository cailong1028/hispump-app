/* global define*/
/**
 * Created by lnye on 2014/12/30.
 */
'use strict';
define([
    'backbone',
    'settings/devdrug-model'
], function(Backbone, DevdrugModel){
    var DevdrugCollection = Backbone.Collection.extend({
        url: 'devdrug/list',
        model: DevdrugModel
    });
    return DevdrugCollection;
});
