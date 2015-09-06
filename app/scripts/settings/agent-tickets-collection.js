/*global define*/
'use strict';
define([
    'backbone'
], function(Backbone){
	var TicketModel = Backbone.Model.extend({});
    var AgentTicketsCollection = Backbone.Collection.extend({
        model: TicketModel,
        url: 'tickets/filter'
    });
    return AgentTicketsCollection;
});
