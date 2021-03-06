/* global define, app */
define([
    'jquery',
    'underscore.string',
    'backbone',
    'layoutmanager'
], function($, _s, Backbone) {
    'use strict';
    var mainId = '#main';
    var NAV_MODULES_SELECTOR = '#prog-mods';
    var GeneralModel = Backbone.Model.extend({
        url: 'sites',
        attributes: [
            'title',
            'description',
            'logo',
            'timezone'
        ],
        isNew: function() {
            return false;
        }
    });

    // var clickNavModuleAnchor = function(e) {
    //     this.$(NAV_MODULES_SELECTOR + ' li.active').removeClass('active');
    //     $(e.target).parent('li').addClass('active');
    // };
    var LayoutView = Backbone.Layout.extend({
        el: '#body_wrap',
        template: 'templates:main:layout',
        model : new GeneralModel(),
        events: {
            'click button.search': 'searchForm',
            '.search submit form': 'searchForm'
        },
        initialize: function() {
            this.listenTo(app.vent, 'navbar:active', function(mod) {
                if (this.actived !== mod) {
                    this.actived = mod;
                    this.$(NAV_MODULES_SELECTOR + ' li.active').removeClass('active');
                    this.$(NAV_MODULES_SELECTOR + ' li.' + mod).addClass('active');
                }
            });
        },

        searchForm: function(e){
            //取消默认事件
            e.preventDefault();
            var data = this.$('form').serializeObject();
            if($.isEmptyObject(data) || _s.trim(data.term) === ''){
                return Backbone.history.navigate('/settings/dev', true);
            }
            Backbone.history.navigate('/settings/dev?term=' + _s.trim(data.term), true);
            //Backbone.history.navigate('/search/all?term=' + data.term, true);
        },
        serialize: function() {
            return _.extend(this.model.toJSON(), {authority: app.profile.resourceAuthority});
        },
        beforeRender: function() {
            var done = this.async();
            this.model.fetch().done(function() {
                done();
            });
        },
        afterRender: function() {
            this.$(NAV_MODULES_SELECTOR + ' li.' + this.actived).addClass('active');
            this.$('.dropdown-toggle').dropdown();
        },
        /**
        * replace view with name
        * if view already exists, call view.remove function and set it.
        */
        setMainView: function(view) {
            var originView = this.getView(mainId);
            if (originView) {
                if(originView.beforeRemove && _.isFunction(originView.beforeRemove)){
                    originView.beforeRemove();
                }
                originView.remove();
            }
            return this.setView(mainId, view);
        },
        getMainView: function() {
            return this.getView(mainId);
        }
    });
    return LayoutView;
});
