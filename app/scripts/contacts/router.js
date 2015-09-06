/* global define, app */
'use strict';
define([
    'backbone',
    'contacts/contacts-view',
    'contacts/contacts-blocked-view',
    'contacts/add-contacts-view',
    'contacts/contacts-information-view',
    'contacts/update-contacts-view',
], function(Backbone, ContactsView, ContactsBlockedView, ContactsFormView, ContactInformationView, UpdateContactView) {
    var activedLayoutNavigation = function() {
        app.vent.trigger('navbar:active', 'customers');
    };
    var ContactsRouter = Backbone.Router.extend({
        routes: {
            'contacts': 'contacts',
            'contacts/blocked': 'blockedContacts',
            'contacts/form': 'contactsForm',
            'contacts/\:id': 'contactsInformation',
            'contacts/\:id/form': 'updateContactsInformation'

        },
        contacts: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new ContactsView()).render();
        },
        blockedContacts: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new ContactsBlockedView()).render();
        },
        contactsForm: function() {
            activedLayoutNavigation();
            app.$layout.setMainView(new ContactsFormView()).render();
        },
        contactsInformation: function(id) {
            activedLayoutNavigation();
            app.$layout.setMainView(new ContactInformationView({id: id})).render();
        },
        updateContactsInformation: function(id) {
            activedLayoutNavigation();
            app.$layout.setMainView(new UpdateContactView({id: id})).render();  
        }
    });
    return ContactsRouter;
});
