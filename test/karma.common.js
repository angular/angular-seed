module.exports = {

    files: [
        'bower_components/jquery/dist/jquery.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'test/init.js',
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
