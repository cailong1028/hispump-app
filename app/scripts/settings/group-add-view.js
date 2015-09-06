 /* global define, app, gettext */
'use strict';
define([
    'underscore',
    'backbone',
    'settings/group-model',
    'settings/group-prompt-view'
], function(_, Backbone, GroupModel, PromptView){
    var GroupAddView = Backbone.View.extend({
        //urlRoot: 'corporations',
        template: 'templates:settings:group-add',
        events: {
            'submit form': '_submitForm',
            'click .update_cancel': '_cancel'
        },
        afterRender: function(){
            this.insertView('.promptView', new PromptView());
            this._initAgent.call(this.$('#agentEmails'), app.buildUrl('agents'), 100, 10);
            this._initAgentSelect.call(this.$('#timeoutMailTo'), app.buildUrl('agents'), 100, 10);
        },
        _submitForm: function(e){
            e.preventDefault();
            this.$('.error-messages').removeClass('show');
            var model = new GroupModel(this.$('form').serializeObject());
            if (!model.isValid()) {
                this.$('#' + model.validationError).addClass('show');
                return;
            }
            model.save({}, {wait: true})
                .done(function(){
                    //TODO 国际化
                    $(window).info(gettext('Add group successful'));
                    Backbone.history.navigate('settings/group', true);
                })
                .fail(_.bind(function(resp) {
                    $(window).info(gettext('Add group failure'));
                    var data = resp.responseJSON;
                    this.$('#' + data.errorCode).addClass('show');
                }, this));
        },
        _cancel: function(e){
            e.preventDefault();
            e.stopPropagation();
            window.history.back();
        },
        _initAgent: function (url, delay, number, minimumInputLength, multiple) {//初始化组
            //var initNumber = 10;
            this.select2({
                //maximumSelectionSize: number || initNumber,
                minimumInputLength: minimumInputLength || 1,
                dropdownCssClass: 'bigdrop',
                multiple: multiple || true,
                cache: true,
                ajax: {
                    url: url,
                    dataType: 'json',
                    delay: delay || 100,
                    cache: true,
                    data: function (params) {
                        return {
                            term: params
                        };
                    },
                    results: function (res) {
                        console.log(res);
                        var arr = [];
                        res.forEach(function(one){
                            //arr.push({id: one.email, name: one.email, text: one.email});
                            arr.push({id: one.username, name: one.username, text: one.username});
                        });
                        return {results: arr};
                    }
                },
                formatResult: function (repo) {
                    console.log(repo);
                    return repo.name;
                },
                formatSelection: function (repo) {
                    console.log(repo);
                    return repo.name;
                }
            });
        },
        _initAgentSelect: function (url, delay) {//初始化组
            this.select2({
                multiple: false,
                cache: true,
                ajax: {
                    url: url,
                    dataType: 'json',
                    delay: delay || 100,
                    cache: true,
                    data: function (params) {
                        return {
                            term: params
                        };
                    },
                    results: function (res) {
                        var arr = [];
                        res.forEach(function(one){
                            //arr.push({id: one.email, name: one.email, text: one.email});
                            arr.push({id: one.username, name: one.username, text: one.username});
                        });
                        return {results: arr};
                    }
                },
                formatResult: function (repo) {
                    console.log(repo);
                    return repo.name;
                },
                formatSelection: function (repo) {
                    console.log(repo);
                    return repo.name;
                }
            });
        }
    });
    return GroupAddView;
});
