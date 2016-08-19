'use strict';

angular.module('myApp.listado', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/listado', {
    templateUrl: 'listado/listado.html',
    controller: 'ListadoCtrl'
  });
}])

.controller('ListadoCtrl', [function() {

}]);
