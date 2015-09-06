/* global define */
'use strict';
define([
    'backbone'
], function(Backbone) {
    var SettingsView = Backbone.View.extend({
        template: 'templates:settings:index'
    });
    return SettingsView;
});