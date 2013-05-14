'use strict';
// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['SmartTable.Table']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'dummy'});
//    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
        $routeProvider.otherwise({redirectTo: '/view1'});
    }]).controller('dummy', ['$scope', function (scope) {

        scope.rowCollection = [
            {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'laurent34azerty@gmail.com'},
            {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'laurent34azerty@gmail.com'},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'laurent34azerty@gmail.com'}
        ];

        scope.columnCollection = [
            {label: 'FirsName', map: 'firstName', sortPredicate: function (dataRow) {
                return dataRow.firstName.length;
            }},
            {label: 'LastName', map: 'lastName', isSortable: false},
            {label: 'birth date', map: 'birthDate', formatFunction: 'date', type: 'date', isEditable: true},
            {label: 'balance', map: 'balance', isEditable: true, type: 'number', formatFunction: 'currency', formatParameter: '$'},
            {label: 'email', map: 'email', isEditable: true, type: 'email'}
        ];
        scope.tableTitle = 'youpi';

        scope.myObject = {number: 1, type: 'number'};
        scope.myModel = 'salut';
    }]);