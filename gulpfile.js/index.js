'use strict';

var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var Builder = require('systemjs-builder');
var del = require('del');
var ts = require('gulp-typescript');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

var browserSync = require('browser-sync').create();

gulp.task('serve', ['build'], function () {

  browserSync.init({
    server: {
      baseDir: ['output'],
      routes: {
        "/node_modules": "node_modules"
      }
    },
    files: ['output/**/*'],
    port: 8080,
    open: false
  });

  gulp.watch('source/css/*.css',['css']);
  gulp.watch('source/index.html', ['html']);
  gulp.watch('source/*.config.js', ['config']);
  gulp.watch('source/ts/**/*.html', ['template-cache']);
  gulp.watch('source/ts/**/*.ts', ['compile']);
});

gulp.task('build', ['html', 'template-cache', 'css', 'config', 'compile']);

gulp.task('bundle', function () {

  var builder = new Builder();
  builder.reset();

  builder.loadConfig("output/system.config.js")
    .then(function () {
      // builder.config({
      //   map: {
      //     'app': './output/js/app'
      //   }
      // });

      return builder.buildSFX('app', 'output/bundle/app.js');
    })
    .then(function () {
      console.log('Build complete');
      cb();
    })
    .catch(function (err) {
      console.log(err);
      cb(err);
    });
});

gulp.task('html', function () {
  return gulp.src('source/index.html', { base: 'source' })
    .pipe(gulp.dest('output/'));
});

gulp.task('template-cache', function () {

  return gulp.src([
    '!source/index.html',
    'source/ts/**/*.html'
  ])
    .pipe(templateCache('template-cache.js', {
      module: 'ngcourse.templates',
      standalone: true
    }))
    .pipe(gulp.dest('output/js/template-cache'));

});

gulp.task('css', function () {
  return gulp.src('source/**/*.css',
    { base: 'source/css' })
    .pipe(gulp.dest('output/css'));
});

gulp.task('config', function () {
  return gulp.src(['source/system.config.js'])
    .pipe(gulp.dest('output'));
});

gulp.task('compile', function () {
  var tsProject = ts.createProject('tsconfig.json');
  var tsResult = tsProject.src()
    .pipe(ts(tsProject));

  return tsResult.js
    .pipe(rename(function (path) {
      path.dirname = path.dirname.replace('source/ts', 'js');
    }))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('../js', {addComment: false}))
    .pipe(gulp.dest('output'));
});

gulp.task('clean', ['clean:output']);

gulp.task('clean:output', function () {
  del([
    'output/**/*'
  ]);
});
