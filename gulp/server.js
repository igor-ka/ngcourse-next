'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var util = require('util');

var browserSync = require('browser-sync');

// var middleware = require('./proxy'); //TODO: residue from huge refactor
// middleware.push(require('connect-history-api-fallback'));

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === paths.src || (util.isArray(baseDir) && baseDir.indexOf(paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  browserSync.instance = browserSync.init(files, {
    startPath: '/',
    server: {
      baseDir: baseDir,
      //middleware: middleware,
      routes: routes
    },
    open: false
  });
}

gulp.task('serve-express', ['build'], function() {

  var express = require('express');
  var app = express();

  app.use(express.static('.tmp/partials'));
  app.use(express.static('.tmp/serve'));
  app.use('/bower_components', express.static('bower_components'));

  console.log("Dir: ", __dirname);

  var port = process.env.PORT || 3000;
  console.log('Listening on port: ', port);

  if (process.env.PORT) {
    console.log('Assuming app is running on heroku, server switch ignored');
    // Duplicate line because heroku seems to crash if you try to bind
    // to a variable as a hostname.
    app.listen(port);
  } else {
    app.listen(port);
  }
});

gulp.task('serve-express', ['build'], function() {

  var express = require('express');
  var app = express();

  app.use(express.static('.tmp/partials'));
  app.use(express.static('.tmp/serve'));
  app.use('/bower_components', express.static('bower_components'));

  console.log("Dir: ", __dirname);

  var port = process.env.PORT || 3000;
  console.log('Listening on port: ', port);

  if (process.env.PORT) {
    console.log('Assuming app is running on heroku, server switch ignored');
    // Duplicate line because heroku seems to crash if you try to bind
    // to a variable as a hostname.
    app.listen(port);
  } else {
    app.listen(port);
  }
});

gulp.task('serve', ['watch'], function () {
  browserSyncInit([
    paths.tmp + '/serve',
    paths.tmp + '/partials',
    paths.src
  ], [
    paths.tmp + '/serve/**/*.css',
    paths.tmp + '/partials/**/*.js',
    paths.src + '/**/*.js',
    paths.src + 'src/assets/images/**/*',
    paths.tmp + '/serve/*.html',
    paths.tmp + '/serve/**/*.js',
    paths.tmp + '/serve/**/*.html',
    paths.src + '/**/*.html'
  ]);
});

gulp.task('serve:e2e', /*['inject'],*/ function () {
  browserSyncInit([paths.tmp + '/serve', paths.src], null, []);
});