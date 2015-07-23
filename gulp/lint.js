'use strict';

var gulp = require('gulp');
var paths = gulp.paths;
var $ = require('gulp-load-plugins')();
var access = require('gulp-accessibility');

/**
 * WCAG Linting
 */
gulp.task('wcag-lint', function() {
  return gulp.src(paths.src + '/**/*.html')
    .pipe(access({
        accessibilityLevel: 'WCAG2A',
        reportLevels: {
          notice: false,
          warning: false,
          error: true
        },
        reportType: 'json',
        reportLocation : 'wcag-lint-reports',
        verbose: false
    }));
});

/**
 * SCSS Linting
 */
gulp.task('scss-lint', function () {
  return gulp.src(paths.sass)
    .pipe($.scssLint())
    .pipe($.scssLint.failReporter());
});

/**
 * TypeScript Linting
 */
gulp.task('lint', function () {
  return gulp.src(paths.ts)
    .pipe($.tslint({
      configuration: {
        rules: {
          curly: true,
          semicolon: true,
          'use-strict': true,
          'variable-name': 'allow-leading-underscore'
        }
      }
    }))
    .pipe($.tslint.report('verbose'));
});

/**
 * Typecript Build Lint Task
 */
gulp.task('lint:build', function () {
  return gulp.src(paths.ts)
    .pipe($.tslint())
    .pipe($.tslint.report('verbose'))
//    .pipe($.tslint.failOnError());
});
