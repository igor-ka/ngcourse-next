'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var paths = gulp.paths;

gulp.task('watch', function () {
  gulp.watch([
    paths.src + '/**/*.html',
    'bower.json'
  ], ['inject', 'partials']);

  // TODO styles compilation
  // this should not trigger full refresh
  //gulp.watch(paths.src + '/**/*.scss', ['styles']);

  gulp.watch([
    paths.src + '/**/*.ts',
    'client/app/loader.config.js'
  ], ['reload']);

});

gulp.task('reload', ['scripts'], function (done) {
  browserSync.reload();
  done();
});
