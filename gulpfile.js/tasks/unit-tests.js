'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var wiredep = require('wiredep');
var paths = gulp.paths;
var replace = require('gulp-replace');
var KarmaServer = require('karma').Server;

function runTests(singleRun) {

  var bowerDeps = wiredep({
    directory: 'bower_components',
    dependencies: true,
    devDependencies: true,
    exclude: [
      'bower_components/rxjs/dist/rx.lite.compat.min.js',
      'bower_components/rxjs/dist/rx.lite.compat.js',
      'bower_components/rxjs/dist/rx.lite.min.js',
      'bower_components/rxjs/dist/rx.lite.js',
      'bower_components/rxjs/dist/rx.compat.min.js',
      'bower_components/rxjs/dist/rx.compat.js',
      'bower_components/rxjs/dist/rx.min.js',
      'bower_components/rxjs/dist/rx.js'
      ]
  });

  var testFiles = bowerDeps.js.concat([
    'bower_components/es6-module-loader/dist/es6-module-loader.js',
    'bower_components/system.js/dist/system.js',
    'test-runner.js',
    //WARNING: do not include es6 transpiled modules, only serve them
    {pattern: '.tmp/serve/**/*.js', included: false},
    {pattern: '.tmp/serve/**/*.test.js', included: false},
    {pattern: '.tmp/partials/**/*.js', included: false}
  ]);

  return function (done) {
    new KarmaServer({
      configFile: '',
      files: testFiles,
      frameworks: ['mocha', 'chai', 'sinon'],
      reporters: ['story', 'coverage'],
      browsers: ['Chrome'],
      preprocessors: {
        './.tmp/**/!(*.test).js': 'coverage'
      },
      coverageReporter: {
        reporters: [{
          type: 'json'
        }, {
          type: 'html'
        }, {
          type: 'text-summary'
        }],
        dir: './coverage/'
      },
      singleRun: singleRun
    }, done).start();
  };

}

gulp.task('tidy', function(){
  gulp.src(['.tmp/**/*.js'],  {base: './'})
    .pipe(replace('if (typeof __decorate !== "function")', '/* istanbul ignore next */ if (typeof __decorate !== "function")'))
    .pipe(replace('if (typeof __param !== "function")', '/* istanbul ignore next */ if (typeof __param !== "function")'))
    .pipe(gulp.dest('./'))
});

gulp.task('ci-test-sequence', $.sequence('test', 'cover-karma'));

gulp.task('unit-test', ['tidy'], runTests(true));

gulp.task('test', $.sequence('lint', 'tidy', 'unit-test'));


/**
 * Continuous Test Watcher
 * To be used in Development
 * Note that it relies on gulp serve to be running
 */
gulp.task('test:auto', runTests(false));
