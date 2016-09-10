'use strict';

/*
ui.bootstrap is needed for a lot of UI related function, like dropdown menu with typeahead
ngResource is used to call Restful services
*/
var feature1App=angular.module('myApp.feature1', ['ngRoute','ui.bootstrap','ngResource']);

feature1App.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/feature1', {
    templateUrl: 'feature1/feature1.html',
    controller: 'Feature1Ctrl'
  });
}]);


/*
implement how to invoke rest services with different data types
json
json string array
jsonArray with json objects
*/
feature1App.factory("connStrList", function() {
  var connStrList = ["ConnList1://aaa",
    "ConnList1://bbb"
  ];
  return connStrList;
});


feature1App.controller('Feature1Ctrl', ['$scope','connStrList','$log',function($scope,connStrList,$log) {
  $log.debug(connStrList);
  $scope.connStrList=connStrList;

}]);

feature1App.controller('GetListByHttpCallCtrl', ['$scope','$http','$log',function($scope,$http,$log) {

   $http.get('http://localhost:8081/stringArray').success(function(data){
      $log.debug(data);
      $scope.connStrList1 =  data;
   });

}]);
