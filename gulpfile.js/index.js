'use strict';

var gulp = require('gulp');

gulp.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  js: 'src/**/*.js',
  sass: 'src/**/*.scss',
  ts: 'src/**/*.ts'
};

require('require-dir')('./tasks');

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
