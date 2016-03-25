/*jshint node: true */
'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint');

gulp.task('jshint', function() {
  gulp.src([
      './gulpfile.js',
      './src/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  return gulp.src([
      './src/ml-analytics-dashboard-ng.js',
      './src/**/*.service.js',
      './src/**/*.directive.js',
      './src/**/*.js'
    ])
    .pipe(concat('ml-analytics-dashboard-ng.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('ml-analytics-dashboard-ng.min.js'))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
  return gulp.src('./src/styles/*.less')
    .pipe(concat('ml-uploader.less'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('ml-uploader.css'))
    .pipe(less())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['jshint', 'scripts', 'styles']);
