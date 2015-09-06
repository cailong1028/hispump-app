/**
 * Created by cailong on 2015/1/20.
 */
/*global define,app*/
'use strict';
define([
    'backbone',
    'agents/ticket-agent-info-view'
], function(Backbone, TicketAgentInfoView){
    var AgentsRouter = Backbone.Router.extend({
        routes: {
            'agents': 'agentInfo',
        },
        agentInfo: function(data) {
            app.$layout.setMainView(new TicketAgentInfoView({username: data})).render();
        }
    });
    return AgentsRouter;
});
