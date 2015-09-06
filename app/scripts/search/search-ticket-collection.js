/*
* @Author: chongzhen
* @Date:   2015-03-04 14:56:57
* @Last Modified by:   chongzhen
* @Last Modified time: 2015-03-07 13:53:37
*/
/**
 * 检索工单的数据
 */
/* global define */
'use strict';
define([
    'underscore',
    'jquery',
    'backbone'
], function(_, $, Backbone) {
    var TicketModel = Backbone.Model.extend({});
    var SearchTicketsCollection = Backbone.Collection.extend({
        url: 'search/tickets',
        model: TicketModel
    });
    return SearchTicketsCollection;
});