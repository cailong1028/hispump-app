/* global define*/
/**
 * Created by lnye on 2014/12/30.
 */
'use strict';
define([
    'backbone',
    'settings/group-model'
], function(Backbone, GroupModel){
    var GroupCollection = Backbone.Collection.extend({
        url: 'groups',
        model: GroupModel
    });
    return GroupCollection;
});
