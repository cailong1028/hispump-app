/* global define */
'use strict';
define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var AgentReportsModel = Backbone.Model.extend({
        urlRoot: 'statistics/agentreports',
    });
    return AgentReportsModel;
});