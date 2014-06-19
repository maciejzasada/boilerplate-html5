/**
 * @author Maciej Zasada
 */

// Imports.
var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins({
        lazy: true
    }),

// Config.
    config = {
        dev: {
            port: 8080,
            paths: {
                root: 'app',
                tmp: '.tmp'
            }
        },
        prod: {
            port: 8081,
            paths: {
                root: 'dist'
            }
        },
        tmpFolder: '.tmp'
    },

    getSuffixedTaskList = function (tasks, suffix) {
        return tasks.map(function (task) {
            return task + suffix;
        });
    };

// Open.
gulp.task('open-dev', function () {
    gulp.src('./' + config.dev.paths.root + '/index.html')
        .pipe(plugins.open('', {url: 'http://localhost:' + config.dev.port}));
});

gulp.task('open-prod', function () {
    gulp.src('./' + config.prod.paths.root + '/index.html')
        .pipe(plugins.open('', {url: 'http://localhost:' + config.prod.port}));
});

// Connect.
gulp.task('connect-dev', function () {
    plugins.connect.server({
        root: [config.dev.paths.root, config.dev.paths.tmp],
        port: config.dev.port,
        host: '0.0.0.0',
        livereload: true
    });
});

gulp.task('connect-prod', function () {
    plugins.connect.server({
        root: config.prod.paths.root,
        port: config.prod.port,
        host: '0.0.0.0',
        livereload: false
    });
});

// Bump.
gulp.task('bump-prod', function () {
    gulp.src(['./package.json', './bower.json'])
        .pipe(plugins.bump({type: 'build'}))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-minor', function () {
    gulp.src(['./package.json', './bower.json'])
        .pipe(plugins.bump({type: 'minor'}))
        .pipe(gulp.dest('./'));
});

// Proxies.
gulp.task('dev', getSuffixedTaskList(['connect', 'open'], '-dev'));

gulp.task('dist', getSuffixedTaskList(['bump'], '-prod'));

gulp.task('default', ['dev']);
