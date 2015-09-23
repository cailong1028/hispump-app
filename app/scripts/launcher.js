 /*define require*/
'use strict';
(function (document) {
    var base = document.querySelector('#options');
    // disable multi language require;
    // var language = 'languages/' + navigator.language.toLowerCase();
    var language = 'languages/zh-cn';

    // 正式环境 将使用launcher加载js和资源。
    require.config({
        // 改为CDN地址
        //By default load any module IDs from js/lib
        baseUrl: base.dataset.assetsLocation + '/scripts',
        paths: {
            'jquery': 'http://static.yunkefu.cc/jslib/jquery/jquery.min',
            'underscore': 'http://static.yunkefu.cc/jslib/underscore/underscore.min',
            'underscore.string': 'http://static.yunkefu.cc/jslib/underscore.string/underscore.string.min',
            'backbone': 'http://static.yunkefu.cc/jslib/backbone/backbone.min',
            'layoutmanager': 'http://static.yunkefu.cc/jslib/layoutmanager/backbone.layoutmanager.min',

            // bootstrap
            'bootstrap': 'http://static.yunkefu.cc/jslib/bootstrap/bootstrap.min',

            // template
            'handlebars': 'http://static.yunkefu.cc/jslib/handlebars/handlebars.amd.min',

            //vendor
            'bootstrap-datetimepicker': 'http://static.yunkefu.cc/jslib/bootstrap-datetimepicker/bootstrap-datetimepicker4',
            'bootstrap-pagination' : 'http://static.yunkefu.cc/jslib/bootstrap-pagination/bootstrap-pagination.min',
            // custom jquery plugin
            'jquery.serialize-object': 'http://static.yunkefu.cc/jslib/jquery.serialize-object',
            'jed': 'http://static.yunkefu.cc/jslib/jed/jed.min',

            'moment': 'http://static.yunkefu.cc/jslib/moment/moment.min',
            'moment-timezone': 'http://static.yunkefu.cc/jslib/moment-timezone/moment-timezone-with-data-2010-2020.min',

            // file uploader
            'jquery-file-upload': 'http://static.yunkefu.cc/jslib/jquery-file-upload/js/jquery.fileupload',
            'jquery.iframe-transport': 'http://static.yunkefu.cc/jslib/jquery-file-upload/js/jquery.iframe-transport',
            // end

            'dropzone': 'http://static.yunkefu.cc/jslib/dropzone/dropzone-amd-module.min',

            'numeral': 'http://static.yunkefu.cc/jslib/numeral/numeral.min',
            // editor
            'bootstrap.wysihtml5': 'http://static.yunkefu.cc/jslib/bootstrap-wysihtml5/bootstrap.wysihtml5.min',
            'bootstrap.wysihtml5.templates': 'http://static.yunkefu.cc/jslib/bootstrap-wysihtml5/bootstrap.wysihtml5.templates.min',
            'bootstrap.wysihtml5.commands': 'http://static.yunkefu.cc/jslib/bootstrap-wysihtml5/bootstrap.wysihtml5.commands.min',
            'wysihtml5': 'http://static.yunkefu.cc/jslib/bootstrap-wysihtml5/wysihtml5.min',
            'rangy': 'http://static.yunkefu.cc/jslib/rangy/rangy-core.min',
            'rangy-selectionsaverestore': 'http://static.yunkefu.cc/jslib/rangy/rangy-selectionsaverestore.min',

            'jquery-select2': 'http://static.yunkefu.cc/jslib/jquery-select2/jquery-select2.min'
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            },
            'underscore.string': {
                deps: ['underscore']
            },
            backbone: {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            layoutmanager: {
                deps: ['backbone']
            },
            underscore: {
                exports: '_'
            },
            'bootstrap-datetimepicker': {
                deps: [
                    'jquery',
                    'moment',
                    'bootstrap'
                ]
            },
            'jquery-file-upload': {
                deps: [
                    'jquery',
                    'jquery.ui.widget',
                    'jquery.iframe-transport'
                ]
            },
            'jquery.serialize-object': {
                deps: ['jquery']
            },
            'bootstrap.wysihtml5': {
                deps: ['jquery', 'bootstrap']
            },
            'rangy': {
                exports: 'rangy'
            },
            'rangy-selectionsaverestore': {
                deps: ['rangy']
            },
            'jquery-select2': {
                deps: ['jquery']
            },
            main: {
                deps: [language]
            }
        }
    });
    window.DEBUG = true;
    require(['main']);
}).call(window, document);
