'use strict';

let gulp = require('gulp');
let sass = require('gulp-sass');
let prefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
  gulp.src('./public/stylesheets/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(prefixer())
      .pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./public/stylesheets/*.scss', ['sass']);
});