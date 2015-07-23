/* global System */
System.config({
  defaultJSExtensions: true,
  meta: {
    'app': {
      deps: ['angular', 'templateCacheHtml']
    }
  },
  map: {
    'lodash': '/bower_components/lodash/dist/lodash',
    'koast': '/bower_components/koast-angular/dist/koast',
    'angular': '/bower_components/angular/angular',
    'angular-ui-router': '/bower_components/angular-ui-router/release/angular-ui-router',
    'rx': '/bower_components/rxjs/dist/rx.all',
    'immutable': '/bower_components/immutable/dist/immutable',
    'app': 'app'
  },
  baseURL: '/'
});

