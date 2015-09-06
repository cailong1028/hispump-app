/* global define */
'use strict';
define([
    'backbone'
], function(Backbone) {
    var SearchContactsCollection = Backbone.Collection.extend({
        //url: 'api/elasticsearch/contacts'
        url: 'api/customers'
    });
    var SearchContactsView = Backbone.View.extend({
        template: 'templates:search:search',
        collection: new SearchContactsCollection(),
        serialize: function() {
            return {content: this.collection.toJSON()};
        },
        beforeRender: function() {
            var done = this.async();
            this.collection.fetch().done(function() {
                done();
            });
        }
    });
    return SearchContactsView;
});