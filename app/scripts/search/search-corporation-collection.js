/*
* @Author: chongzhen
* @Date:   2015-03-04 14:56:45
* @Last Modified by:   chongzhen
* @Last Modified time: 2015-03-07 11:05:17
*/
/**
 * 检索公司的数据
 */
/* global define */
'use strict';
define([
    'underscore',
    'jquery',
    'backbone'
], function(_, $, Backbone) {
    var CorporationsModel = Backbone.Model.extend({});
    var SearchCorporationsCollection = Backbone.Collection.extend({
        url: 'search/corporations',
        model: CorporationsModel
    });
    return SearchCorporationsCollection;
});