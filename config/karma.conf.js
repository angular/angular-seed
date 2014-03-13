module.exports = function(config){
  config.set({
    basePath : '../',

    files : [
      'app/vendor/angular/angular.js',
      'app/vendor/angular/angular-*.js',
      'test/lib/angular/angular-mocks.js',
      'app/**/*.js'
    ],

    exclude : [
      'app/vendor/angular/angular-loader.js',
      'app/vendor/angular/*.min.js',
      'app/vendor/angular/angular-scenario.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}
