'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['SmartTable.Table']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'dummy'});
//    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
        $routeProvider.otherwise({redirectTo: '/view1'});
    }]).controller('dummy', ['$scope', function (scope) {

        //TODO, replace that s***
        scope.rowCollection = [
            {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21')},
            {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')},
            {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')}
        ];

        scope.change = function () {
            scope.rowCollection.splice(0, 1);
        };

        scope.columnCollection = [
            {label: 'FirsName', map: 'firstName', sortPredicate: function (dataRow) {
                return dataRow.firstName[dataRow.firstName.length - 1];
            }},
            {label: 'LastName', map: 'lastName', templateUrl: 'partials/dummyTemplate.html'},
            {label: 'birth date', map: 'birthDate', formatName: 'date'}
        ];
        scope.tableTitle = 'youpi';

    }]);
