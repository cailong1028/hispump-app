/* global define */
'use strict';
define([
    'backbone'
], function(Backbone) {
    var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
    var GeneralSettingsModel = Backbone.Model.extend({
        url: 'general',
        attributes: [
            'title',
            'description',
            'logo',
            'href',
            'timezone'
        ],
        isNew: function() {
            return false;
        },
        validate: function() {
            var title = this.get('title');
            if (!title) {
                return 'title_required_error';
            }
            if (title.trim() === '') {
                return 'title_required_error';
            }
            var href = this.get('href');
            if (href && !urlPattern.test(href)) {
                return 'href_pattern_error';
            }
        }
    });
    return GeneralSettingsModel;
});