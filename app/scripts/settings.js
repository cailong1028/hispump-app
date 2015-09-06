/* global define */
'use strict';
define([
    'settings/router'
], function(SettingsRouter) {
    return function() {
        return new SettingsRouter();
    };
});