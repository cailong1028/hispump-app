/* global define*/
'use strict';
define([
    'underscore.string',
    'backbone'
], function(_s, Backbone) {
    var CorporationsModel = Backbone.Model.extend({
        validate: function(attrs) {
            if (!attrs.name || _s.trim(attrs.name) === '') {
                return 'invalidCorporationName';
            }
        },
        urlRoot: 'corporations'
    });
    return CorporationsModel;
});
