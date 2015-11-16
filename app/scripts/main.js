/* global define */
'use strict';
define([
    'backbone',
    'client',
    'app',
    'layout-view'
], function (Backbone, Client, Application, LayoutView) {
    var app = window.app = new Application();
    var client = window.client = new Client();
    // 获取用户信息
    app.vent.on('initialize:before', function() {
        // 理论上来说这玩意时延时加载的...
        // body...
        app.loadModules([
            'agent',
            'customers',
            'agents',
            'settings',
            'tickets',
            'search',
            'profile',
            'statistics'
        ]).done(function() {
            setTimeout(function(){
                Backbone.history.start({ pushState: true });
                var indexOptions = _.extend({}, $('base#options').data());
                if(indexOptions.navigation && indexOptions.navigation !== '' && indexOptions.navigation !== 'null'){
                    Backbone.history.navigate(indexOptions.navigation);
                }
            });
        });
    });
    client.fetch().done(function(profile) {
        app.profile = profile;
        app.$layout = new LayoutView();
        app.$layout.render();
        app.datetimeFormat = 'YYYY-MM-DD HH:mm:ss';
        app.dateFormat = 'YYYY-MM-DD';
        // 首先加载语言文件
        console.log('app start');
        app.start();
    }).fail(function(){
        //go to login
        console.log('111111');
    });
});
