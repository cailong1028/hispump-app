/*global define, app*/
'use strict';
define([
    'backbone',
    'search/search-view'
], function(Backbone, SearchView) {
    var activedLayoutNavigation = function() {
            app.vent.trigger('navbar:active', 'search');
    };
    var SearchRouter = Backbone.Router.extend({
        routes: {
            'search/all?term=\:term': 'searchAll',
            'search/contact?term=\:term': 'searchContact',
            'search/corporation?term=\:term': 'searchCorporation',
            'search/ticket?term=\:term': 'searchTicket'
        },
        searchAll: function(term) {
            activedLayoutNavigation();
            app.$layout.setMainView(new SearchView({term: term, active: 'all'})).render();
        },
        searchContact: function(term) {
            activedLayoutNavigation();
            app.$layout.setMainView(new SearchView({term: term, active: 'contacts'})).render();
        },
        searchCorporation: function(term){
            activedLayoutNavigation();
            app.$layout.setMainView(new SearchView({term: term, active: 'corporations'})).render();
        },
        searchTicket: function(term){
            activedLayoutNavigation();
            app.$layout.setMainView(new SearchView({term: term, active: 'tickets'})).render();
        }
    });
    return SearchRouter;
});
