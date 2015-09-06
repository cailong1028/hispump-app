/**
 * Created by cailong on 2015/6/17.
 */
/*global define, gettext*/
'use strict';
define([
    'backbone',
    'underscore',
    'underscore.string',
    'settings/ticket-types-collection',
    'settings/ticket-types-model'
], function(Backbone, _, _s, TicketTypesCollection, TicketTypesModel){
    var TicketTypesView = Backbone.View.extend({
        template: 'templates:settings:ticket-types',
        events: {
            'click #addOneTicketTypes': '_plus',
            'click a.minus': '_minus',
            'click ul#ticket-types-ul li:not(:first-child) a.up': '_up',
            'click ul#ticket-types-ul li:not(:last-child) a.down': '_down',
            'click #reset': '_reset',
            'click #submit': '_submit',
            'keyup input.ticket-types-input': '_inputKeyup'
        },
        initialize: function(){
            this.validateLabelPrefix = 'li_invalidate_';
            this.collection = this.collection || new TicketTypesCollection();
            this.listenTo(this.collection, 'add remove', this.render);////不要设置on change 否则在编辑了input之后直接点击其他操作,会因为页面的刷新导致其他的点击事件无效
        },
        beforeRender: function(){
            var done = this.async();
            if(this.collection.models.length > 0){
                return done();
            }
            this.collection.fetch({/*crossDomain: true, 测试时需要跨域*/reset: true}).done(function(){
                done();
            });
        },
        serialize: function(){
            return this.collection.toJSON();
        },
        afterRender: function(){
            this._validate();
        },
        _inputKeyup: function(e){
            e.preventDefault();
            e.stopPropagation();
            var $target = $(e.target), name = $target.val(),
                index = $target.attr('modelIndex'),
                model = this.collection.at(index);
            model.set('name', name);//先set,同步collection和页面,然后通过collection validate
            //改为保存的时候再校验
            //this._validate();
        },
        _plus: function(){
            this.collection.add(new TicketTypesModel({name: ''}));
        },
        _minus: function(e){
            e.preventDefault();
            e.stopPropagation();
            var modelIndex = $(e.target).attr('modelIndex');
            this.collection.remove(this.collection.at(modelIndex));
        },
        _up: function(e){
            e.preventDefault();
            e.stopPropagation();
            var modelIndex = parseInt($(e.target).attr('modelIndex'));
            this._move(modelIndex, -1);
        },
        _down: function(e){
            e.preventDefault();
            e.stopPropagation();
            var modelIndex = parseInt($(e.target).attr('modelIndex'));
            this._move(modelIndex, 1);
        },
        _move: function(modelIndex, type){
            var models = this.collection.models;
            var tmp = models[modelIndex];
            models[modelIndex] = models[modelIndex + type];
            models[modelIndex + type] = tmp;
            this.collection.reset(models, {silent: false});
        },
        _reset: function(){
            this.collection.remove(this.collection.models);
        },
        _validate: function(){
            var ret = 0;
            var index = arguments[0], preName = arguments[1],
                models = index ? [this.collection.at(index)] : this.collection.models,
                allTypesName = _.map(this.collection.models, function(model){
                    return _s.trim(model.get('name'));
                });
            if(preName && $.inArray(preName, allTypesName) > -1){
                this._validate(allTypesName.indexOf(preName));
            }
            for(var i = 0; i < models.length; i++){
                var typeName = _s.trim(models[i].get('name')), currTypeIndex = allTypesName.indexOf(typeName);
                var allIndex = this.__arrayDuplicateIndex(typeName, allTypesName);
                if(typeName === ''){
                    this._invalidateEvents(allIndex, gettext('ticket types should not be null'));
                    ret++;
                    continue;
                }
                var allTypesNameClone = allTypesName.slice();
                allTypesNameClone.splice(currTypeIndex, 1);
                if($.inArray(typeName, allTypesNameClone) > -1){
                    this._invalidateEvents(allIndex, gettext('ticket types duplicate') + ' [' + typeName + ']' );
                    ret++;
                    continue;
                }
                this._validateEvents(this.__arrayDuplicateIndex(typeName, allTypesName));
            }
            return ret === 0;
        },
        __arrayDuplicateIndex: function(one, array){
            var indexArray = [];
            for(var i = 0; i < array.length; i++){
                if(_s.trim(array[i]) === _s.trim(one)){
                    indexArray.push(i);
                }
            }
            return indexArray;
        },
        _validateEvents: function(index){
            var view = this;
            if(!_.isArray(index)){
                index = [index];
            }
            var labels = this.$('label').filter(function(){
                return this.id.match(new RegExp(view.validateLabelPrefix + '(' + index.join('|') + ')'));
            });
            if(labels) {
                labels.remove();
            }
        },
        _invalidateEvents: function(index, invalidateMsg){
            if(!_.isArray(index)){
                index = [index];
            }
            for(var i = 0; i < index.length; i++){
                this._validateEvents(index[i]);
                this.$('li#li_' + index[i]).append($('<label style="font-size: 12px;" id="' + this.validateLabelPrefix + index[i] + '" class="text-danger">' + invalidateMsg + '</label>'));
            }
        },
        _submit: function(){
            //validate 1: 不能为空, 2: 不能有重复的
            if(!this._validate()) {
                /*var view = this;
                var labels = this.$('label').filter(function(){
                    return this.id.match(new RegExp(view.validateLabelPrefix));
                });
                labels.removeClass('ticket-types-notation').addClass('ticket-types-notation');*/
                return;
            }
            var i = 0, types = [], model = new Backbone.Model();
            for(; i < this.collection.models.length; i++ ){
                types.push(_s.trim(this.collection.at(i).get('name')));
            }
            model.save({types: types}, {url: 'ticket-types', dataType: 'text'}).done(function(){
                $(window).info(gettext('Success to add ticket types'));
                Backbone.history.navigate('/settings', true);
            }).fail(function(){
                $(window).info(gettext('Fail to add ticket types'));
            });
        }
    });

    return TicketTypesView;
});
