/*eslint-disable*/
var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var rename = require('gulp-rename');

var pkg = require('./package.json');
var NAME = pkg.name;
var BANNER = ['/**',
    ' * <%= pkg.name %>',
    ' * @author <%= pkg.author %>',
    ' * @version v<%= pkg.version %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

var BUNDLE_PATH = './dist/';

gulp.task('connect', function() {
    connect.server();
});

gulp.task('bundle', function() {
    var b = browserify({
        entries: 'index.js',
        debug: true
    });

    return b.bundle()
        .on('error', function(err) {
            console.log(err.message);
            this.emit('end');
        })
        .pipe(source(NAME + '.js'))
        .pipe(buffer())
        .pipe(header(BANNER, {pkg: pkg}))
        .pipe(gulp.dest(BUNDLE_PATH))
        .pipe(uglify())
        .pipe(rename(NAME + '.min.js'))
        .pipe(header(BANNER, {pkg: pkg}))
        .pipe(gulp.dest(BUNDLE_PATH));
});
