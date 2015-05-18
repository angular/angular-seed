'use strict';

angular
  .module('myApp.view3', ['ui.router'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('feature3', {
        abstract: true,
        url: "/feature3",
        templateUrl: "features/feature3/feature3.html",
        controller: 'Feature3Ctrl'
      })
      .state('feature3.default', {
        url: "",
        templateUrl: "features/feature3/tab1.html",
        controller: 'Feature3Ctrl'
      })
      .state('feature3.tab1', {
        url: "/tab1",
        templateUrl: "features/feature3/tab1.html",
        controller: 'Feature3Ctrl'
      })
      .state('feature3.tab2', {
        url: "/tab2",
        templateUrl: "features/feature3/tab2.html",
        controller: 'Feature3Ctrl'
      })
      .state('feature3.custom', {
        url: "/:tab",
        templateUrl: function ($stateParams) {
          return "features/feature3/" + $stateParams.tab + ".html";
        },
        controllerProvider: function ($stateParams) {
          return 'Feature3Ctrl';
        }
      })
    ;
  })
  .controller('Feature3Ctrl', function ($scope , $stateParams) {
    $scope.state = $stateParams;

  });
