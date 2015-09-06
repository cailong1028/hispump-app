/**
 * Created by cailong on 2015/1/15.
 */
/* global define*/
'use strict';
define(['backbone'], function(Backbone){
    var PromptView = Backbone.View.extend({
        template: 'templates:settings:group-animatePrompt',
        className: 'modal fade',
        afterRender: function(){
            this.$('.prompt-info').text(this.options.info);
        },
        setInfo: function(info){
            this.$('.prompt-info').text(info);
            return this;
        }
    });
    return PromptView;
});
