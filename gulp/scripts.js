'use strict';

var gulp = require('gulp');
var ngConstant = require('gulp-ng-constant');
var Builder = require('systemjs-builder');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

gulp.task('scripts', function (done) {

  return gulp.src(paths.src + '/**/*.ts')
    .pipe($.sourcemaps.init())
    .pipe($.typescript({
      module: 'amd',
      typescript: require('typescript'),
      target: 'ES5'
    }))
    .on('error', function handleError(err) {
      this.emit('end');
    })
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.tmp + '/serve/'))
    //.pipe($.size());
});

gulp.task('clean:tmp', function (done) {

  // Disable Scripts Work-around (Designer Mode)
  if (process.env.DMODE === 'true') {
    done();
    return;
  }

  $.del([
    paths.tmp + '/serve/**/*.js'
  ], { force: true } , done );

});
