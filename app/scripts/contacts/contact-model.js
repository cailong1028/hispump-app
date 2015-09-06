/* global define, app */
'use strict';
define([
    'underscore',
    'underscore.string',
    'backbone',
    'moment'
], function(_, s, Backbone, moment) {
    var ContactModel = Backbone.Model.extend({
        urlRoot: 'contacts',
        attributes: [
            'id',
            'email',
            'corporation',
            'title',
            'name',
            'nickname',
            'birthday',
            'gender',
            'mobile',
            'telephone',
            'avatar',
            'address',
            'address2',
            'postcode',
            'tags',
            'weixin'
        ],
        initialize: function() {
            this.on('change:birthday', function(model, value) {
                if (value) {
                    // 设置成ISO格式DATE格式
                    if (!moment(value, 'YYYY-MM-DD').isValid()) {
                        throw 'parse birthday error';
                    }
                    model.set('birthday', value);
                } else {
                    model.unset('birthday');
                }
            });
        },
        validate: function(attrs) {
            //姓名不存在
            if (!attrs.name || !s.trim(attrs.name)) {
                return 'name_required';
            }
            // 如果email和mobile均不存在
            // if ((!attrs.mobile || !s.trim(attrs.mobile)) && (!attrs.email || !s.trim(attrs.email))) {
            //     return 'mobile_or_email_required';
            // }
            // 如果email存在，但是检查没有通过
            if (attrs.email && !app.validateEmail(attrs.email)) {
                return 'invalidation_email';
            }
        },
        restore: function(o) {
            o = _.extend({}, o, {
                url: _.result(this, 'url') + '/restore',
                validate:false
            });
            return this.save({}, o);
        },
        sendverifyemail: function(o) {
            o = _.extend({}, o, {
                url: _.result(this, 'url') + '/verify',
                validate:false
            });
            return this.save({}, o);
        }
    });
    return ContactModel;
});
