/**
 * Created by cailong on 2015/1/21.
 */
/*global define*/
'use strict';
define([
    'backbone',
    'tickets/ticket-model'
], function(Backbone, TicketModel){
    var TicketsColletion = Backbone.Collection.extend({
        url: 'tickets/filter',
        model: TicketModel
    });
    return TicketsColletion;
});
