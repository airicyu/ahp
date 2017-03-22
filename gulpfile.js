var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var gulp = require('gulp');

gulp.task('pre-test', function () {
  return gulp.src(['src/**.js'])
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  return gulp.src(['test/test-*.js'])
    .pipe(mocha())
    // Creating the reports after tests ran
    .pipe(istanbul.writeReports())
    // Enforce a coverage of at least 90%
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 50 } }));
});

gulp.task('default', function() {
  gulp.start('test');
});