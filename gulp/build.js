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

gulp.task('html', ['clean', 'inject', 'partials'], function () {
  return gulp.src(paths.src + '/index.html')
    .pipe(gulp.dest(gulp.tmp + '/'))
    //.pipe($.size({ showFiles: true }));
});

gulp.task('images', ['clean'], function () {
  return gulp.src(paths.src + '/assets/images/**/*')
    .pipe(gulp.dest(paths.tmp + '/assets/images/'));
});

gulp.task('icons', ['clean'], function () {
  return gulp.src(paths.src + '/app/icons/**/*')
  .pipe(gulp.dest(paths.tmp + '/serve/app/icons/'));
});

gulp.task('clean', function (done) {
  $.del( paths.tmp, done);
});

gulp.task('build', ['scripts', 'html', 'icons', 'images'], function () {
  return gulp.src(paths.tmp + '/**/*.*')
    .pipe($.size());
});