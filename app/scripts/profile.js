/* global define */
'use strict';
define([
    'profile/router',
    'templates/profile'
], function(ProfileRouter) {
    return function() {
        return new ProfileRouter();
    };
});