/**
 * Created by cailong on 2015/1/20.
 */
/*global define,app*/
'use strict';
define([
    'backbone',
    'tickets/tickets-list-view',
    'tickets/tickets-add-view',
    'tickets/tickets-view',
    'tickets/tickets-update-view',
    'tickets/tickets-deleted-list-view',
], function(Backbone, TicketsListView, TicketsAddView, TicketsView, TicketsUpdateView, TicketsDeletedListView){
    var activedLayoutNavigation = function() {
        app.vent.trigger('navbar:active', 'tickets');
    };
    var TicketsRouter = Backbone.Router.extend({
        routes: {
            'tickets': '_tickets',
            'tickets/filters/my-tickets': '_myTickets',
            'tickets/form': '_ticketsAdd',
            'tickets/trash': '_ticketsTrash',
            'tickets/\:id/form': '_ticketsUpdate',
            'tickets/\:id': '_ticket'
        },
        _tickets: function() {
            activedLayoutNavigation();
            var view = new TicketsListView();
            app.$layout.setMainView(view).render().promise().done(function() {
                view.fetch();
            });
        },
        _myTickets: function() {
            activedLayoutNavigation();
            var view = new TicketsListView({
                params: {'assigned-to-me': '','state': 'Opened'}
            });
            app.$layout.setMainView(view).render().promise().done(function() {
                view.fetch('my-tickets');
            });
        },
        _ticketsAdd: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new TicketsAddView()).render();
        },
        _ticketsUpdate: function(id) {
            activedLayoutNavigation();
            app.$layout.setMainView(new TicketsUpdateView({id: id})).render();
        },
        _ticket: function(id) {
            activedLayoutNavigation();
            app.$layout.setMainView(new TicketsView({id: id})).render();
        },
        _ticketsTrash: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new TicketsDeletedListView()).render();
        }
    });
    return TicketsRouter;
});
