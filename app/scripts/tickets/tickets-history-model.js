/**
 * Created by cailong on 2015/1/30.
 */
/*global define, gettext*/
'use strict';
define([
    'underscore',
    'backbone',
    'jquery'
], function(_, Backbone, $){
    var TicketsHistoryModel = Backbone.Model.extend({
        urlRoot: 'tickets/statuses',
        update: function(changedAttrs, callback){
            var self = this;
            var model = new TicketsHistoryModel({id: this.id});
            var form = {description: this.description, visibility: 'AgentOnly'};
            $.extend(form, changedAttrs);
            model.set(form);
            model.save({}, {wait: true, validate: false}).done(_.bind(function(){
                self = model;
                $(window).info(gettext('update memo successfull'));
                callback(self);
            }, this)).fail(function(){
                $(window).info(gettext('update memo failure'));
            });
        },
        addMemo: function(data, ticketId){
            var ticketsHistoryModel = new TicketsHistoryModel();
            ticketsHistoryModel.url = function(){
                return  'tickets/' + ticketId +'/statuses';
            };
            ticketsHistoryModel.set(data);
            return ticketsHistoryModel.save({}, {wait: true, validate: false});
        }
    });
    return TicketsHistoryModel;
});
