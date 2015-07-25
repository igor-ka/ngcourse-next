'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');

gulp.task('styles', function () {
  var src = [ 'src/**/*.scss', 'src/**/*.css' ];
  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'expanded'
    }))
    .on('error', notify.onError({
      title: 'Sass Compile Error',
      sound: 'Basso'
    }))
    .pipe($.concat('app' + '.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.tmp + '/serve/app/'))
    .pipe(browserSync.stream());
});
