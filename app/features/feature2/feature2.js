'use strict';

angular
  .module('myApp.view2', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('feature2', {
        url: "/feature2",
        templateUrl: "features/feature2/feature2.html",
        controller: 'Feature2Ctrl'
      })
    ;
  })
  .controller('Feature2Ctrl', function () {

  });
