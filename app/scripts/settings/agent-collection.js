/* global define */
'use strict';
define([
    'underscore',
    'jquery',
    'backbone',
    'settings/agent-model'
], function(_, $, Backbone, AgentModel) {
    var AgentCollection = Backbone.Collection.extend({
        url: 'agents',
        model: AgentModel
    });
    return AgentCollection;
});