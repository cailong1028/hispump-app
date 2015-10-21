/* global define */
'use strict';
define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var DrugSupplementModel = Backbone.Model.extend({
        urlRoot: 'statistics/drug-supplement-detail'
    });
    return DrugSupplementModel;
});
