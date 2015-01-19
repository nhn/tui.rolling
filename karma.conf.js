// Karma configuration
// Generated on Thu Nov 06 2014 20:12:47 GMT+0900 (JST)

module.exports = function(config) {
    var webdriverConfig = {
        hostname: 'fe.nhnent.com',
        port: 4444,
        remoteHost: true
    };

    config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

      // list of files / patterns to load in the browser
      files: [
          'bower_components/jquery/jquery.js',
          'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
          'src/common/common.js',
          'src/js/rolling.js',
          'src/js/roller.js',
          'src/**/*.js',
          'test/**/*.test.js',
          {
              pattern: 'test/fixture/**/*.html',
              included: false
          },
          {
              pattern: 'test/fixture/**/*.css',
              included: false
          }
      ],

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'src/**/*.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
        'IE7',
        'IE8',
        'IE9',
        'IE10',
        'IE11',
        'Chrome-WebDriver',
        'Firefox-WebDriver'
    ],

    customLaunchers: {
        'IE7': {
            base: 'WebDriver',
            config: webdriverConfig,
            browserName: 'IE7'
        },
        'IE8': {
            base: 'WebDriver',
            config: webdriverConfig,
            browserName: 'IE8'
        },
        'IE9': {
            base: 'WebDriver',
            config: webdriverConfig,
            browserName: 'IE9'
        },
        'IE10': {
            base: 'WebDriver',
            config: webdriverConfig,
            browserName: 'IE10'
        },
        'IE11': {
            base: 'WebDriver',
            config: webdriverConfig,
            browserName: 'IE11'
        },
        'Chrome-WebDriver': {
            base: 'WebDriver',
            config: webdriverConfig,
            browserName: 'chrome'
        },
        'Firefox-WebDriver': {
            base: 'WebDriver',
            config: webdriverConfig,
            browserName: 'firefox'
        }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
