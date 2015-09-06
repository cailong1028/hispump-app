/* global define */
'use strict';
define([
    'underscore',
    'jquery',
    'backbone',
    'statistics/agent-reports-model'
], function(_, $, Backbone, AgentReportsModel) {
    var AgentReportsCollection = Backbone.Collection.extend({
        url: 'statistics/agentreports/',
        model: AgentReportsModel
    });
    return AgentReportsCollection;
});