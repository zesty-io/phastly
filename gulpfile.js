'use strict'

var gulp  = require('gulp')
var babel = require('gulp-babel')
var cache = require('gulp-cached')
var del   = require('del')

gulp.task('default', ['buildwipe', 'buildsrc'])

gulp.task('buildsrc', function() {
  return gulp.src('src/**/*.js')
  .pipe(cache('transpiling'))
  // .pipe(babel({ plugins: ['syntax-async-functions', 'transform-runtime', 'transform-es2015-modules-commonjs'],
  .pipe(babel({
    presets: ['es2016-node4', 'stage-3']
  }))
  .pipe(gulp.dest('build'))
})

gulp.task('buildwipe', function() {
  return del.sync(['build/**', '!build', '!build/.gitignore'])
})

gulp.task('watch', function() {
  gulp.watch(['./src/**/*.js'], ['buildsrc'])
})
