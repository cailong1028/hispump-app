/* global define */
'use strict';
define([
    'underscore',
    'jquery',
    'backbone',
    'contacts/contact-model'
], function(_, $, Backbone, ContactModel) {
    var ContactCollection = Backbone.Collection.extend({
        url: 'contacts',
        model: ContactModel
    });
    return ContactCollection;
});