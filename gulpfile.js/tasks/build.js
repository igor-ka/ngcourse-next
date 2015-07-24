'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
    '!' + paths.src + '/index.html',
    '!' + paths.tmp + '/serve/index.html',
    paths.src + '/**/*.html',
    paths.tmp + '/**/*.html'
  ])
  .pipe($.minifyHtml({
    empty: true,
    spare: true,
    quotes: true
  }))
  .pipe($.angularTemplatecache('templateCacheHtml.js', {
    module: 'ngcourse.templates',
    standalone: true
  }))
  .pipe(gulp.dest(paths.tmp + '/partials/'));
});

gulp.task('clean', function () {
  $.del.sync(
    paths.tmp,
    {force: true}
  );
});

gulp.task('build', ['scripts', 'clean', 'inject', 'partials']);
