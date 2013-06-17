'use strict';
// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['smartTable.table']).
        controller('mainCtrl', ['$scope', function (scope) {

            scope.$on('updateDataRow', function (event, args) {
                alert(JSON.stringify(args));
            });
            scope.rowCollection = [
                {id: 0, firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'laurent34azerty@gmail.com', nested: {value: 2323}},
                {id: 1, firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'laurent34azerty@gmail.com', nested: {value: 123}},
                {id: 2, firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'laurent34azerty@gmail.com', nested: {value: 565}}
            ];

            for (var i = 0; i < scope.rowCollection.length; i++) {
                var obj = scope.rowCollection[i];
                obj.id = i;
            }

            scope.columnCollection = [
                {label: 'id', map: 'id', isEditable: true},
                {label: 'FirsName', map: 'firstName'},
                {label: 'LastName', map: 'lastName', isSortable: false},
                {label: 'birth date', map: 'birthDate', formatFunction: 'date', type: 'date'},
                {label: 'balance', map: 'balance', isEditable: true, type: 'number', formatFunction: 'currency', formatParameter: '$'},
                {label: 'email', map: 'email', type: 'email', isEditable: true},
                {label: 'nested', map: 'nested.value', formatFunction: 'currency', formatParameter: '$', type: 'number', isEditable: true}
            ];

            scope.globalConfig = {
                isPaginationEnabled: true,
                isGlobalSearchActivated: true,
                itemsByPage: 10,
                selectionMode: 'single'
            };

        }])
    ;