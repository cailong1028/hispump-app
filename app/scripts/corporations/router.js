/* global define, app */
'use strict';
define([
    'backbone',
    'corporations/corporations-view',
    'corporations/corporations-add-view',
    'corporations/corporations-info-view',
    'corporations/corporations-update-view',
    'corporations/corporations-contacts'
], function(Backbone, CorporationsView, CorporationsAddView, CorporationsInfoView, CorporationsUpdateView, CorporationsContactsView) {
    var activedLayoutNavigation = function() {
        app.vent.trigger('navbar:active', 'customers');
    };
    var CorporationsRouter = Backbone.Router.extend({
        routes: {
            'corporations': '_corporations',
            'corporations/form': '_corporationsAdd',
            'corporations/\:id': '_corporationsInfo',
            'corporations/\:id/form': '_corporationsUpdate',
            'corporations/\:id/contacts': '_corporationsContacts'
        },
        _corporations: function() {
            //公司首页功能
            activedLayoutNavigation();
            app.$layout.setMainView(new CorporationsView()).render();
        },
        _corporationsAdd: function() {
            //添加公司页面
            activedLayoutNavigation();
            app.$layout.setMainView(new CorporationsAddView()).render();
        },
        _corporationsInfo: function(id) {
            //公司详细页面
            activedLayoutNavigation();
            app.$layout.setMainView(new CorporationsInfoView({id: id})).render();
        },
        _corporationsUpdate: function(id) {
            //公司更新页面
            activedLayoutNavigation();
            app.$layout.setMainView(new CorporationsUpdateView({id: id})).render();
        },
        _corporationsContacts: function(id) {
            //公司下联系人列表
            activedLayoutNavigation();
            app.$layout.setMainView(new CorporationsContactsView({
                params: {
                    corporationId: id
                }
            })).render();
        }

    });
    return CorporationsRouter;
});
