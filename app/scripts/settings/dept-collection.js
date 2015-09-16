/* global define*/
/**
 * Created by lnye on 2014/12/30.
 */
'use strict';
define([
    'backbone',
    'settings/dept-model'
], function(Backbone, DeptModel){
    var DeptCollection = Backbone.Collection.extend({
        url: 'dept/list',
        model: DeptModel
    });
    return DeptCollection;
});
