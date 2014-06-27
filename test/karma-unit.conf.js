var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
    var conf = sharedConfig();

    conf.files = conf.files.concat([
        // Extra testing code.
        'app/bower_components/angular-mocks/angular-mocks.js',

        // Test files.
        './.tmp/.test/unit/**/*.js'
    ]);

    config.set(conf);
};