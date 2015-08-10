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
//    $routeProvider.otherwise({redirectTo: '/view1'});
    $urlRouterProvider.otherwise('/view1');

    $stateProvider
      .state('view1', {
          url: '/view1',
          views: {
            'header': {
              templateUrl: 'view_header/header.html',
              controller: 'HeaderController'
            },
            'content': {
              templateUrl: 'view1/view1.html',
              controller: 'View1Ctrl'
            },
            'footer': {
              templateUrl: 'view_footer/footer.html',
              controller: 'FooterController'
            }
          }
      })
      .state('view2', {
        url: '/view2',
        views: {
          'header': {
            templateUrl: 'view_header/header.html',
            controller: 'HeaderController'
          },
          'content': {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
          },
          'footer': {
            templateUrl: 'view_footer/footer.html',
            controller: 'FooterController'
          }
        }
      })
      .state('view3', {
        url: '/view3',
        views: {
          'header': {
            templateUrl: 'view_header/header.html',
            controller: 'HeaderController'
          },
          'content': {
            templateUrl: 'view3/view3.html',
            controller: 'View3Ctrl'
          },
          'footer': {
            templateUrl: 'view_footer/footer.html',
            controller: 'FooterController'
          }
        }
      });
}]);
