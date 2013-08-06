module.exports = function(config) {
  config.set({
    basePath: '../',

    files: [
      'test/e2e/**/*.js'
    ],

    frameworks: ['ng-scenario'],

    autoWatch: false,

    browsers: ['Chrome'],

    singleRun: true,

    proxies: {
      '/': 'http://localhost:8000/'
    },

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }
  });
};