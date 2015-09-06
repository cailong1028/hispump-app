/* global define*/
'use strict';
define([
    'search/router'
], function(SearchRouter) {
    return function() {
        return new SearchRouter();
    };
});
