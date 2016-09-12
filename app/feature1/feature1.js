'use strict';

/*
ui.bootstrap is needed for a lot of UI related function, like dropdown menu with typeahead
ngResource is used to call Restful services
*/
var feature1App=angular.module('myApp.feature1', ['ngRoute','ui.bootstrap','ngResource','myApp.constants']);

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

//fixed mock data
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


//http call for string array
feature1App.controller('GetListByHttpCallCtrl', ['$scope','$http','$log','feature1RestService',function($scope,$http,$log,feature1RestService) {
   //response payload will be ["aaa","bbb"]
   var url = feature1RestService.restRoot + '/stringArray';
   $http.get(url).success(function(data){
      $log.debug(data);
      $scope.connStrList1 =  data;
   });

}]);


//$resouce for jsonArray with objects
//reponse payload [  {    "name": "aaa"  },  {    "name": "bbb"  }]
feature1App.factory("connAPI", ['$resource','feature1RestService',function($resource,feature1RestService) {
  var url = feature1RestService.restRoot + '/jsonArray';
      return {
        values: $resource(url,
        { id:'@id'},
        {
          query: {method: 'GET', isArray: true},
          get: {method: 'GET', params:{id:'@id'}, isArray: true},
          save: {method: 'POST', isArray: true}
        })
      };
  }]);

feature1App.controller('GetListByResourceCallCtrl', ['$scope','$log','connAPI',function($scope,$log,connAPI) {
     connAPI.values.get(
          function(value) {
           var listValues =[];
           for(var i=0;i<value.length;i++){
             listValues.push(value[i].name);
           };
          $log.debug(value[0].name);
          $log.debug('Success: Calling the /values back-end service', value);
          $scope.connStrList2= listValues;
      },
     function(errResponse) {
         // do something else in case of error here
        $log.debug('Error: Calling the /values back-end service', errResponse);
     });

}]);
