// an example karma.conf.js
module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['ng-scenario'],
        files: [
            'test/e2e/**/*.js'
        ],
        autoWatch: false,
        singleRun: true,
        browsers: ['Chrome'],
        proxies: {
            '/': 'http://localhost:8000/'
        },
        junitReporter: {
            outputFile: 'test_out/e2e.xml',
            suite: 'e2e'
        }
    });
};
