'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'myApp.header',
  'myApp.footer',
  'myApp.view1',
  'myApp.view2',
  'myApp.view3',
  'myApp.version',
  'ui.bootstrap'
])

.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/view1');

    $stateProvider
      .state('app', {
          url: '/',
          views: {
            'header': {
              templateUrl: 'view_header/header.html',
              controller: 'HeaderController'
            },
            //'content': {
              //template: '<p>default content</p>'
            //},
            'footer': {
              templateUrl: 'view_footer/footer.html',
              controller: 'FooterController'
            }
          }
      })
      .state('app.view1', {
          url: 'view1',
          views: {
            'content@': {
              templateUrl: 'view1/view1.html',
              controller: 'View1Ctrl'
            }
          }
      })
      .state('app.view2', {
        url: 'view2',
        views: {
          'content@': {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
          }
        }
      })
      .state('app.view3', {
        url: 'view3',
        views: {
          'content@': {
            templateUrl: 'view3/view3.html',
            controller: 'View3Ctrl'
          }
        }
      });
}]);
