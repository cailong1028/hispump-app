/**
 * Created by cailong on 2015/9/10.
 */
/*global define*/
'use strict';
define([
    'backbone'
], function(Backbone){

    /*
    var UserAuthorityModel = Backbone.Model.extend({
        urlRoot: 'authority'
    });
    */

    var ResourceModel = Backbone.Model.extend({
        urlRoot: 'resource'
    });

    var UserAuthorityResourceCollection = Backbone.Collection.extend({
        model: ResourceModel,
        initialize: function(userid){
            this.userid = userid;
        },
        url: function(){
            return 'authority/user/'+this.userid;
        }
    });

    var ResourceCollection = Backbone.Collection.extend({
        model: ResourceModel,
        url: 'resource/list'
    });

    var AgentAuthorityView = Backbone.View.extend({
        template: 'templates:settings:agent-authority',
        initialize: function(options){
            this.userid = options.userid;
            this.userAuthorityResourceCollection = new UserAuthorityResourceCollection(this.userid);
        },
        collection: new ResourceCollection(),
        events: {
            'click .pick-all': '_pickAll',
            'click .pick': '_pick',
            'click .cancel': '_cancel',
            'click .save': '_save'
        },
        serialize: function(){
            var allRes = [], currUserRes = [];
            if(this.collection.length > 0){
                _.each(this.collection.models, function(oneModel){
                    allRes.push(oneModel.toJSON());
                });
            }
            if(this.userAuthorityResourceCollection.length > 0){
                _.each(this.userAuthorityResourceCollection.models, function(oneModel){
                    currUserRes.push(oneModel.get('id'));
                });
            }
            return {
                allRes: allRes,
                currUserRes: currUserRes
            };
        },
        beforeRender: function(){
            var self = this;
            var done = this.async();

            var defs = [];
            var getAllRes = function(){
                var dtd = new $.Deferred();
                self.collection.fetch({}, {reset: true}).done(function(){
                    dtd.resolve();
                }).fail(function(){
                    dtd.reject();
                });
                return dtd.promise();
            };
            var getCurrUserRes = function(){
                var dtd = new $.Deferred();

                self.userAuthorityResourceCollection.fetch({}, {}).done(function(){
                    dtd.resolve();
                }).fail(function(){
                    dtd.reject();
                });
                return dtd.promise();
            };
            defs.push(getAllRes());
            defs.push(getCurrUserRes());
            $.when.apply($, defs).done(function(){
                done();
            }).fail(function(){
                console.error('load server data error! render page fail');
            });
        },
        afterRender: function(){
            this._pick();
        },
        _pickAll: function(){
            var pick_all = this.$('.pick-all-input');
            this.$('.pick-input').prop('checked', pick_all.prop('checked'));
        },
        _pick: function(){
            var pick_all = this.$('.pick-all-input');
            var tds = this.$('.one-resource');
            var picks = this.$('.pick-input:checked');
            pick_all.prop('checked', picks.length === tds.length);
        },
        _cancel: function(){
            window.history.back(-1);
        },
        _save: function(){
            var picks = this.$('.pick-input:checked');
            var resourceids = _.map(picks, function(one){
                return $(one).val();
            });
            var model = new Backbone.Model();
            model.isNew = function(){
                return true;
            };
            model.url = 'authority/user/' + this.userid + '/reset';
            model.save({resourceids: resourceids},{}).done(function(){
                $(window).info(gettext('Success to reset authority'));
                Backbone.history.navigate('/settings/agents', true);
            }).fail(function(){
                $(window).info(gettext('Fail to reset authority'));
            });
        }
    });

    return AgentAuthorityView;
});
