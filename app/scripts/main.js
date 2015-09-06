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
    app.vent.on('initialize:before', function() {
        // 理论上来说这玩意时延时加载的...
        // body...
        app.loadModules([
            'profile',
            'statistics'
        ]).done(function() {
            setTimeout(function(){
                Backbone.history.start({ pushState: true });
            });
        });
    });
    // 获取用户信息
    client.fetch().done(function() {
        app.$layout = new LayoutView();
        app.$layout.render();
        // 首先加载语言文件
        console.log('app start');
        app.start();
    });
});
