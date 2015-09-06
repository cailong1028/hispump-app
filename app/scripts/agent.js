/* global define */
'use strict';
define([
    'agent/router',
    'templates/agent'
], function(IndexRouter) {
    return function() {
        return new IndexRouter();
    };
});