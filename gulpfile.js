/*
 * @Author: mengxuying 
 * @Date: 2018-11-27 19:59:16 
 * @Last Modified by: mengxuying
 * @Last Modified time: 2018-11-27 20:22:55
 */

var gulp = require('gulp');

var sass = require('gulp-sass');

var server = require('gulp-webserver');

var url = require('url');

var fs = require('fs');

var path = require('path');

var bodyparser = require('body-parser');

gulp.task('devCss', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'))
});

gulp.task('watch', function() {
    gulp.watch('./src/scss/*.scss', gulp.series('devCss'))
})

gulp.task('server', function() {
    return gulp.src('src')
        .pipe(server({
            port: 9090,
            middleware: [bodyparser.urlencoded({ extended: false }), function(req, res, next) {
                if (req.url === '/favicon.ico') {
                    res.end('');
                } else {
                    var pathname = url.parse(req.url).pathname;

                    if (pathname === '/api/render') {
                        res.end('');
                    } else {
                        pathname = pathname === '/' ? '/index.html' : pathname;
                        res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                    }
                }


            }]
        }))
})

gulp.task('dev', gulp.series('devCss', 'server', 'watch'));