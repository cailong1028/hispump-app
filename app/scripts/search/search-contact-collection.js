/*
* @Author: chongzhen
* @Date:   2015-03-04 14:56:21
* @Last Modified by:   chongzhen
* @Last Modified time: 2015-03-07 11:05:16
*/
/**
 * 检索联系人的数据
 */
/* global define */
'use strict';
define([
    'underscore',
    'jquery',
    'backbone'
], function(_, $, Backbone) {
    var ContactModel = Backbone.Model.extend({});
    var SearchContactsCollection = Backbone.Collection.extend({
        url: 'search/contacts',
        model: ContactModel
    });
    return SearchContactsCollection;
});