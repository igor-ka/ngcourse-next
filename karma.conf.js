module.exports = function (config) {

  config.set({

    files : [
      { pattern: 'node_modules/angular/angular.js', served: true, included: false, watched: false },
      { pattern: 'node_modules/angular-ui-router/release/angular-ui-router.js', served: true, included: false, watched: false },
      { pattern: 'node_modules/immutable/dist/immutable.js', served: true, included: false, watched: false },
      { pattern: 'node_modules/koast-angular/dist/koast.js', served: true, included: false, watched: false },
      { pattern: 'node_modules/lodash/index.js', served: true, included: false, watched: false },
      { pattern: 'node_modules/rx/dist/rx.js', served: true, included: false, watched: false },
      { pattern: 'node_modules/rx/dist/rx.all.js', served: true, included: false, watched: false },
      { pattern: 'node_modules/angular-mocks/angular-mocks.js', served: true, included: false, watched: false },
      { pattern: 'node_modules/rx/dist/rx.testing.js', served: true, included: false, watched: false },
      { pattern: 'node_modules/rx/dist/rx.virtualtime.js', served: true, included: false, watched: false },
      { pattern: 'node_modules/traceur/bin/traceur-runtime.js', served: true, included: false, watched: false },
      { pattern: 'node_modules/systemjs/dist/system.js', served: true, included: false, watched: false },
      { pattern: 'node_modules/systemjs/dist/system-polyfills.js', served: true, included: false, watched: false },
      { pattern: 'node_modules/es6-module-loader/dist/es6-module-loader.js', served: true, included: false, watched: false },
      { pattern: 'output/js/**/*.js', served: true, included: false, watched: true }
    ],

    systemjs: {
      // Path to your SystemJS configuration file
      configFile: 'output/system.config.js',

      config: {
        paths: {
          'angular-mocks': 'node_modules/angular-mocks/angular-mocks.js',
          'rx.testing': 'node_modules/rx/dist/rx.testing.js',
          'rx.virtualtime': 'node_modules/rx/dist/rx.virtualtime.js',
          'traceur': 'node_modules/traceur/bin/traceur-runtime.js',
          'systemjs': 'node_modules/systemjs/dist/system.js',
          'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
          'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js',
          '*': 'output/js/*'
        }
      }
    },

    // plugins: ['karma-mocha', 'karma-chai', 'karma-sinon', 'karma-systemjs', 'karma-chrome-launcher'],

    frameworks: ['mocha', 'chai', 'sinon', 'systemjs'],

    preprocessors: {
      'output/js/**/!(*.test).js': ['coverage']
    },

    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      reporters: [{
        type: 'json'
      }, {
          type: 'html'
        }, {
          type: 'text-summary'
        }],
      dir: 'output/coverage'
    },

    port: 9999,

    colors: true,

    //logLevel: config.LOG_DEBUG,
    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'], // Alternatively: 'PhantomJS'

    captureTimeout: 6000,

    singleRun: true

  });
};
