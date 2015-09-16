/* global define, gettext*/
'use strict';
define([
    'underscore',
    'underscore.string',
    'backbone',
    'settings/agent-model'
], function(_, _s, Backbone, AgentModel) {
    var AgentUpdateView = Backbone.View.extend({
        template: 'templates:settings:agent-update',
        events: {
            'click button.submit': '_submitForm',
            'submit form': '_submitForm',
            'reset form': '_resetForm',
            'click button.cancel': '_clickCancelButton'
        },
        serialize: function(){
            return this.model.toJSON();
        },
        beforeRender: function() {
            if (!this.model) {
                var done = this.async();
                this.model = new AgentModel(this.options);
                this.model.fetch({}, {wait: true}).done(function(){
                    done();
                });
            }
        },
        _resetForm: function() {
            this.$('.error-messages').removeClass('show');
        },
        _clickCancelButton: function(e) {
            e.preventDefault();
            // history回退
            window.history.back(-1);
        },
        _submitForm: function(e) {
            e.preventDefault();
            var serObj = _.extend({username: '', worknum: '', mobile: '', memo: ''}, this.$('form').serializeObject());
            var data = _.omit(serObj, this.model.idAttribute);
            var model = new AgentModel({id: this.model.id});
            model.set(data);
           /* _.each(model.pick('username', 'worknum', 'mobile', 'memo'),
                function(value, key) {
                    if (_s.trim(value) === '') {
                        model.unset(key);
                    }
                    else {
                        var v = _s.trim(value);
                        model.set(key, v);
                    }
                });*/
            this.$('.error-messages').removeClass('show');
            if (!model.has('username') || _s.trim(model.get('username')) === '') {
                this.$('#name_required').addClass('show');
                return;
            }
            // wait true 等待服务器端返回内容，原文大概是这样写的
            // Pass {wait: true} if you'd like to wait for the server before setting the new attributes on the model.
            model.save({}, {wait: true, validate: false})
                .done(function() {
                    // Backbone.history.navigate(url, true) 等同于 Backbone.history.navigate(url, {trigger:trur})
                    $(window).info(gettext('Update agent successful'));
                    Backbone.history.navigate('/settings/agents', true);
                })
                .fail(_.bind(function(resp){
                    var data = resp.responseJSON;
                    if (data.type === 'WorkNumAlreadyExists') {
                        this.$('#alreadyExists_workNum').addClass('show');
                    }
                    else {
                        $(window).info(gettext('Update agent failure'));
                    }
                },this));
        }
    });
    return AgentUpdateView;
});
