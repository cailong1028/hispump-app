/**
 * Created by cailong on 2015/1/30.
 */
/*global define*/
'use strict';
define([
    'underscore',
    'backbone',
    'tickets/tickets-history-model'
], function(_, Backbone, TicketsHistoryModel){
    var TicketsHistoryCollection = Backbone.Collection.extend({
        url: 'status',
        model: TicketsHistoryModel,
        //获取工单时间线 第一页 GET /api/tickets/{ticketId}/statuses
        getStatuses: function(ticketId, page, size, showActivity){
            this.url = function(){
                return 'tickets/'+ticketId+'/statuses';
            };
            var opts = {
                size: size
            };
            if (showActivity){
                 _.extend(opts, {'show-activite':  'show-activite'});
            }
            return this.fetch({data: opts}, {reset: true});
        },
        //s获取工单时间线 第二页 GET /api/tickets/{ticketId}/statuses?page=1&timestamp={date as yyyy-MM-dd'T'HH:mm:ssZ}推荐把第一页的第一个创建事件作为timestamp的值
        getNextStatuses: function(ticketId, page, size, prevCreatetime, showActivity){
            this.url = function(){
                return 'tickets/'+ticketId+'/statuses';
            };
            var opts = {
                size: size
            };
            if(prevCreatetime){
                _.extend(opts, {timestamp:  prevCreatetime});
            }
            if (showActivity){
                 _.extend(opts, {'show-activite':  'show-activite'});
            }
            return this.fetch({data: opts}, {reset: true});
        }
    });

    return TicketsHistoryCollection;
});
