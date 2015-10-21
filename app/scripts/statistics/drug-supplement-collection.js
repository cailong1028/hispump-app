/* global define */
'use strict';
define([
    'underscore',
    'jquery',
    'backbone',
    'statistics/drug-supplement-model'
], function(_, $, Backbone, DrugSupplementModel) {
    var DrugSupplementCollection = Backbone.Collection.extend({
        url: 'statistics/drug-supplement-detail',
        model: DrugSupplementModel
    });
    return DrugSupplementCollection;
});
