/* global define */
'use strict';
define([
    'statistics/router'
], function(StatisticsRouter) {
    return function() {
        return new StatisticsRouter();
    };
});