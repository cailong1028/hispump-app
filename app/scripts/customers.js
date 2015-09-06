/* global define, app*/
'use strict';
define([
    'contacts/router',
    'corporations/router'

], function(ContactsRouter, CorporationsRouter) {
    return function() {
        app.routers.contacts = new ContactsRouter();
        app.routers.corporations = new CorporationsRouter();
    };
});
