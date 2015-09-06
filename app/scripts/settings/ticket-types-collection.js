/**
 * Created by cailong on 2015/6/18.
 */
/*global define, gettext*/
'use strict';
define([
    'underscore',
    'backbone',
    'settings/ticket-types-model'
], function(_, Backbone, TicketTypesModel){
    var TicketTypesCollection = Backbone.Collection.extend({
        //crossDomain: true,//for test
        model: TicketTypesModel,
        url: function(){
            //return 'http://localhost:3000/api/tickets/ticketfilterdomain';//test url
            return 'tickets/ticketdomain';
        },
        parse: function(resp){
            resp = resp || {};
            if (resp.type && _.isArray(resp.type)) {
                return resp.type.map(function(one){
                    return {name: one};
                });
            }
            return [{name: gettext('Ticket types error, please flush page')}];
        }
    });

    return TicketTypesCollection;
});
