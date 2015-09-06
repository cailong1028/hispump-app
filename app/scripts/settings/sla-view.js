/* global define */
'use strict';
define([
    'underscore',
    'backbone'
], function(_, Backbone){

    var SlaListView = Backbone.View.extend({
        template: 'templates:settings:sla-list',
    });

    var SlaView = Backbone.View.extend({
        template: 'templates:settings:sla',

        afterRender: function() {
            this.slalistview =  new SlaListView();
            this.setView('.list', this.slalistview).render();
        }
    });
    return SlaView;
});