'use strict';

var gulp = require('gulp');
var run = require('gulp-run');
var templateCache = require('gulp-angular-templatecache');
var Builder = require('systemjs-builder');

var browserSync = require('browser-sync').create();

gulp.task('serve', function () {

  browserSync.init({
    server: {
      baseDir: ['output'],
      routes: {
        "/node_modules": "node_modules",
        "/bower_components": "bower_components"
      }
    },
    port: 8080,
    open: false
  });

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
  return gulp.src(['source/system.config.js', 'source/system.config.test.js'])
    .pipe(gulp.dest('output'));
});

gulp.task('compile', function () {
  run('tsc').exec();
});

// gulp.paths = {
//   src: 'app/src',
//   dist: 'dist',
//   tmp: 'www',
//   e2e: 'e2e',
//   js: 'src/**/*.js',
//   sass: 'src/**/*.scss',
//   ts: 'app/src/**/*.ts'
// };

//require('require-dir')('./tasks');

// gulp.task('default', ['clean'], function () {
//     gulp.start('build');
// });
