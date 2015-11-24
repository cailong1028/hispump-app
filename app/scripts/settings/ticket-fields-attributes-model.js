/**
 * Created by cailong on 2015/7/24.
 */
/*global define*/
'use strict';
define([
    'backbone'
], function(Backbone){
    var TicketFieldsAttributesModel = Backbone.Model.extend({
        defaults: {
            owner: this,
            type: 'text',
            actions: {
                agent: {
                    neededWhenSubmitTicket: false,
                    neededWhenCloseTicket: false
                },
                customer: {
                    couldSeeByCustomer: true,
                    couldEditByCustomer: true,
                    neededWhenSubmitTicket: false
                }
            },
            title: {
                agent: '',
                customer: ''
            }/*,
            options: [
                {key: '', value: ''}
            ]*/
        }
    });

    return TicketFieldsAttributesModel;
});
