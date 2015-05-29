'use strict';
 
angular.module('myApp.home', ['ngRoute', 'firebase'])
 
// Declared route 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl'
    });
}])
 
// Home controller
.controller('HomeCtrl', ['$scope','$firebaseSimpleLogin',function($scope,$firebaseSimpleLogin) {
 
  // Added all following for Firebase login:
  
  
  //$scope.SignIn = function($scope) {
  //  var username = $scope.user.email;
  //  var password = $scope.user.password;
     
    // Auth Logic will be here
  //};
  
  $scope.SignIn = function(event) {
    event.preventDefault();  // To prevent form refresh
    var username = $scope.user.email;
    var password = $scope.user.password;
     
    loginObj.$login('password', {
            email: username,
            password: password
        })
        .then(function(user) {
            // Success callback
            console.log('Authentication successful');
        }, function(error) {
            // Failure callback
            console.log('Authentication failure');
        });
  };
  
  var firebaseObj = new Firebase("https://tuts-scratch.firebaseio.com");
  
  var loginObj = $firebaseSimpleLogin(firebaseObj);
  
}]);