/* global define */
'use strict';
define([
    'underscore',
    'jquery',
    'backbone',
    'settings/agent-model'
], function(_, $, Backbone, AgentModel) {
    var AgentCollection = Backbone.Collection.extend({
        url: 'user/list',
        model: AgentModel
    });
    return AgentCollection;
});
