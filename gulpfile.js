'use strict';

var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var Builder = require('systemjs-builder');
var KarmaServer = require('karma').Server;
var del = require('del');
var ts = require('gulp-typescript');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var minifyCss = require('gulp-minify-css');
var concatCss = require('gulp-concat-css');
var tslint = require('gulp-tslint');
var size = require('gulp-size');
var webdriver = require('gulp-webdriver');
var selenium = require('selenium-standalone');

gulp.task('default', ['build']);

gulp.task('build', ['clean', 'html', 'template-cache', 'css', 'config', 'compile', 'tidy', 'lint']);

gulp.task('clean', function () {
  del.sync([
    'output/**/*',
    'output'
  ]);
});

gulp.task('html', function () {
  return gulp.src('source/index.html', { base: 'source' })
    .pipe(gulp.dest('output/'))
    .pipe(replace('<link href="/node_modules/basscss/css/basscss.css" rel="stylesheet" type="text/css"/>', ''))
    .pipe(replace('<link href="/node_modules/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css"/>', ''))
    .pipe(replace('<link href="/css/styles.css" rel="stylesheet" type="text/css" />', '<link href="/styles.min.css" rel="stylesheet" type="text/css" />'))
    .pipe(replace('<script src="/node_modules/systemjs/dist/system.js"></script>', ''))
    .pipe(replace('<script src="/system.config.js"></script>', ''))
    .pipe(replace('<script>System.import(\'js/app\');</script>', '<script src="/app.min.js"></script>'))
    .pipe(gulp.dest('output/dist/'));
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
    .pipe(size({title: 'Template Cache Size:'}))
    .pipe(gulp.dest('output/js/'));

});

gulp.task('css', function () {
  gulp.src('source/**/*.css',
    { base: 'source/css' })
    .pipe(gulp.dest('output/css'));
    
  return gulp.src([
    'output/css/styles.css',
    'node_modules/basscss/css/basscss.css',
    'node_modules/font-awesome/css/font-awesome.css'
  ])
  .pipe(concatCss('styles.min.css'))
  .pipe(minifyCss({compatibility: 'ie8'}))
  .pipe(gulp.dest('output/dist/'));
});

gulp.task('config', function () {
  return gulp.src(['source/system.config.js'])
    .pipe(gulp.dest('output'));
});

gulp.task('tidy', ['compile'], function(done) {
  
  return gulp.src(['./output/js/**/*.js'],  {base: './'})
    .pipe(replace('var __decorate = (this && this.__decorate)', '/* istanbul ignore next */ var __decorate = (this && this.__decorate)'))
    .pipe(replace('var __metadata = (this && this.__metadata)', '/* istanbul ignore next */ var __metadata = (this && this.__metadata)'))
    .pipe(replace('var __param = (this && this.__param)', '/* istanbul ignore next */ var __param = (this && this.__param)'))
    .pipe(gulp.dest('./'))

});

gulp.task('lint', function(){
  return gulp.src('source/ts/**/*.ts')
    .pipe(
      tslint({
        configuration: "tslint.json"
      })
    )
    .pipe(tslint.report("verbose"))
    .on('error', function handleError(err) {
      this.emit('end');
    });
});

gulp.task('compile', ['lint'], function (done) {
  
  var tsProject = ts.createProject('tsconfig.json', {
    typescript: require('typescript')
  });
  
  var tsResult = tsProject.src()
    .pipe(sourcemaps.init({debug: true}))
    .pipe(ts(tsProject));

  // the files are being renamed here so as not to go to
  // ./output/js/source/ts but straight into ./output/js/
  // preserving the original directory structure otherwise
  return tsResult.js
    .pipe(rename(function (path) {
      path.dirname = path.dirname.replace('source/ts', 'js');
      path.dirname = path.dirname.replace('source\\ts', 'js'); //windows fix
    }))
    .pipe(size({title: 'JS Size:'}))
    .pipe(sourcemaps.write({sourceRoot: '/'}))
    .pipe(gulp.dest('output'));
    
  // var exec = require('child_process').exec;
  
  // exec('tsc', function(error, stdOut, stdErr) {
  //   if (error) {
  //     console.log(stdOut);
  //   }
    
  //   return done();
  // });
  
});

gulp.task('fonts', function() {

  return gulp.src('node_modules/font-awesome/fonts/**/*')
    .pipe(gulp.dest('output/dist/font-awesome/fonts/'));
  
});


gulp.task('bundle', ['build', 'fonts'], function (done) {
  
  var builder = new Builder();
    
  builder.loadConfig('source/system.config.js')
  .then(function() {
    return builder.buildStatic(
      'output/js/app', 
      'output/dist/app.min.js', 
      { minify: true, mangle: false, runtime: false }
    );
  })
  .then(function () {
    return gulp.src('output/dist/**/*').pipe(size({title: 'Distribution Size:'}));
  })
  .then(function () {
    return done();
  })
  .catch(function (err) {
    return done(err);
  });
  
});

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

  gulp.watch('source/css/*.css', ['css']);
  gulp.watch('source/index.html', ['html']);
  gulp.watch('source/*.config.js', ['config']);
  gulp.watch('source/ts/**/*.html', ['template-cache']);
  gulp.watch('source/ts/**/*.ts', ['compile']);
  
});

gulp.task('karma', ['build'], function (done) {
  
   new KarmaServer({
      configFile: __dirname + '/karma.conf.js',
   }, done)
   .start();
});

// Runs end-to-end tests using webdriverio and selenium against
// a local application instance.
gulp.task('e2e', ['selenium', 'serve'], function (done) {
  return gulp.src('wdio.conf.js')
    .pipe(webdriver({
      desiredCapabilities: {
        browserName: 'chrome'
      }
    }))
    .once('end', function () {
      selenium.child.kill();
      browserSync.exit();
      process.exit();
    });
});

// Start up a selenium server for e2e testing.
gulp.task('selenium', function (done) {
  selenium.install({
    logger: function (message) { }
  }, function (err) {
    if (err) return done(err);

    selenium.start(function (err, child) {
      if (err) return done(err);
      selenium.child = child;
      done();
    });
  });
});
