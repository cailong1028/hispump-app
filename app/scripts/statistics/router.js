/* global define, app */
'use strict';
define([
    'backbone',
    'moment',
    'statistics/statistics-view',
    'statistics/agent-reports-view'
], function(Backbone, moment, StatisticsView, AgentReportsView) {
    var activedLayoutNavigation = function() {
        app.vent.trigger('navbar:active', 'statistics');
    };
    var StatisticsRouter = Backbone.Router.extend({
        routes: {
            'statistics': '_statistics',
            'statistics/agentreports': '_agentReportsTime',
            //'statistics/agentreports/\:day': '_agentReportsTime'
        },
        _statistics: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new StatisticsView()).render();
        },
        _agentReportsTime: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new AgentReportsView()).render();
        }
    });
    return StatisticsRouter;
});
