/* global define, app, gettext */
/**
 * Created by lnye on 2014/12/31.
 */
'use strict';
define([
    'underscore',
    'backbone',
    'settings/group-model'
], function(_, Backbone, GroupModel){
    var GroupUpdateView = Backbone.View.extend({
        template: 'templates:settings:group-update',
        beforeRender: function(){
            if(!this.model){
                var done = this.async();
                this.model = new GroupModel(this.options);
                this.model.fetch({}, {wait: true}).done(function(){
                    done();
                });
            }
        },
        afterRender: function(){
            var m = this.model;
            var that = this;
            this._initAgent.call(that.$('#agentEmails'), app.buildUrl('agents'), 100, 10);
            this._initSelect2Single.call(that.$('#timeoutMailTo'), app.buildUrl('agents'), 100, 10, 0, false, {
                initSelection : function () {
                    if (m.attributes.timeoutMailTo) {
                        that.$('#timeoutMailTo').prev().find('a.select2-choice span.select2-chosen').text(m.attributes.timeoutMailTo);
                        that.$('#timeoutMailTo').val(m.attributes.timeoutMailTo);
                    }
                }
            });
            if (this.model.attributes.agentList) {
                var arr = [];
                this.model.attributes.agentList.forEach(function(one){
                    //arr.push({id: one.email, name: one.email, text: one.email});
                    arr.push({id: one, name: one, text: one});
                });
                that.$('#agentEmails').select2('data',arr);
            }
            that.$('#ticketTimeout').val(this.model.attributes.ticketTimeout);
        },
        serialize: function(){
            return this.model.toJSON();
        },
        events: {
            'submit form': '_submitForm',
            'reset form': '_resetForm',
            'click .update_cancel': '_cancel'
        },
        _resetForm: function() {
            var that = this;
            if (this.model.attributes.agentList) {
                var arr = [];
                this.model.attributes.agentList.forEach(function(one){
                    arr.push({id: one, name: one, text: one});
                });
                that.$('#agentEmails').select2('data',arr);
            }
            this.$('.error-messages').removeClass('show');
        },
        _submitForm: function(e){
            e.preventDefault();
            var model = new GroupModel({id: this.model.id});
            var data = _.omit(this.$('form').serializeObject(), this.model.idAttribute);
            var data_ = _.pick(data, 'name', 'description', 'agentEmails', 'ticketTimeout', 'timeoutMailTo');
            this.$('.error-messages').removeClass('show');
            model.set(data_);//为校验用
            if (!model.isValid()) {
                this.$('#' + model.validationError).addClass('show');
                return;
            }
            model.save({}, {wait: true})
                .done(function(){
                    //TODO 国际化
                    $(window).info(gettext('Update group successful'));
                    Backbone.history.navigate('settings/group', true);
                }).fail(function(resp) {
                    $(window).info(gettext('Update group failure'));
                    var data = resp.responseJSON;
                    this.$('#' + data.errorCode).addClass('show');
                });
        },
        _cancel: function(e){
            e.preventDefault();
            e.stopPropagation();
            window.history.back();
        },
        _initAgent: function (url, delay, number, minimumInputLength, multiple) {//初始化组
            // var initNumber = 10;
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
        _initSelect2Single: function (url, delay, number, minimumInputLength, multiple, opts) {//初始化组
            var options = {
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
            };
            this.select2($.extend(options, opts));
        }
    });
    return GroupUpdateView;
});
