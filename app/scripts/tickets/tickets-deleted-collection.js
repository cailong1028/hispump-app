/*global define*/
'use strict';
define([
    'backbone',
    'tickets/ticket-model'
], function(Backbone, TicketsModel){
    var TicketsDeletedColletion = Backbone.Collection.extend({
        url: 'tickets/trash',
        model: TicketsModel
    });
    return TicketsDeletedColletion;
});
