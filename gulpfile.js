var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');
var babelify = require('babelify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
//var watchify = require('watchify');
//var concat = require('gulp-concat');

function getBundler() {
  return browserify({
    entries: ['./client/app/scripts/app.jsx'],
    transform: [babelify, reactify],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  });
}
gulp.task('browserify', function () {
  var bundler = getBundler();

  return bundler.bundle()
    .pipe(source('app.jsx'))
    .pipe(rename(function (path) {
      path.basename = 'dist';
      path.extname = '.js';
    }))
    .pipe(gulp.dest('./client/dist/scripts'));
});

gulp.task('browserify:watch', function () {
  return gulp.watch('./client/app/scripts/**/*', ['browserify']);
});

gulp.task('sass', function () {
  return gulp.src('./client/app/stylesheets/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./client/dist/stylesheets'));
});

gulp.task('sass:watch', function () {
  return gulp.watch('./client/app/stylesheets/*.scss', ['sass']);
});

gulp.task('copy', function () {
  return gulp.src('./client/app/index.html')
    .pipe(gulp.dest('./client/dist/'));
});

gulp.task('copy:watch', function () {
  return gulp.watch('./client/app/index.html', ['copy']);
});

gulp.task('watch', ['default', 'browserify:watch', 'sass:watch', 'copy:watch']);
gulp.task('default', ['browserify', 'sass', 'copy']);