/* global define, gettext, ngettext, jed */
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'moment',
    'numeral',
    'layoutmanager',
    'jquery.serialize-object',
    // datetimepicker
    'bootstrap',
    'bootstrap-datetimepicker',
    'bootstrap-pagination',
    'helpers/notify-osd',
    'moment-timezone',
    'vendor/backbone.cache'
], function($, _, Backbone, HandlebarsEnv, moment, numeral) {
    'use strict';
    var DEFAULT_OPTIONS = {
        root: '/', //暂时没用
        apiRoot: '/', //api地址
        assetsLocation: '' //cdn地址
    };
    var options = _.extend({}, DEFAULT_OPTIONS, $('base#options').data());
    // default application class
    var Application = function Application() {
        this.vent.on('notification', function(options) {
            var o = options;
            if( _.isString(options) ) {
                o = {text: options};
            }
        }, this);
        this.vent.on('confirm', function(o) {
            require(['helpers/confirm-view'], function(ConfirmView) {
                var view = new ConfirmView(o);
                view.render().promise().done(function() {
                    view.show(o);
                });
            });
        });
        this.vent.on('dialog', function(o) {
            require(['helpers/dialog-view'], function(DialogView) {
                var view = new DialogView(o);
                view.render().promise().done(function() {
                    view.show(o);
                });
            });
        });
    };

    // app event prototype
    Application.prototype.vent = _.extend({}, Backbone.Events);

    Application.prototype.version = '1.0';

    Application.prototype.routers = {};
    Application.prototype.initialize = function() {
    };
    Application.prototype.useLayout = function() {
        return this.$layout;
    };

    Application.prototype.globalCache = new Backbone.Cache();
    Application.prototype.start = function() {
        this.vent.trigger('initialize:before', this);
        this.vent.trigger('initialize:after');
    };
    Application.prototype.redirectHashBang = function() {
        window.location = window.location.hash.substring(2);
    };
    var EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    Application.prototype.validateEmail = function(email) {
        return EMAIL_PATTERN.test(email);
    };
    var MAC_PATTERN = /(([a-zA-Z0-9]{2}-){5})[a-zA-Z0-9]{2}/;
    Application.prototype.validateMAC = function(mac) {
        return MAC_PATTERN.test(mac);
    };
    /**
    * ajax访问api的内容的url
    */
    var buildUrl = Application.prototype.buildUrl = function() {
        return [options.apiRoot].concat(_.toArray(arguments)).join('/');
    };

    Application.prototype.handleFail = function(xhr) {
        if (xhr.responseJSON) {
            var resp = xhr.responseJSON;
            if(resp.message) {
                this.vert.trigger('notification', resp.message);
            }
        } else {
            this.vert.trigger('notification', '与服务器通讯发生异常');
        }
    };
    Application.prototype.loadModules = function(modules) {
        var deferred = new $.Deferred();
        modules = _.isArray(modules) ? modules : _.toArray(arguments);
        require(_.toArray(modules), function() {
            _.each(_.toArray(arguments), function(module) {
                module();
            });
            deferred.resolve();
        }, function(){
            deferred.reject();
        });
        return deferred.promise();
    };
    Application.prototype.assets = function(path) {
        return options.assetsLocation + path;
    };

    // 设置Backbone的AJAX代码
    Backbone.originalSync = Backbone.sync;
    Backbone.sync = function(method, model, options) {
        var _beforeSend;
        _beforeSend = options.beforeSend;
        options.beforeSend = function(jqXHR, settings) {
            // window.client
            // 用于认证
            if (window.client) {
                window.client.doBeforeSend(jqXHR, settings);
            }
            if (/^(\/|(http[s]?\:\/\/))/i.test(settings.url) === false) {
                settings.url = buildUrl(settings.url);
            }
            if (method === 'delete' && options.data && !!!options.ignoreMatrixParam) {
                settings.url = settings.url + _.reduce(options.data, function(memo, value, key) {
                    return memo + ';' + key  + (value ? ('=' + value) : '');
                }, '');
            }
            if (_beforeSend) {
                _beforeSend.apply(this, arguments);
            }

        };
        return Backbone.originalSync(method, model, options);
    };
    // 支持hateoas功能
    var originalParse = Backbone.Collection.prototype.originalParse = Backbone.Collection.prototype.parse;
    Backbone.Collection.prototype.parse = function(response) {
        response = response || {};
        if (/*response.links && */response.page) {
            this.page = response.page;
            return response.content;
        }
        return originalParse.apply(this, _.toArray(arguments));
    };

    // 注册Handlebars helpers
    var Handlebars = HandlebarsEnv.default;
    Handlebars.registerHelper('dateFormat', function(context, block) {
        var f = block.hash.format || 'll';
        // 默认返回ISO DATE
        var m = moment(context, 'YYYY-MM-DD');
        if (m.isValid()) {
            // 只选择日期的话，是不需要时区的
            return m.format(f);
        }
        return '';
    });
    Handlebars.registerHelper('datetimeFormat', function(context, block) {
        var f = block.hash.format || 'llll';
        // 默认返回ISO DATE
        var m = moment(context, 'YYYY-MM-DD\'T\'HH:mm:ssZ');
        if (m.isValid()) {
            // 目前仅支持这个时区
            return m.tz('Asia/Shanghai').format(f);
        }
        return '';
    });
    Handlebars.registerHelper('fromNow', function(context) {
        if(_.isDate(context)) {
            return moment(context).tz('Asia/Shanghai').fromNow();
        }
        // 默认返回ISO DATE
        var m = moment(context, 'YYYY-MM-DD\'T\'HH:mm:ssZ');
        if (m.isValid()) {
            // 目前仅支持这个时区
            return m.tz('Asia/Shanghai').fromNow();
        }
        return '';
    });
    Handlebars.registerHelper('numeralFormat', function(context, block) {
        var f = block.hash.format || '0,0';
        return numeral(context || '').format(f);
    });
    Handlebars.registerHelper('increment', function(context) {
        return numeral(context || '').add(1);
    });
    Handlebars.registerHelper('hasComponent', function(value, context) {
        if (window.client.hasComponent(value) === true) {
            return new Handlebars.SafeString(context.fn(this));
        }
        return context.inverse(this);
    });
    Handlebars.registerHelper('isPermitted', function() {
        var params = _.initial(arguments);
        var context = _.last(arguments);
        if (window.client.isPermitted.apply(window.client, params) === true) {
            return new Handlebars.SafeString(context.fn(this));
        }
        return context.inverse(this);
    });

    Handlebars.registerHelper('isPermittedAny', function() {
        var params = _.initial(arguments);
        var context = _.last(arguments);
        if (window.client.isPermittedAny.apply(window.client, params) === true) {
            return new Handlebars.SafeString(context.fn(this));
        }
        return context.inverse(this);
    });
    //his 权限前端控制
    Handlebars.registerHelper('permit', function(action) {
        var context = _.last(arguments);
        if (window.client.permit(action) === true) {
            return new Handlebars.SafeString(context.fn(this));
        }
        return context.inverse(this);
    });
    Handlebars.registerHelper('option', function(value, label, selectedValue) {
        var selectedProperty = value === selectedValue ? 'selected="selected"' : '';
        return new Handlebars.SafeString('<option value="' + value + '"' +  selectedProperty + '>' + label + '</option>');
    });
    Handlebars.registerHelper('options', function(values, selectedValue, options) {
        var html = '';
        _.each(values, function(value) {
            var selectedProperty = value === selectedValue ? 'selected="selected"' : '';
            html += '<option value="' + value + '"' +  selectedProperty + '>' + options.fn(value) + '</option>';
        });
        return new Handlebars.SafeString(html);
    });
    Handlebars.registerHelper('ticketsTypeOptions', function(values, selectedValue) {
        var html = '', valueMatch = false;
        _.each(values, function(value) {
            var selectedProperty = '';
            if(value === selectedValue){
                selectedProperty = 'selected="selected"';
                valueMatch = true;
            }
            html += '<option value="' + value + '"' +  selectedProperty + '>' +value + '</option>';
        });
        if(!valueMatch){
            html += '<option value="' + selectedValue + '" selected="selected">' + selectedValue + '</option>';
        }
        return new Handlebars.SafeString(html);
    });
    Handlebars.registerHelper('objectOptions', function(objects, selectedValue, options) {
        var value = options.hash.value ? options.hash.value: 'id';
        var html = '';
        _.each(objects, function(obj) {
            var selectedProperty = obj[value] === selectedValue ? 'selected="selected"' : '';
            html += '<option' + (obj[value]?' value="' + obj[value] + '"': '') +  selectedProperty + '>' + options.fn(obj) + '</option>';
        });
        return new Handlebars.SafeString(html);
    });
    Handlebars.registerHelper('assets', function(value) {
        return options.assetsLocation + value;
    });
    // 注册 handlebars gettext 方法
    Handlebars.registerHelper('gettext', function() {
        if (arguments.length === 2) {
            var context = _.first(arguments);
            return gettext.apply(gettext, [context]);
        } else {
            var args = _.initial(arguments);
            return ngettext.apply(ngettext, args);
        }
    });
    // 注册stringf方法
    Handlebars.registerHelper('sprintf', function() {
        var params = _.initial(arguments);
        if (!_.isString(params[0])){
            params[0] = params[0].toString();
        }
        return jed.sprintf.apply(jed, params);
    });
    Handlebars.registerHelper('if_eq', function(a, b, opts) {
        if(a === b){ // Or === depending on your needs
            return opts.fn(this);
        }
        else{
            return opts.inverse(this);
        }
    });
    Handlebars.registerHelper('if_not_eq', function(a, b, opts) {
        if(a !== b){ // Or === depending on your needs
            return opts.fn(this);
        }
        else{
            return opts.inverse(this);
        }
    });
    Handlebars.registerHelper('in_array', function(a, b, opts) {
        var i = 0;
        for(; i < b.length; i++){
            if(a === b[i]){
               return opts.fn(this);
            }
        }
        return opts.inverse(this);
    });
    /* 设置ajax回调 */
    // var compile = function(text) {
    //     return Handlebars.compile(text);
    // };
    // 设置Backbone Layoutmanager
    var templates = window.LinkDeskTemplates = window.LinkDeskTemplates || {};
    var getTemplate = function(name, path) {
        var template = templates[name];
        if (template) {
            return Backbone.Layout.cache(path, Handlebars.template(template));
        }
        throw 'template ' + name + ' undefined';
    };
    Backbone.Layout.configure({
        manage: true,
        fetchTemplate: function(path) {
            var template = Backbone.Layout.cache(path);
            if (template) {
                return template;
            }
            if (/^templates\:/.test(path)) {
                var names = path.substring('templates:'.length).split(':');
                if (names.length !== 2) {
                    throw 'unsupported templates path ' + path + '.';
                }
                template = templates[names.join('/')];
                if (template) {
                    return Backbone.Layout.cache(path, Handlebars.template(template));
                }
                // console.log('fetch module templates:' + names[0]);
                var done = this.async();
                require(['templates/' + names[0]], function() {
                    done(getTemplate(names.join('/'), path));
                }, function() { // fallback
                    throw 'template ' + names + ' undefined';
                });

            // } else if (/^fragment\:/.test(path)) {
            //     url = buildUrl(path.substring('fragment:'.length));
            //     $.get(url).done(function(data) {
            //         template = compile(data);
            //         return done(template);
            //     });
            //     return;
            // } else {
            //     template = Backbone.Layout.cache(path);
            //     if (template !== void 0) {
            //         return template;
            //     }
            //     url = buildUrl(path);
            //     done = this.async();
            //     $.get(url).done(function(data) {
            //         template = compile(data);
            //         Backbone.Layout.cache(path, template);
            //         return done(template);
            //     });
            } else {
                throw 'templates path ' + path +' unsupported';
            }
        }
    });
    $.ajaxSetup({
        statusCode : {
            401 : function(error) {
                console.error(error);
            },
            403 : function() {
                Backbone.history.navigate('denied', true);
            }
        }
    });
    $(document).on('click', 'a:not([data-bypass])', function (e) {
        var href = $(this).attr('href');
        if (!href) { return; }
        // jshint scripturl:true
        // 无视javascript
        if (href.slice(0, 'javascript:'.length) === 'javascript:') { return; }
        // 无视mailto
        if (href.slice(0, 'mailto:'.length) === 'mailto:') { return; }
        // 无视https
        if (href.slice(0, 'https:'.length) === 'https:') { return; }
        // 无视http
        if (href.slice(0, 'http:'.length) === 'http:') { return; }

        // jshint scripturl:false
        var protocol = this.protocol + '//';
        if (href.slice(protocol.length) !== protocol) {
            e.preventDefault();
            Backbone.history.navigate(href, true);
        }
    });
    return Application;
});
