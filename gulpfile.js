'use strict';

let gulp = require('gulp');
let sass = require('gulp-sass');

gulp.task('sass', function () {
  gulp.src('./public/stylesheets/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./public/stylesheets/*.scss', ['sass']);
});