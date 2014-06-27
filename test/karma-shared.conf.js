module.exports = function() {
    return {
        basePath: '../',
        frameworks: ['jasmine'],
        reporters: ['coverage', 'progress'],
        browsers: ['Chrome'],   //, 'Firefox', 'Safari'],  // 'IE'],
        autoWatch: false,
        singleRun: false,
        colors: true,

        preprocessors: {
            '.tmp/scripts/**/*.js': 'coverage'
        },

        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        },

        files : [
            // Bower components.
            'app/bower_components/angular/angular.min.js',
            'app/bower_components/angular-animate/angular-animate.min.js',
            'app/bower_components/angular-cookies/angular-cookies.min.js',
            'app/bower_components/angular-resource/angular-resource.min.js',
            'app/bower_components/angular-translate/angular-translate.min.js',
            'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',

            // App code.
            '.tmp/scripts/**/*.js'
        ]
    }
};