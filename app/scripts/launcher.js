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
            'jquery': 'http://127.0.0.1:5000/jslib/jquery/jquery.min',
            'underscore': 'http://127.0.0.1:5000/jslib/underscore/underscore.min',
            'underscore.string': 'http://127.0.0.1:5000/jslib/underscore.string/underscore.string.min',
            'backbone': 'http://127.0.0.1:5000/jslib/backbone/backbone.min',
            'layoutmanager': 'http://127.0.0.1:5000/jslib/layoutmanager/backbone.layoutmanager.min',

            // bootstrap
            'bootstrap': 'http://127.0.0.1:5000/jslib/bootstrap/bootstrap.min',

            // template
            'handlebars': 'http://127.0.0.1:5000/jslib/handlebars/handlebars.amd.min',

            //vendor
            'bootstrap-datetimepicker': 'http://127.0.0.1:5000/jslib/bootstrap-datetimepicker/bootstrap-datetimepicker4',
            'bootstrap-pagination' : 'http://127.0.0.1:5000/jslib/bootstrap-pagination/bootstrap-pagination.min',
            // custom jquery plugin
            'jquery.serialize-object': 'http://127.0.0.1:5000/jslib/jquery.serialize-object',
            'jed': 'http://127.0.0.1:5000/jslib/jed/jed.min',

            'moment': 'http://127.0.0.1:5000/jslib/moment/moment.min',
            'moment-timezone': 'http://127.0.0.1:5000/jslib/moment-timezone/moment-timezone-with-data-2010-2020.min',

            // file uploader
            'jquery-file-upload': 'http://127.0.0.1:5000/jslib/jquery-file-upload/js/jquery.fileupload',
            'jquery.iframe-transport': 'http://127.0.0.1:5000/jslib/jquery-file-upload/js/jquery.iframe-transport',
            // end

            'dropzone': 'http://127.0.0.1:5000/jslib/dropzone/dropzone-amd-module.min',

            'numeral': 'http://127.0.0.1:5000/jslib/numeral/numeral.min',
            // editor
            'bootstrap.wysihtml5': 'http://127.0.0.1:5000/jslib/bootstrap-wysihtml5/bootstrap.wysihtml5.min',
            'bootstrap.wysihtml5.templates': 'http://127.0.0.1:5000/jslib/bootstrap-wysihtml5/bootstrap.wysihtml5.templates.min',
            'bootstrap.wysihtml5.commands': 'http://127.0.0.1:5000/jslib/bootstrap-wysihtml5/bootstrap.wysihtml5.commands.min',
            'wysihtml5': 'http://127.0.0.1:5000/jslib/bootstrap-wysihtml5/wysihtml5.min',
            'rangy': 'http://127.0.0.1:5000/jslib/rangy/rangy-core.min',
            'rangy-selectionsaverestore': 'http://127.0.0.1:5000/jslib/rangy/rangy-selectionsaverestore.min',

            'jquery-select2': 'http://127.0.0.1:5000/jslib/jquery-select2/jquery-select2.min',
            'Blob': 'http://127.0.0.1:5000/jslib/Blob/Blob',
            'FileSaver': 'http://127.0.0.1:5000/jslib/FileSaver/FileSaver.min',
            'amcharts': 'http://127.0.0.1:5000/jslib/amcharts2/amcharts/amcharts',
            'jqueryui': 'http://127.0.0.1:5000/jslib/jqueryui/jquery-ui.min',
            'socket.io': 'http://127.0.0.1:5000/jslib/socket.io/socket.io-1.3.7'
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
            },
            'jqueryui': {
                deps: ['jquery']
            }/*,
            'amcharts': {
                exports: 'AmCharts'
            }*/
        }
    });
    window.DEBUG = true;
    require(['main']);
}).call(window, document);
