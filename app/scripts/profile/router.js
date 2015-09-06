/* global define, app */
'use strict';
define([
    'backbone',
    'profile/profile-update-view'
], function(Backbone, ProfileUpdateView) {
    var activedLayoutNavigation = function() {
            app.vent.trigger('navbar:active', 'profile');
    };
    var ProfileRouter = Backbone.Router.extend({
        routes: {
            'profile/form': '_profileUpdate'
        },
        _profileUpdate: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new ProfileUpdateView()).render();
        }
    });
    return ProfileRouter;
});
