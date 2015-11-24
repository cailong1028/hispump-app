/**
 * Created by cailong on 2015/7/22.
 */
/*global define*/
'use strict';
define([
    'backbone',
    'settings/ticket-fields-attributes-pop-view',
    'settings/ticket-fields-attributes-model',
    'jqueryui'
], function (Backbone, PopView, TicketFieldsAttributesModel) {
    var popView;
    var TicketFieldsView = Backbone.View.extend({
        template: 'templates:settings:ticket-fields',
        events: {
            'click .sort-item, .sort-item *': '_showTypeAttributes'
        },
        views: {
            '#pop-view': popView = new PopView()
        },
        initialize: function(){

        },
        serialize: function(){

        },
        beforeRender: function(){

        },
        afterRender: function(){
            //popView.$el.hide();
            //设置popview的位置和宽高
            var view = this;
            $('a.field-type').draggable({
                appendTo: '#sort-zone',
                connectToSortable: '#sort-zone',
                helper: 'clone',
                revert: 'invalid'
            });
            $('#sort-zone').sortable({
                revert: true,
                items: '.sort-item',
                cursor: 'move',
                opacity: .8,
                //placeholder: 'white',
                receive: function(e, ui) {
                    var $fieldType = ui.item,
                        type = $fieldType.attr('data-field-type'),
                        holeLineSortItemDivHTML = '<div class="sort-item" data-field-type="'+type+'">',
                        halfLineSortItemDivHTML = '<div class="sort-item half" data-field-type="'+type+'">',
                        html = [
                            holeLineSortItemDivHTML,
                            '<label class="required">'+gettext('Ticket field title')+'</label>',
                            '<br>'
                        ],
                        options = [];
                    switch (type){
                        case 'text':
                            html.push( '<input class="form-control" type="text" disabled>');
                            break;
                        case 'number':
                            html.splice(0, 1, halfLineSortItemDivHTML);
                            html.push( '<input class="form-control" type="text" disabled>');
                            break;
                        case 'select':
                            html.splice(0, 1, halfLineSortItemDivHTML);
                            html.push( '<select class="form-control" disabled></select>');
                            options.push({key: 'first', value: gettext('first')}, {key: 'second', value: gettext('second')});
                            break;
                        case 'checkbox':
                            html.push( '<input type="checkbox" disabled>');
                            options.push({key: 'one', value: gettext('one')});
                            break;
                        case 'textarea':
                            html.push( '<textarea class="form-control" disabled></textarea>');
                            break;
                        default:
                            break;
                    }
                    html.push('</div>');
                    var receiveData = $(this).data(),
                        currentItem = receiveData[_.keys(receiveData)[0]].currentItem,
                        newItem = $(html.join(''));
                    newItem.insertBefore(currentItem);
                    currentItem.remove();
                    var popModel = new TicketFieldsAttributesModel();
                    if(options.length > 0){
                        popModel.set('options', options);
                    }
                    newItem.data('data', popModel);
                    newItem.trigger('click');
                }
            });
        },
        _showTypeAttributes: function(e){
            e.preventDefault();
            e.stopPropagation();
            var $tgt = $(e.target);
            if(!$tgt.hasClass('sort-item')){
                $tgt = $tgt.parents('div.sort-item');
            }
            var popModel = $tgt.data('data');
            //TODO 暂时测试, 对于初始加载的field暂时不做操作
            if(!popModel){
                popModel = new TicketFieldsAttributesModel();
                //直接使用Model中定义的defaults的话,当数据结构较深的话(超过两层), 会造成修改的是类中的prototype的属性,
                //而不是对象的ownproperties的错误, 所以在new对象的时候set,而不是使用backbone中定义的defaults
                //popModel.set(_.clone(popModel._defaults));
            }
            popModel.set('owner', $tgt);
            popView.model = popModel;
            popView.render();
            popView.$el.modal('show');
        }
    });

    return TicketFieldsView;
});
