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
            'jquery': 'https://static.yunkefu.com/jslib/jquery/jquery.min',
            'underscore': 'https://static.yunkefu.com/jslib/underscore/underscore.min',
            'underscore.string': 'https://static.yunkefu.com/jslib/underscore.string/underscore.string.min',
            'backbone': 'https://static.yunkefu.com/jslib/backbone/backbone.min',
            'layoutmanager': 'https://static.yunkefu.com/jslib/layoutmanager/backbone.layoutmanager.min',

            // bootstrap
            'bootstrap': 'https://static.yunkefu.com/jslib/bootstrap/bootstrap.min',

            // template
            'handlebars': 'https://static.yunkefu.com/jslib/handlebars/handlebars.amd.min',

            //vendor
            'bootstrap-datetimepicker': 'http://static.yunkefu.com/jslib/bootstrap-datetimepicker/bootstrap-datetimepicker4',
            'bootstrap-pagination' : 'https://static.yunkefu.com/jslib/bootstrap-pagination/bootstrap-pagination.min',
            // custom jquery plugin
            'jquery.serialize-object': 'https://static.yunkefu.com/jslib/jquery.serialize-object',
            'jed': 'https://static.yunkefu.com/jslib/jed/jed.min',

            'moment': 'https://static.yunkefu.com/jslib/moment/moment.min',
            'moment-timezone': 'https://static.yunkefu.com/jslib/moment-timezone/moment-timezone-with-data-2010-2020.min',

            // file uploader
            'jquery-file-upload': 'https://static.yunkefu.com/jslib/jquery-file-upload/js/jquery.fileupload',
            'jquery.iframe-transport': 'https://static.yunkefu.com/jslib/jquery-file-upload/js/jquery.iframe-transport',
            'jquery.ui.widget': 'https://static.yunkefu.com/jslib/jquery-file-upload/js/https://static.yunkefu.com/jslib/jquery.ui.widget',
            // end

            'dropzone': 'https://static.yunkefu.com/jslib/dropzone/dropzone-amd-module.min',

            'numeral': 'https://static.yunkefu.com/jslib/numeral/numeral.min',
            // editor
            'bootstrap.wysihtml5': 'https://static.yunkefu.com/jslib/bootstrap-wysihtml5/bootstrap.wysihtml5.min',
            'bootstrap.wysihtml5.templates': 'https://static.yunkefu.com/jslib/bootstrap-wysihtml5/bootstrap.wysihtml5.templates.min',
            'bootstrap.wysihtml5.commands': 'https://static.yunkefu.com/jslib/bootstrap-wysihtml5/bootstrap.wysihtml5.commands.min',
            'wysihtml5': 'https://static.yunkefu.com/jslib/bootstrap-wysihtml5/wysihtml5.min',
            'rangy': 'https://static.yunkefu.com/jslib/rangy/rangy-core.min',
            'rangy-selectionsaverestore': 'https://static.yunkefu.com/jslib/rangy/rangy-selectionsaverestore.min',

            'jquery-select2': 'https://static.yunkefu.com/jslib/jquery-select2/jquery-select2.min'
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
