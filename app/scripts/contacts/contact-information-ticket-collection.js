/*
* @Author: chongzhen
* @Date:   2015-03-26 17:33:36
* @Last Modified by:   chongzhen
* @Last Modified time: 2015-03-28 13:43:51
*/

/* global define */
'use strict';
define([
    'underscore',
    'jquery',
    'backbone'
], function(_, $, Backbone) {
    var InformationTicketsModel = Backbone.Model.extend({
        parse: function(response) {
            //此处可增加自定义的属性
            //response.test = '8 days ago';
            return response;
        }
    });
    var InformationTicketsCollection = Backbone.Collection.extend({
        url: 'tickets/filter',
        model: InformationTicketsModel
    });
    return InformationTicketsCollection;
});