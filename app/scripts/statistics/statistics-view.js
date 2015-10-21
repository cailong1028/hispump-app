/* global define */
'use strict';
define([
    'backbone',
    'moment'
], function(Backbone, moment) {
    var StatisticsView = Backbone.View.extend({
        template: 'templates:statistics:statistics',
        beforeRender: function() {
            var time = moment().subtract(1, 'days').format('YYYY/MM/DD');
        }
    });
    return StatisticsView;
});

