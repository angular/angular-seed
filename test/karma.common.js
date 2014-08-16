module.exports = {

    files: [
        'bower_components/**/*.js',
        'src/*.js',
        'test/spec/*.spec.js'
    ],
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    // coverage reporter generates the coverage
    reporters: ['progress', 'coverage'],

    port: 9876,

    preprocessors: {
        'src/*.js': ['coverage']
    },
    coverageReporter: {
        type: 'html',
        dir: 'coverage/'
    }
};
