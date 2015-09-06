/* global define, app */
'use strict';
define([
    'backbone',
    'agent/home-view'
], function (Backbone, HomeView) {
    var IndexRouter = Backbone.Router.extend({
        routes: {
            '': 'home',
            'home\.*': 'home'
        },
        // 座席登录首页
        home: function() {
            app.vent.trigger('navbar:active', 'home');
            app.$layout.setMainView(new HomeView()).render();
        }
    });
    return IndexRouter;
});
