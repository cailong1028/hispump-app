/* global define */
'use strict';
define([
    'agents/router'
], function(AgentsRouter) {
    return function() {
        return new AgentsRouter();
    };
});