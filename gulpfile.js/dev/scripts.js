'use strict';

var gulp = require('gulp');
var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

gulp.task('scripts', function (done) {

  return gulp.src(paths.ts_src)
    .pipe($.sourcemaps.init())
    .pipe($.typescript({
      module: 'amd',
      typescript: require('typescript'),
      target: 'ES5'
    }).on('error', $.util.log))
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.dist))
    .pipe($.size());
});

gulp.task('clean:tmp', function (done) {
  $.del([ paths.dist ], { force: true } , done );
});
