/**
 * @author Maciej Zasada
 */

// Imports.
var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins({
        lazy: true
    }),
    scsslint = require('gulp-scss-lint'),// For some reason doesn't work with gulp-load-plugins.
    config;
plugins.scsslint = scsslint;

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
    }
};

// Clean.
gulp.task('clean', function () {
    return gulp.src(config.dev.paths.tmp + '/**/*.*', {read: false})
        .pipe(plugins.clean());
});

// Coffeelint.
gulp.task('coffeelint', function () {
    return gulp.src('./' + config.dev.paths.root + '/scripts/**/*.coffee')
        .pipe(plugins.coffeelint({
            optFile: 'coffeelint.json'
        }))
        .pipe(plugins.coffeelint.reporter());
});

// SCSSlint.
gulp.task('scss-lint', function () {
    return gulp.src(config.dev.paths.root + '/styles/**/*.scss')
        .pipe(plugins.scsslint({
            config: 'scss-lint.yml'
        }));
});

// Coffee.
gulp.task('coffee', function () {
    return gulp.src(config.dev.paths.root + '/scripts/**/*.coffee')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.coffee())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(config.dev.paths.tmp + '/scripts'));
});

// Compass.
gulp.task('compass', function () {
    return gulp.src(config.dev.paths.root + '/styles/**/*.scss')
        .pipe(plugins.compass({
            config_file: 'config.rb',
            css: config.dev.paths.tmp + '/styles',
            sass: config.dev.paths.root + '/styles'
        }))
        .pipe(gulp.dest(config.dev.paths.tmp + '/styles'));
});

// Connect.
gulp.task('connect-dev', function () {
    return plugins.connect.server({
        root: [config.dev.paths.root, config.dev.paths.tmp],
        port: config.dev.port,
        host: '0.0.0.0',
        livereload: true
    });
});

gulp.task('connect-prod', function () {
    return plugins.connect.server({
        root: config.prod.paths.root,
        port: config.prod.port,
        host: '0.0.0.0',
        livereload: false
    });
});

// Open.
gulp.task('open-dev', function () {
    return gulp.src(config.dev.paths.root + '/index.html')
        .pipe(plugins.open('', {url: 'http://localhost:' + config.dev.port}));
});

gulp.task('open-prod', function () {
    return gulp.src(config.prod.paths.root + '/index.html')
        .pipe(plugins.open('', {url: 'http://localhost:' + config.prod.port}));
});

// Watch.
gulp.task('watch', function () {
    return console.log('watching');
});

// Bump.
gulp.task('bump-prod', function () {
    return gulp.src(['package.json', './bower.json'])
        .pipe(plugins.bump({type: 'build'}))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-minor', function () {
    return gulp.src(['package.json', './bower.json'])
        .pipe(plugins.bump({type: 'minor'}))
        .pipe(gulp.dest('./'));
});

// Proxies.
gulp.task('test', []);

gulp.task('validate', ['coffeelint', 'scss-lint', 'test']);

gulp.task('compile', ['coffee', 'compass']);

gulp.task('minify', []);

gulp.task('build-dev', function (cb) {
    plugins.runSequence('clean', ['validate', 'compile'], cb);
});

gulp.task('build-prod', function (cb) {
    plugins.runSequence('clean', ['validate', 'bump-prod', 'compile'], cb);
});

gulp.task('dev', function (cb) {
    plugins.runSequence(['build-dev', 'connect-dev'], ['open-dev', 'watch'], cb);
});

gulp.task('prod', function (cb) {
    plugins.runSequence(['build-prod', 'connect-prod'], 'open-prod');
});

gulp.task('default', ['prod']);
