'use strict';

var gulp = require('gulp');
var paths = gulp.paths;

gulp.task('watch', ['inject'], function () {
  gulp.watch([
    paths.src + '/**/*.html',
    'bower.json'
  ], ['inject', 'html', 'partials']);

  gulp.watch(paths.src + '/**/*.scss', ['styles']);

  gulp.watch(paths.src + '/**/*.ts', ['scripts']);

});