/* global define */
'use strict';
define([
    'backbone',
    'moment',
    'statistics/agent-reports-model'
], function(Backbone,moment,AgentReportsModel) {
    var StatisticsView = Backbone.View.extend({
        template: 'templates:statistics:statistics',
        beforeRender: function() {
            this.model = new AgentReportsModel();
            var time = moment().subtract(1, 'days').format('YYYY/MM/DD');
            this.model.set('day',time);
        }
    });
    return StatisticsView;
});

