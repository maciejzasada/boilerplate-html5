/**
 * @author Maciej Zasada
 */

// Imports.
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync'),
    fs = require('fs'),
    path = require('path'),
    extend = require('extend'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    $ = gulpLoadPlugins({
        lazy: true
    }),
    scsslint = require('gulp-scss-lint'),   // For some reason doesn't work with gulp-load-$.
    ngHtml2Js = require('gulp-ng-html2js'), // For some reason doesn't work with gulp-load-$.
    revReplace = require('gulp-rev-replace'),
    config,
    jadeData,
    versionData;
$.scsslint = scsslint;
$.ngHtml2Js = ngHtml2Js;
$.revReplace = revReplace;
$.browserSync = browserSync;

// Config.
config = {
    dev: {
        paths: {
            root: './app',
            tmp: './.tmp'
        }
    },
    prod: {
        host: '0.0.0.0',
        port: 8081,
        paths: {
            root: './dist'
        }
    }
};

// Clean.
gulp.task('clean', function () {
    return gulp.src([config.dev.paths.tmp + '/**/*', config.prod.paths.root + '/**/*'], {read: false})
        .pipe($.clean());
});

// Bower.
gulp.task('bower', function () {
    return $.bower()
        .pipe(gulp.dest(config.dev.paths.root + '/bower_components'));
});

// Bump.
gulp.task('bump-prod', function () {
    return gulp.src(['package.json', './bower.json'])
        .pipe($.bump({type: 'build'}))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-minor', function () {
    return gulp.src(['package.json', './bower.json'])
        .pipe($.bump({type: 'minor'}))
        .pipe(gulp.dest('./'));
});

// Scripts.
gulp.task('version-read', function (cb) {
    var versionString = JSON.parse(fs.readFileSync('./package.json')).version,
        components = versionString.split('.');
    versionData = {
        major: components[0],
        minor: components[1],
        build: components[2],
        string: versionString
    };
    cb();
});

gulp.task('scripts-dev', ['version-read'], function () {
    var filterConfig = $.filter('**/config/default.coffee');
    return gulp.src(config.dev.paths.root + '/scripts/**/*.coffee')
        .pipe(filterConfig)
        .pipe($.replace('{{versionMajor}}', versionData.major))
        .pipe($.replace('{{versionMinor}}', versionData.minor))
        .pipe($.replace('{{versionBuild}}', versionData.build))
        .pipe($.replace('{{versionString}}', versionData.string))
        .pipe(filterConfig.restore())
        .pipe($.coffeelint({
            optFile: 'coffeelint.json'
        }))
        .pipe($.coffeelint.reporter())
        .pipe($.sourcemaps.init())
        .pipe($.coffee())
        .pipe($.sourcemaps.write({sourceRoot: '/scripts'}))
        .pipe(gulp.dest(config.dev.paths.tmp + '/scripts'));
});

gulp.task('bower-prod', function () {
    var filterLegacy = $.filter(['**/es5-shim/**/*', '**/json3/**/*']),
        filterOther = $.filter(['!**/es5-shim/**/*', '!**/json3/**/*']);
    return $.bowerFiles()
        .pipe(filterOther)
        .pipe($.concat('vendor.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(config.prod.paths.root + '/scripts'))
        .pipe(filterOther.restore())
        .pipe(filterLegacy)
        .pipe($.concat('legacy.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(config.prod.paths.root + '/scripts'));
});

gulp.task('scripts-prod', ['bower-prod', 'bump-prod', 'version-read'], function () {
    var filterConfig = $.filter('**/config/default.coffee');
    return gulp.src(config.dev.paths.root + '/scripts/**/*.coffee')
        .pipe(filterConfig)
        .pipe($.replace('{{versionMajor}}', versionData.major))
        .pipe($.replace('{{versionMinor}}', versionData.minor))
        .pipe($.replace('{{versionBuild}}', versionData.build))
        .pipe($.replace('{{versionString}}', versionData.string))
        .pipe(filterConfig.restore())
        .pipe($.coffeelint({
            optFile: 'coffeelint.json'
        }))
        .pipe($.coffeelint.reporter())
        .pipe($.coffee())
        .pipe($.concat('app.js'))
        .pipe($.ngmin({dynamic: false}))
        .pipe($.uglify())
        .pipe(gulp.dest(config.prod.paths.root + '/scripts'));
});

// Styles.
var scssReporter = function (file) {
    if (file.scsslint.success) {
        gutil.log(gutil.colors.cyan('scss-lint:'), '[' + gutil.colors.green('clean') + ']', '[' + path.relative('./app/styles', file.path) + ']');
    } else {
        for (var i = 0; i < file.scsslint.issues.length; ++i) {
            var issue = file.scsslint.issues[i],
                color = issue.severity === 'error' ? gutil.colors.red : gutil.colors.yellow;
            gutil.log(gutil.colors.cyan('scss-lint:'), '[' + color(issue.severity) + ']', '[' + path.relative('./app/styles', file.path) + gutil.colors.grey(':' + issue.line + '::' + issue.column) + ']', color(issue.reason));
            gulp.src(file.path, {read: false})
                .pipe($.notify({
                    title: issue.severity.toUpperCase() + ': Compass',
                    message: path.relative('./app/styles', file.path)
                }));
        }
    }
};

gulp.task('styles-dev', function () {
    return gulp.src(config.dev.paths.root + '/styles/**/*.scss')
        .pipe($.scsslint({
            config: 'scss-lint.yml',
            customReport: scssReporter
        }))
        .pipe($.scsslint.failReporter())
        .pipe($.compass({
            config_file: 'config-dev.rb',
            css: config.dev.paths.tmp + '/styles',
            sass: config.dev.paths.root + '/styles'
//            sourcemap: true   // Compass doesn't support source maps yet.
        }));
});

gulp.task('styles-prod', function () {
    return gulp.src(config.dev.paths.root + '/styles/**/*.scss')
        .pipe($.scsslint({
            config: 'scss-lint.yml',
            customReport: scssReporter
        }))
        .pipe($.scsslint.failReporter())
        .pipe($.compass({
            config_file: 'config-prod.rb',
            css: config.prod.paths.root + '/styles',
            sass: config.dev.paths.root + '/styles'
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
    $.bowerFiles()
        .pipe(gutil.buffer(function (err, files) {
            bowerFiles = files.map(function (file) {
                return path.relative(config.dev.paths.root, file.path)
            });
            extend(true, data, {dependencies: {bower: bowerFiles}});
            if (--toDo === 0) {
                done();
            }
        }));

    // Read scripts.
    gulp.src(config.dev.paths.tmp + '/scripts/**/*.js')
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
        .pipe($.jade({
            pretty: true,
            data: jadeData
        }))
        .pipe(gulp.dest(config.dev.paths.tmp))
        .pipe($.browserSync.reload({stream: true}));
});

gulp.task('jade-prod', ['jade-data-prod'], function () {
    var filterPartials = $.filter('**/partials/**/*.html'),
        filterOther = $.filter('!**/partials/**/*.html');
    return gulp.src([config.dev.paths.root + '/**/*.jade', '!' + config.dev.paths.root + '/templates/**/*'])
        .pipe($.jade({
            pretty: true,
            data: jadeData
        }))
        .pipe(filterPartials)
        .pipe($.ngHtml2Js({
            moduleName: 'boilerplate-html5',
            prefix: ''
        }))
        .pipe($.concat('scripts/partials.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(config.prod.paths.root))
        .pipe(filterPartials.restore())
        .pipe(filterOther)
        .pipe(gulp.dest(config.prod.paths.root))
        .pipe(filterOther.restore());
});

// Rev.
gulp.task('rev', function () {
    var filterAll = $.filter(['**/*.css', '**/*.js']);
    return gulp.src(config.prod.paths.root + '/**/*.html')
        .pipe($.useref.assets())
        .pipe(filterAll)
        .pipe($.clean())
        .pipe(filterAll.restore())
        .pipe($.rev())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest(config.prod.paths.root));
});

// Connect.
gulp.task('connect', function () {
    return $.connect.server({
        root: config.prod.paths.root,
        port: config.prod.port,
        host: config.prod.host,
        livereload: false
    });
});

// Browser-sync.
gulp.task('browser-sync', function () {
    return $.browserSync.init(null, {
        server: {
            baseDir: [config.dev.paths.root, config.dev.paths.tmp]
        }
    });
});

// Watch.
gulp.task('watch', function () {
    // Scss.
    gulp.watch(config.dev.paths.root + '/styles/**/*.scss', function (file) {
        return gulp.src(file.path)
            .pipe($.scsslint({
                config: 'scss-lint.yml',
                customReport: scssReporter
            }));
    });

    gulp.src(config.dev.paths.root + '/styles/**/*.scss', {read: false})
        .pipe($.watch())
        .pipe($.plumber())
        .pipe($.compass({
            config_file: 'config-dev.rb',
            css: config.dev.paths.tmp + '/styles',
            sass: config.dev.paths.root + '/styles'
        }))
        .pipe($.browserSync.reload({stream: true}))
        .pipe($.notify({
            title: 'Compass',
            message: 'Styles re-built'
        }));

    // Coffee.
    gulp.src(config.dev.paths.root + '/scripts/**/*.coffee', {read: false})
        .pipe($.watch())
        .pipe($.plumber())
        .pipe($.coffeelint({
            optFile: 'coffeelint.json'
        }))
        .pipe($.coffeelint.reporter())
        .pipe($.sourcemaps.init())
        .pipe($.coffee())
        .pipe($.sourcemaps.write({sourceRoot: config.dev.paths.root + '/scripts'}))
        .pipe(gulp.dest(config.dev.paths.tmp + '/scripts'))
        .pipe($.browserSync.reload({stream: true}))
        .pipe($.notify({
            title: 'Coffee',
            message: 'Scripts re-built'
        }));

    // Jade.
    gulp.src(config.dev.paths.root + '/**/*.jade', {read: false})
        .pipe($.watch(function() {
            return gulp.src([config.dev.paths.root + '/**/*.jade', '!' + config.dev.paths.root + '/templates/**/*'])
                .pipe($.jade({
                    pretty: true,
                    data: jadeData
                }))
                .pipe(gulp.dest(config.dev.paths.tmp))
                .pipe($.browserSync.reload({stream: true}))
                .pipe($.notify({
                    title: 'Jade',
                    message: 'Templates re-built'
                }));
        }));

    // Jade-data.
    gulp.src(config.dev.paths.root + '/jade-data/**/*.json', {read: false})
        .pipe($.watch({}, function (files) {
            return gulp.run('jade-dev');
        }))
        .pipe($.notify({
            title: 'Jade',
            message: 'Templates re-built'
        }));
});

// Open.
gulp.task('open', function () {
    return gulp.src('./gulpfile.js')
        .pipe($.open('', {url: 'http://' + config.prod.host + ':' + config.prod.port}));
});

// Proxies.
gulp.task('dev', function (cb) {
    $.runSequence(['clean', 'bower'], ['scripts-dev', 'styles-dev'], 'jade-dev', ['browser-sync', 'watch'], cb);
});

gulp.task('prod', function (cb) {
    $.runSequence(['clean', 'bower'], ['scripts-prod', 'styles-prod'], ['jade-prod', 'connect'], 'rev', 'open', cb);
});

gulp.task('default', ['prod']);
