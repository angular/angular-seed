module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'app/lib/angular/angular.js',
      'app/lib/angular/angular-*.js',
      'test/lib/angular/angular-mocks.js',
      'app/js/require.js',
      'app/js/**/*.js',
      'test/unit/**/*.js'
    ],

    // exclude : [
    //   'app/js/TodoCtrl.js',
    // ],

    autoWatch : true,

    singleRun : true,

    frameworks: ['jasmine'],

    // browsers : ['Chrome'],
    browsers : ['PhantomJS'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage'
            ],

    reporters : ['progress', 'junit', 'coverage'],

    preprocessors : {
        'app/js/**/*.js' : ['coverage']
    },
    
    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },
   
    coverageReporter : {
    	type : 'html',
	dir : 'test_out/coverage/'
    },

})}
