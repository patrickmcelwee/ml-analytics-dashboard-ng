/*jshint node: true */
'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    minifyHtml = require('gulp-minify-html'),
    html2Js = require('gulp-ng-html2js'),
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
      './src/**/*.module.js',
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
  return gulp.src(['./src/styles/*.less', './src/styles/*.css'])
    .pipe(concat('ml-analytics-dashboard-ng.less'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('ml-analytics-dashboard-ng.css'))
    .pipe(less())
    .pipe(gulp.dest('dist'));
});

gulp.task('templates', function() {
  return gulp.src([ './src/**/*.html' ])
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    // TODO: ? prefix: '/ml-search'
    .pipe(html2Js({
      moduleName: 'ml.analyticsDashboard',
      prefix: '/'
    }))
    .pipe(concat('ml-analytics-dashboard-ng-templates.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('ml-analytics-dashboard-ng-templates.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['jshint', 'scripts', 'templates', 'styles']);
