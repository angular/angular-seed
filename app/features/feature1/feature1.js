'use strict';

angular
  .module('myApp.view1', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('feature1', {
        url: "/feature1",
        templateUrl: "features/feature1/feature1.html",
        controller: 'Feature1Ctrl'
      })
    ;
  })
  .controller('Feature1Ctrl', function () {
    less.registerStylesheets();
    less.refresh(true);


  });
