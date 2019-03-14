//jshint strict: false
module.exports = function (config) {
  config.set({

    basePath: './',

    files: [
      // 'node_modules/angular/angular.js',
      // 'node_modules/angular-route/angular-route.js',
      // 'node_modules/angular-resource/angular-resource.js',
      // 'node_modules/angular-mocks/angular-mocks.js',
      'app/**/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome', 'Firefox'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine'
    ]

  });
};