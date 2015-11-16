/* global define, app */
'use strict';
define([
    'backbone',
    'moment',
    'statistics/statistics-view',
    'statistics/drug-supplement-detail-view',
    'statistics/drug-period-expire-view',
    'statistics/drug-stock-amount-view',
    'statistics/drug-retention-view',
    'statistics/append-sheet-view'
], function(Backbone, moment, StatisticsView, DrugSupplementDetailView, DrugPeriodExpireView,
            DrugStockAmountView, DrugRetentionView, AppendSheetView) {
    var activedLayoutNavigation = function() {
        app.vent.trigger('navbar:active', 'statistics');
    };
    var StatisticsRouter = Backbone.Router.extend({
        routes: {
            'statistics': '_statistics',
            'statistics/drug-supplement-detail': '_drugSupplementDetail',
            'statistics/drug-period-expire': '_drugPeriodExpire',
            'statistics/drug-stock-amount': '_drugStockAmount',
            'statistics/drug-retention': '_drugRetention',
            'statistics/append-sheet': '_appendSheet'
        },
        _statistics: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new StatisticsView()).render();
        },
        _drugSupplementDetail: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new DrugSupplementDetailView()).render();
        },
        _drugPeriodExpire: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new DrugPeriodExpireView()).render();
        },
        _drugStockAmount: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new DrugStockAmountView()).render();
        },
        _drugRetention: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new DrugRetentionView()).render();
        },
        _appendSheet: function(){
            activedLayoutNavigation();
            app.$layout.setMainView(new AppendSheetView()).render();
        }
    });
    return StatisticsRouter;
});
