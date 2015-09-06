/* global define*/
'use strict';
define([
    'underscore',
    'underscore.string',
    'backbone'
], function(_, _s, Backbone) {
    var TicketAgentModel = Backbone.Model.extend({
        url:  function() {
            return 'agents?username=' + encodeURI(this.get('username'));
        },
        initialize: function(data) {
            if (!data || !!!data.username) {
                 throw 'address is not exist';
            }
        },
        attributes: [
            'id',
            'name',//姓名
            'username',//邮箱
            'avatar',//头像
            'mobile',//手机
            'telephone',//电话
            'password',
            'confirmPassword'
        ]
    });
    return TicketAgentModel;
});
