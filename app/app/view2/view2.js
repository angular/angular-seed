'use strict';

angular.module('myApp.view2', [
  'ngRoute',
  'myApp.version.filter'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'app/view2/view2.html', 
    controller: 'View2Ctrl'
  });
}]).
controller('View2Ctrl', [function() {

}]);