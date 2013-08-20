module.exports = function(config){
    config.set({


    basePath : '../',

    files : [
        'test/e2e/**/*.js'
    ],

    autoWatch : false,

    browsers : ['Chrome'],

    frameworks: ['ng-scenario'],

    singleRun : true,

    proxies : {
      '/': 'http://localhost:8000/'
    },

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-ng-scenario'    
            ],

    junitReporter : {
      outputFile: 'test_out/e2e.xml',
      suite: 'e2e'
    }

})}

