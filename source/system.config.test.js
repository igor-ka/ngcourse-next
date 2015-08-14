/* global System */
System.config({
  defaultJSExtensions: true,
  map: {
    'angular': '/base/node_modules/angular/angular.js',
    'angular-ui-router': '/base/node_modules/angular-ui-router/release/angular-ui-router.js',
    'immutable': '/base/node_modules/immutable/dist/immutable.js',
    'koast-angular': '/base/bower_components/koast-angular/dist/koast.js',
    'lodash': '/base/node_modules/lodash/index.js',
    'rx': '/base/node_modules/rx/dist/rx.all.js',
    
    'template-cache': '/base/output/js/template-cache/template-cache.js',
    
    'q': '/base/node_modules/q/q.js',
    'angular-mocks': '/base/node_modules/angular-mocks/angular-mocks.js',
    'rx.testing': '/base/node_modules/rx/dist/rx.testing.js',
    'rx.virtualtime': '/base/node_modules/rx/dist/rx.virtualtime.js',
    
    'traceur': '/base/node_modules/traceur/bin/traceur-runtime.js',
    'systemjs': '/base/node_modules/systemjs/dist/system.js',
    'system-polyfills': '/base/node_modules/systemjs/dist/system-polyfills.js',
    'es6-module-loader': '/base/node_modules/es6-module-loader/dist/es6-module-loader.js'
  },
  baseURL: 'output/js'
});