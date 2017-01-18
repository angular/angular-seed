(function (angular) {
  'use strict';

  angular.module('myApp.view3', ['ngRoute'])

      .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view3', {
          templateUrl: 'view3/view3.tpl.html',
          controller: 'View3Controller as vm'
        });
      }]);


})(window.angular);