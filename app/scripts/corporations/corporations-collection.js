/* global define*/
'use strict';
define([
    'backbone',
    'corporations/corporations-model'
], function(Backbone, CorporationsModel) {
    var CorporationsCollection = Backbone.Collection.extend({
        url: 'corporations',
        model: CorporationsModel
    });
    return CorporationsCollection;
});
