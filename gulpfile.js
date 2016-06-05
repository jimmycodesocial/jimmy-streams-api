/**
 * jimmycode-api
 * Copyright(c) 2016 Jimmy Code Social (http://jimmycode.com)
 */

'use strict';

var gulp = require('gulp');
var del = require('del');
var babel = require('gulp-babel');
var runSequence = require('run-sequence');

gulp.task('clean', function() {
  return del('./dist');
});

gulp.task('copy', function() {
  return gulp.src('config/**/*')
    .pipe(gulp.dest('dist/config/'));
});

gulp.task('compile', function() {
  return gulp.src('app/**/*')
    .pipe(babel())
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', function(callback) {
  return runSequence(
    ['clean'],
    ['compile'],
    ['copy'],
    callback
  );
});
