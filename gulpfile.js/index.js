var gulp = require('gulp');
var gulpFilter = require('gulp-filter');
var tslint = require('gulp-tslint');
var fs = require('fs');
var inject = require('gulp-inject');
var beautify = require('gulp-js-beautify');
var karma = require('gulp-karma');
var mocha = require('gulp-mocha');
var protractor = require('gulp-protractor').protractor;
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var util = require('gulp-util');
var plumber = require('gulp-plumber');
var del = require('del');
var karmaFiles = [

];

var clientFiles = 'client/app/**/*.js';
var tsClientFiles = 'client/app/**/*.ts';

var skipTestFiles = gulpFilter(function (file) {
  return !/\.test\.ts$/.test(file.path) && !/testing/.test(file.path);
});

// gulp.task('beautify', function () {
//   var jsBeautifyConfig = JSON.parse(fs.readFileSync('.jsbeautifyrc'));
//   return gulp.src(clientFiles, { base: '.' })
//     .pipe(beautify(jsBeautifyConfig))
//     .pipe(gulp.dest('.'));
// });

// gulp.task('karma', ['ts-compile'], function () {
//   return gulp.src(karmaFiles)
//     .pipe(karma({
//     configFile: 'karma.conf.js',
//     action: 'run'
//   }))
//     .on('error', function (err) {
//     throw err;
//   });
// });

// gulp.task('start-karma-watcher', function () {
//   gulp.src(karmaFiles)
//     .pipe(karma({
//     configFile: 'karma.conf.js',
//     action: 'watch'
//   }));
// });

// gulp.task('karma-watch', ['start-karma-watcher'], function () {
//   return gulp.watch('./client/**/*.ts', ['ts-compile']);
// });

// gulp.task('api-test', function () {
//   return gulp.src('server/testing/*.js')
//     .pipe(mocha({
//     reporter: 'nyan'
//   }))
//     .on('end', function () {
//     console.log('Done');
//   });
// });

// gulp.task('protractor', function () {
//   var files = ['client/testing/scenarios/*.scenario.js'];
//   return gulp.src(files)
//     .pipe(protractor({
//     configFile: 'client/testing/protractor.conf.js'
//   }))
//     .on('error', function (err) {
//     // Make sure failed tests cause gulp to exit non-zero
//     throw err;
//   })
//     .on('end', function () {
//     console.log('Done');
//   });
// });

var destinationFolder = 'client/dist';

gulp.task('clean', function (done) {
  del(destinationFolder, done);
});

gulp.task('ts-lint', function () {
  return gulp.src(tsClientFiles)
    .pipe(skipTestFiles)
    .on('error', handleError)
    .pipe(tslint())
    .on('error', handleError)
    .pipe(tslint.report('prose'));
});

function handleError(err) {
  util.log(err.toString());
  this.emit('end');
}

gulp.task('ts-compile', function () {

  return gulp.src(tsClientFiles)
    .pipe(skipTestFiles)
    .on('error', handleError)
    .pipe(sourcemaps.init())
    .pipe(ts({
        typescript: require('typescript'),
        module: 'amd',
        target: 'ES5',
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        noImplicitAny: false,
        sortOutput: true
      }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(destinationFolder));
});

gulp.task('html', function () {
  return gulp.src('client/app/**/*.html')
    .pipe(gulp.dest(destinationFolder));
});

gulp.task('watch', ['clean', 'build'], function () {
  gulp.watch(tsClientFiles, ['build']);
});

gulp.task('build', ['ts-lint', 'ts-compile', 'html']);

gulp.task('default', ['build']);

gulp.paths = {
  client: 'client',
  src: 'client',
  ts_src: 'client/app/**/*.ts',
  dist: 'client/dist'
};

require('require-dir')('./dev');
