'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var browserSync = require('browser-sync');

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  browserSync.instance = browserSync.init(files, {
    startPath: '/',
    server: {
      baseDir: baseDir
    },
    open: false
  });
}

gulp.task('serve', ['watch'], function () {
  browserSyncInit([
    paths.client
  ], []);
});
