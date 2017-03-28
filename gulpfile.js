var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var gulp = require('gulp');

gulp.task('pre-test', function () {
  return gulp.src(['src/**.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  return gulp.src(['test/test-*.js'])
    .pipe(mocha())
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 50 } }));
});

gulp.task('default', function() {
  gulp.start('test');
});