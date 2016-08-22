/*jshint node: true */
'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    minifyHtml = require('gulp-minify-html'),
    html2Js = require('gulp-ng-html2js'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    templateCache = require('gulp-angular-templatecache'),
    del = require('del');

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

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *  gulp test --startServers
 * @param  {Function} done - callback when complete
 */
gulp.task('test', ['jshint', 'templatecache'], function(done) {
  startTests(true /*singleRun*/, done);
});

function startTests(singleRun, done) {
  var child;
  var excludeFiles = [];
  var Server = require('karma').Server;

  new Server({
    configFile: __dirname + '/karma.conf.js',
    exclude: excludeFiles,
    singleRun: !!singleRun
  }, karmaCompleted).start();
  ////////////////

  function karmaCompleted(karmaResult) {
    if (child) {
      child.kill();
    }
    if (karmaResult === 1) {
      done(new Error('karma: tests failed with code ' + karmaResult));
    } else {
      done();
    }
  }
}

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', ['clean-code'], function() {
  return gulp
    .src('src/**/*.html')
    .pipe(templateCache(
      'templates.js',
      {
        module: 'ml.analyticsDashboard',
        transformUrl: function (url) {return '/' + url;}
      }
      ))
    .pipe(gulp.dest('./.tmp/'));
});

/**
 * Remove all js and html from the build and temp folders
 * @return {Stream}
 */
gulp.task('clean-code', function() {
  var files = [].concat(
    './.tmp/**/*.js'
  );
  return del(files);
});

gulp.task('default', ['jshint', 'test', 'scripts', 'templates', 'styles']);
