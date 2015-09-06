/**
 * Created by cailong on 2015/1/20.
 */
/*global define,app*/
'use strict';
define([
    'tickets/router'
], function(TicketsRouter){
    return function(){
        app.routers.tickets = new TicketsRouter();
    };
});
