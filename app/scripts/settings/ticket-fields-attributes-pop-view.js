/**
 * Created by cailong on 2015/7/23.
 */
/*global define*/
'use strict';
define([
    'backbone',
    'settings/ticket-fields-attributes-model',
    'jqueryui'
],function(Backbone, TicketFieldsAttributesModel){

    var OptionsView, optionsView;
    var OptionsModel = Backbone.Model.extend({
        defaults: {
            options: []
        }
    });

    OptionsView = Backbone.View.extend({
        template: 'templates:settings:ticket-fields-attributes-pop-options',
        model: new OptionsModel(),
        //currModel: this.model,
        initialize: function (opts) {
            this.model.set('options', opts);
            //this.currModel = this.model;
            this.model.on('change', this.render, this);
        },
        events: {
            'click #add-option': '_addOption',
            'click .minus-option': '_minusOption',
            'keyup .option-input': '_inputKeyup'

        },
        serialize: function () {
            return this.model.toJSON();
        },
        afterRender: function () {
            var view = this;
            this.$('#sort-options').sortable({
                items: 'li.just-a-relative-parent',
                axis: 'y',
                //revert: true,
                opacity: .7,
                handle: '.option-sort',
                update: function(e, ui){
                    var i = 0,
                        arr = $(this).find('li.just-a-relative-parent'),
                        item = ui.item,
                        itemIndex = item.attr('data-index'),
                        options = view.model.get('options'),
                        swapOne = options.splice(itemIndex, 1)[0];
                    while(i < arr.length){
                        var j = $(arr[i]).attr('data-index');
                        if(j === itemIndex){
                            break;
                        }
                        i++;
                    }
                    options.splice(i, 0, swapOne);
                    view.model.set('options', options)// render页面是为了刷新index
                }
            });
        },
        _addOption: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.model.get('options').push({key: '', value: ''});
            this.model.trigger('change');
        },
        _minusOption: function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $tgt = $(e.target),
                $tgt = $tgt.hasClass('just-a-relative-parent') ? $tgt : $tgt.parents('.just-a-relative-parent'),
                index = $tgt.attr('data-index');
            this.model.get('options').splice(index, 1);
            this.model.trigger('change');
        },
        _inputKeyup: function(e){
            var $input = $(e.target),
                $tgt = $input.hasClass('just-a-relative-parent') ? $input : $input.parents('.just-a-relative-parent'),
                index = $tgt.attr('data-index');
            this.model.get('options')[index].value = $input.val();
        }
    });

    var PopView = Backbone.View.extend({
        template: 'templates:settings:ticket-fields-attributes-pop',
        className: 'pop-view modal fade',
        //model: new TicketFieldsAttributesModel(),
        views: {

        },
        events: {
            'click #save': '_save',
            'click #delete': '_delete'
            /*'click #cancel': function(e){//设置data-dismiss="modal"属性即可
             e.preventDefault();
             e.stopPropagation();
             this.$el.modal('hide');
             }*/
        },
        initialize: function(){
        },
        serialize: function(){
            return this.model ? this.model.toJSON() : {};
        },
        beforeRender: function(){
            this.setView('#options', optionsView = new OptionsView(this.model ? _.clone(this.model.get('options')) : []));
        },
        _save: function(e){
            e.preventDefault();
            e.stopPropagation();

            var owner = this.model.get('owner'),
                options = optionsView.model.get('options');
            var modelAttrs = {
                actions: {
                    agent: {
                        neededWhenSubmitTicket: this.$('#need-when-submit-ticket').is(':checked'),
                        neededWhenCloseTicket: this.$('#need-when-close-ticket').is(':checked')
                    },
                    customer: {
                        couldSeeByCustomer: this.$('#show-to-customer').is(':checked'),
                        couldEditByCustomer: this.$('#could-edit-by-customer').is(':checked'),
                        neededWhenSubmitTicket: this.$('#need-when-submit-ticket-customer').is(':checked')
                    }
                },
                title: {
                    agent: this.$('#title-agent').val(),
                    customer: this.$('#title-customer').val()
                }
            };
            if(options){
                _.extend(modelAttrs, {options: options});
            }

            this.model.set(modelAttrs);
            /*//attrs except options //不要使用下面的方式, 不然其修改的是类的prototype中defaults的属性
            this.model.get('actions').agent.neededWhenSubmitTicket = this.$('#need-when-submit-ticket').is(':checked');
            this.model.get('actions').agent.neededWhenCloseTicket = this.$('#need-when-close-ticket').is(':checked');
            this.model.get('actions').customer.couldSeeByCustomer = this.$('#show-to-customer').is(':checked');
            this.model.get('actions').customer.couldEditByCustomer = this.$('#could-edit-by-customer').is(':checked');
            this.model.get('actions').customer.neededWhenSubmitTicket = this.$('#need-when-submit-ticket-customer').is(':checked');
            this.model.get('title').agent = this.$('#title-agent').val();
            this.model.get('title').customer = this.$('#title-customer').val();
            //options
            this.model.set('options', optionsView.model.get('options'));*/

            owner.data('data', this.model);
            this.$el.modal('hide');
        },
        _delete: function(e){
            e.preventDefault();
            e.stopPropagation();
            var owner = this.model.get('owner');
            owner.remove();
            this.$el.modal('hide');
        }
    });
    return PopView;
});
