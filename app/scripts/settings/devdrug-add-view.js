/* global define, gettext*/
'use strict';
define([
    'underscore',
    'underscore.string',
    'backbone',
    'settings/devdrug-model',
    'settings/dev-type-collection',
    'settings/dept-collection',
    'settings/dev-collection'
], function(_, _s, Backbone, DevdrugModel, DevTypeCollection, DeptCollection, DevCollection) {

    var suggest  = function(quietMillis, url) {
        var timeout;
        return function(o) {
            window.clearTimeout(timeout);
            timeout = setTimeout(function() {
                $.getJSON(app.buildUrl(url), {
                    term: o.term
                }, function(res) {
                    o.callback({more: false, results: res});
                });
            }, quietMillis);
        };
    };

    var formatResult = function(data) {
        if (data.email) {
            return data.name + ' / <small><i class="fa fa-envelope fa-fw"></i> ' + data.email +'</small>';
        } else if (data.mobile) {
            return data.name + ' / <small><i class="fa fa-mobile fa-fw"></i> ' + data.mobile +'</small>';
        }
        return data.name;
    };

    var DevdrugAddView = Backbone.View.extend({
        template: 'templates:settings:devdrug-add',
        events: {
            'click button.submit,a.save-close': 'saveClose',
            'click a.save-continue': 'saveContinue',
            'submit form': 'saveClose',
            'reset form': 'resetForm',
            'click button.cancel': '_clickCancelButton',
            'keyup .number': '_onlyNumber'
        },
        initialize: function(){
        },
        serialize: function(){
            return this.jsonObj;
        },
        beforeRender: function() {
        },
        afterRender: function(){
            this._initdept();
            this._initCart();
            this._initDrug();
        },
        _initdept: function(){
            this.$('#deptid').select2({
                minimumInputLength: 1,
                cache: true,
                allowClear: true,
                placeholder: gettext('Select a dept'),
                // 保留query方法。。。这玩意会报错的。。
                query: suggest(200, 'dept/suggest'),
                formatResult: function(data){
                    return data.dept_code+' / '+data.dept_name;
                },
                formatSelection: function(data){
                    return data.dept_code+' / '+data.dept_name;
                },
                initSelection: function (e, callback) {
                    /*if (requesterView.model) {
                     callback(requesterView.model.toJSON());
                     } else {
                     callback();
                     }*/
                }
            }).on('change', _.bind(this._changeCarts, this));
        },
        _initCart: function(){
            this.$('#cartid').select2({
                minimumInputLength: 1,
                cache: true,
                allowClear: true,
                placeholder: gettext('Select a dev'),
                // 保留query方法。。。这玩意会报错的。。
                query: suggest(200, 'dev/list/suggest'),
                formatResult: formatResult,
                formatSelection: formatResult,
                initSelection: function (e, callback) {
                    /*if (requesterView.model) {
                     callback(requesterView.model.toJSON());
                     } else {
                     callback();
                     }*/
                }
            });
        },
        _initDrug: function(){
            var format = function(data){
                if (data.pinyin) {
                    return data.name + ' / <small>' + data.pinyin +'</small>';
                } else{
                    return data.name;
                }
            };
            this.$('#drugid').select2({
                minimumInputLength: 1,
                cache: true,
                allowClear: true,
                placeholder: gettext('Select a drug'),
                // 保留query方法。。。这玩意会报错的。。
                query: suggest(200, 'drug/list/suggest'),
                formatResult: format,
                formatSelection: format,
                initSelection: function (e, callback) {
                    /*if (requesterView.model) {
                     callback(requesterView.model.toJSON());
                     } else {
                     callback();
                     }*/
                }
            });
        },
        _changeCarts: function(){
            var col = new DevCollection();
            var opts = {};
            var currDeptid = this.$('#deptid').val();
            if(!currDeptid || currDeptid === ''){
                return this._initCart();
            }
            col.fetch({reset: true, data: _.extend(opts, {deptid: currDeptid})}).done(_.bind(function(){
                var arr = _.map(col.models, function(model){
                    return _.extend(model.attributes, {text: model.get('name')});
                });
                this.$('#cartid').select2({
                    data: arr,
                    allowClear: true
                });
            },this)).fail();
        },
        _onlyNumber: function(e){
            var $tgt = $(e.target);
            $tgt.val($tgt.val().replace(/\D/gi, ''));
        },
        _clickCancelButton: function(e) {
            e.preventDefault();
            // history回退
            window.history.back(-1);
        },
        saveClose: function(e){
            e.preventDefault();
            this._submitForm().done(function() {
                $(window).info(gettext('Add devdrug successful'));
                Backbone.history.navigate('/settings/devdrug', true);
            }).fail(_.bind(function(resp){
                if (resp && resp.responseJSON && resp.responseJSON.type === 'DevdrugAlreadyExists') {
                    this.$('#DevdrugAlreadyExists').addClass('show');
                }
                else if(resp){
                    $(window).info(gettext('Fail to add devdrug'));
                }
            },this));
        },
        saveContinue: function(e){
            e.preventDefault();
            var self = this;
            this._submitForm().done(function() {
                $(window).info(gettext('Add devdrug successful'));
                self.resetForm();
            }).fail(_.bind(function(resp){
                if (resp && resp.responseJSON && resp.responseJSON.type === 'DevdrugAlreadyExists') {
                    this.$('#DevdrugAlreadyExists').addClass('show');
                }
                else if(resp){
                    $(window).info(gettext('Fail to add devdrug'));
                }
            },this));
        },
        resetForm: function(e){
            this.$('button[type="reset"]').trigger('click');
            this.$('#deptid').select2('val', null);
            this.$('#cartid').select2('val', null);
            this.$('#drugid').select2('val', null);
        },
        _submitForm: function() {
            var dtd = new $.Deferred();
            var serObj = this.$('form').serializeObject();

            var model = new DevdrugModel(serObj);
            this.$('.error-messages').removeClass('show');
            if (!model.isValid()) {
                var errSpan = this.$('#' + model.validationError);
                errSpan.addClass('show');
                _.delay(function(){
                    dtd.reject();
                }, 0);
                return dtd.promise();
            }
            //this.trimObj(model.attributes);
            model.save({}, {wait: true}).done(function(){
                dtd.resolve();
            }).fail(function(resp){
                dtd.reject(resp);
            });
            return dtd.promise();
        }
    });
    return DevdrugAddView;
});
