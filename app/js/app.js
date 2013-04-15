'use strict';


// Declare app level module which depends on filters, and services
var app=angular.module('myApp',['SmartTable.Table']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'dummy'});
//    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]).controller('dummy',['$scope', function (scope) {

        //TODO, replace that s***
            scope.rowCollection=[
                {firstName:'Laurent',lastName:'Renard',birthDate:new Date('21-05-1987')},
                {firstName:'Blandine',lastName:'Faivre',birthDate:new Date('25-04-1987')},
                {firstName:'Francoise',lastName:'Frere',birthDate:new Date('27-08-1955')}
            ];

            scope.columnCollection=[
                {label:'FirsName',map:'firstName'},
                {label:'LastName',map:'lastName'},
                {label:'birth date',map:'birthDate'}
            ];

            scope.dude='super table';
    }]);
