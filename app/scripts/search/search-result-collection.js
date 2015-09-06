/*
* @Author: chongzhen
* @Date:   2015-03-04 14:57:08
* @Last Modified by:   chongzhen
* @Last Modified time: 2015-03-08 17:29:11
*/
/**
 * TODO 暂时不明确处理方式 检索全部
 */
/* global define */
'use strict';
define([
    'underscore',
    'jquery',
    'backbone'
], function(_, $, Backbone) {
    var ResultModel = Backbone.Model.extend({});
    var SearchResultCollection = Backbone.Collection.extend({
        url: 'search/all',
        model: ResultModel
    });
    return SearchResultCollection;
});