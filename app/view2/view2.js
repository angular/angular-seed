'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', function($scope) {
  $scope.courses = [
      {title:'Practice Algorithms', link: "#"},
      {title:'Study System Design', link: "#"},
      {title:'Learn More about CH',link: "#"},
      {title:'Look through my projects',link: "#"},
      {title:'Learn AngularJS',link: "#"},
      {title:'Create an App',link: "#"},
      {title:'Get Hired!',link: "#"},
      {title:'Practice Algorithms', link: "#"},
      {title:'Study System Design', link: "#"},
      {title:'Learn More about CH',link: "#"},
      {title:'Look through my projects',link: "#"},
      {title:'Learn AngularJS',link: "#"},
      {title:'Create an App',link: "#"},
      {title:'Get Hired!',link: "#"},
      {title:'Practice Algorithms', link: "#"},
      {title:'Study System Design', link: "#"},
      {title:'Learn More about CH',link: "#"},
      {title:'Look through my projects',link: "#"},
      {title:'Learn AngularJS',link: "#"},
      {title:'Create an App',link: "#"},
      {title:'Get Hired!',link: "#"}
    ];
}]);