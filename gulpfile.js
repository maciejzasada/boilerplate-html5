/**
 * @author Maciej Zasada
 */

// Imports.
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    path = require('path'),
    extend = require('extend'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins({
        lazy: true
    }),
    scsslint = require('gulp-scss-lint'),// For some reason doesn't work with gulp-load-plugins.
    config,
    jadeData;
plugins.scsslint = scsslint;

// Config.
config = {
    dev: {
        port: 8080,
        paths: {
            root: './app',
            tmp: './.tmp'
        }
    },
    prod: {
        port: 8081,
        paths: {
            root: './dist'
        }
    }
};

// Clean.
gulp.task('clean', function () {
    return gulp.src([config.dev.paths.tmp + '/**/*', config.prod.paths.root + '/**/*'], {read: false})
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

// Jade.
var getJadeData = function (env, cb) {
    var data = JSON.parse(fs.readFileSync(config.dev.paths.root + '/jade-data/default.json')),
        bowerFiles = [],
        scripts = [],
        toDo = 2,
        done = function () {
            jadeData = data;
            cb();
        };

    // Prepare data as the defaults extended with dev.
    extend(true, data, JSON.parse(fs.readFileSync(config.dev.paths.root + '/jade-data/' + env + '.json')));

    // Read dependencies.
    plugins.bowerFiles()
        .pipe(gutil.buffer(function (err, files) {
            bowerFiles = files.map(function (file) {
                return path.relative(config.dev.paths.root, file.path)
            });
            extend(true, data, {dependencies: {bower: bowerFiles}});
            if (--toDo === 0) {
                done();
            }
        }))
        .pipe(gulp.src(config.dev.paths.tmp + '/scripts/**/*.js'))
        .pipe(gutil.buffer(function (err, files) {
            scripts = files.map(function (file) {
                return path.relative(config.dev.paths.tmp, file.path)
            });
            extend(true, data, {dependencies: {scripts: scripts}});
            if (--toDo === 0) {
                done();
            }
        }));
};

gulp.task('jade-data-dev', function (cb) {
    getJadeData('dev', cb);
});

gulp.task('jade-data-prod', function (cb) {
    getJadeData('prod', cb);
});

gulp.task('jade-dev', ['jade-data-dev'], function () {
    return gulp.src([config.dev.paths.root + '/**/*.jade', '!' + config.dev.paths.root + '/templates/**/*'])
        .pipe(plugins.jade({
            pretty: true,
            data: jadeData
        }))
        .pipe(gulp.dest(config.dev.paths.tmp))
        .pipe(plugins.connect.reload());
});

gulp.task('jade-prod', ['jade-data-prod'], function () {
    return gulp.src(config.dev.paths.root + '/**/*.jade')
        .pipe(plugins.jade({
            pretty: false,
            data: jadeData
        }))
        .pipe(gulp.dest(config.dev.paths.tmp));
});

// Coffee.
gulp.task('coffee', function () {
    return gulp.src(config.dev.paths.root + '/scripts/**/*.coffee')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.coffee())
        .pipe(plugins.sourcemaps.write({sourceRoot: '/scripts'}))
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

// Copy.
gulp.task('copy', function () {
    return gulp.src(config.dev.paths.tmp + '/styles/**/*')
        .pipe(gulp.dest(config.prod.paths.root + '/styles'));
});

// Ng-min.
gulp.task('ng-min', function () {
    return gulp.src(config.dev.paths.tmp + '/scripts/app.js')
        .pipe(plugins.ngmin({dynamic: true}))
        .pipe(gulp.dest(config.prod.paths.root + '/scripts'));
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
    return gulp.src('./gulpfile.js')
        .pipe(plugins.open('', {url: 'http://localhost:' + config.dev.port}));
});

gulp.task('open-prod', function () {
    return gulp.src('./gulpfile.js')
        .pipe(plugins.open('', {url: 'http://localhost:' + config.prod.port}));
});

// Watch.
gulp.task('watch', function () {
    // Scss.
    gulp.src(config.dev.paths.root + '/styles/**/*.scss', {read: false})
        .pipe(plugins.watch())
        .pipe(plugins.plumber())
        .pipe(plugins.scsslint({
            config: 'scss-lint.yml'
        }))
        .pipe(plugins.compass({
            config_file: 'config.rb',
            css: config.dev.paths.tmp + '/styles',
            sass: config.dev.paths.root + '/styles'
        }))
        .pipe(plugins.connect.reload());

    // Coffee.
    gulp.src(config.dev.paths.root + '/scripts/**/*.coffee', {read: false})
        .pipe(plugins.watch())
        .pipe(plugins.plumber())
        .pipe(plugins.coffeelint({
            optFile: 'coffeelint.json'
        }))
        .pipe(plugins.coffeelint.reporter())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.coffee())
        .pipe(plugins.sourcemaps.write({sourceRoot: config.dev.paths.root + '/scripts'}))
        .pipe(gulp.dest(config.dev.paths.tmp + '/scripts'))
        .pipe(plugins.connect.reload());

    // Jade.
    gulp.src(config.dev.paths.root + '/**/*.jade', {read: false})
        .pipe(plugins.watch(function(files) {
            return gulp.src([config.dev.paths.root + '/**/*.jade', '!' + config.dev.paths.root + '/templates/**/*'])
                .pipe(plugins.jade({
                    pretty: true,
                    data: jadeData
                }))
                .pipe(gulp.dest(config.dev.paths.tmp))
                .pipe(plugins.connect.reload());
        }));

    // Jade-data.
    gulp.src(config.dev.paths.root + '/jade-data/**/*.json', {read: false})
        .pipe(plugins.watch({}, function (files) {
            return gulp.run('jade-dev');
        }));
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
gulp.task('dev', function (cb) {
    plugins.runSequence(
        'clean',
        ['coffeelint', 'scss-lint', 'coffee', 'compass', 'connect-dev'],
        'jade-dev',
        ['open-dev', 'watch'],
        cb
    );
});

gulp.task('prod', function (cb) {
    plugins.runSequence(
        'clean',
        ['coffeelint', 'scss-lint', 'coffee', 'compass', 'connect-prod'],
        'jade-prod',
        ['copy', 'ng-min'],
        ['open-prod'],
        cb
    );
});

gulp.task('default', ['prod']);
