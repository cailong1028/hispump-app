/* global define */
'use strict';
define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var MailListView = Backbone.View.extend({
        template: 'templates:settings:mail-list',
    });

    var MailView = Backbone.View.extend({
        template: 'templates:settings:mail',
        afterRender: function() {
            this.maillistview = new MailListView();
            this.setView('.list', this.maillistview).render();
        }
    });

    return MailView;
});