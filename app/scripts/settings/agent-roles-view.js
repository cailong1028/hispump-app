/* global define, gettext*/
'use strict';
define([
    'underscore',
    'backbone',
    'settings/agent-model',
    'jquery'
], function(_, Backbone, AgentModel, $) {
    var AgentRolesModel = Backbone.Model.extend({
        initialize: function(data, options) {
            this.options = options || {};
        },
        url: function() {
            return 'agents/' + this.options.userId + '/roles';
        },
        isNew: function() {
            return false;
        },
        attributes: [
            'roles'
        ]
    });
    var AgentRolesView = Backbone.View.extend({
        template: 'templates:settings:agent-roles',
        events: {
            'click button.submit': '_submitForm',
            'submit form': '_submitForm',
            'click button.cancel': '_clickCancelButton'
        },
        serialize: function() {
            var data = this.model.toJSON();
            this._user();
            return _.extend(data, {isCurrentManager: this.isCurrentManager});
        },
        _user: function() {
            if (_.contains(this.role, 'Administrator') && this.model.isCurrentManager(this.model)) {
                this.isCurrentManager = true;
            }
            else {
                this.isCurrentManager = false;
            }
        },
        beforeRender: function() {
            if (!this.model) {
                var done = this.async();
                this.model = new AgentModel(this.options);
                this.model.fetch({}, {wait: true}).done(_.bind(function(){
                    var model = new AgentRolesModel({}, {userId: this.model.id});
                    model.fetch({}, {wait: true}).done(_.bind(function(resp){
                        this.role = resp.roles;
                        done();
                    },this));
                },this));
            }
        },
        afterRender: function() {
            for (var i = 0; i < this.role.length; i++) {
                if (this.role[i] === 'Administrator') {
                    this.$('input:checkbox[name="administrator"]').prop('checked', true);
                }
                if (this.role[i] === 'Leader') {
                    this.$('input:checkbox[name="leader"]').prop('checked', true);
                }
            }
        },
        _clickCancelButton: function(e) {
            e.preventDefault();
            window.history.back(-1);
        },
        _submitForm: function(e) {
            e.preventDefault();
            var model = new AgentRolesModel({}, {userId: this.model.id});
            var roles = [];
            this.$('input:checkbox:checked').each(function() {
                roles.push($(this).val());
            });
            model.set('roles', roles);
            model.save({}, {wait: true, dataType: 'text'})
                .done(function() {
                    $(window).info(gettext('Assignment agent successful'));
                    Backbone.history.navigate('settings/agents', true);
                })
                .fail(function() {
                    $(window).info(gettext('Assignment agent failure'));
                });
        }
    });
    return AgentRolesView;
});
