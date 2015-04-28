'use strict';

// Declare app level module which depends on views, and components
angular
  .module('myApp'
  , ['ui.router'
    , 'myApp.view1'
    , 'myApp.view2'
    , 'myApp.view3'
    , 'myApp.version'
    , 'angular-loading-bar'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/feature1");
  });

