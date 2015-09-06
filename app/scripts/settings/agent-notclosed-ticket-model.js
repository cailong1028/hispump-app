/* global define*/
'use strict';
define(['backbone'], function(Backbone){
    var NotClosedTickets = Backbone.Model.extend({
        urlRoot: 'tickets/notclosednum'
    });
    return NotClosedTickets;
});