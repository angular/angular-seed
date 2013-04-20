'use strict';

/* Directives */


angular.module('SmartTable.directives', [])
    .directive('smartTable', ['$log', function (log) {
        return {
            restrict: 'E',
            scope: {},
            replace: 'true',
            templateUrl: 'partials/smartTable.html',
            controller: 'TableCtrl',
            link: function (scope, element, attr, ctrl) {

                //TODO for the moment we assign the table ctrl scope here
                scope.displayedCollection = scope.dataCollection = [
                    {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 7656},
                    {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: 2323},
                    {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: -2343.908}
                ];


                scope.columns = [];

                ctrl.insertColumn({label: 'FirsName', map: 'firstName', sortPredicate: function (item) {
                    return item.firstName[item.firstName.length - 1];
                }});
                ctrl.insertColumn({label: 'LastName', map: 'lastName'});
                ctrl.insertColumn({label: 'birth date', map: 'birthDate', formatName: 'date'});
                ctrl.insertColumn({label: 'Balance', map: 'balance'});

                scope.tableTitle = 'super table';
                //   scope.selectionMode='multiple';
            }
        };
    }])

    .directive('smartTableDataRow', function () {

        return {
            require: '^smartTable',
            restrict: 'C',
            link: function (scope, element, attr, ctrl) {

                element.bind('click', function () {
                    scope.$apply(function () {
                        ctrl.toggleSelection(scope.dataRow);
                    })
                });

                scope.$watch('dataRow.isSelected', function (value) {
                    if (value) {
                        element.addClass('selected');
                    } else {
                        element.removeClass('selected');
                    }
                });
            }
        }
    })

    .directive('smartTableHeaderCell', function () {
        return {
            restrict: 'C',
            require: '^smartTable',
            link: function (scope, element, attr, ctrl) {
                element.bind('click', function () {
                    scope.$apply(function () {
                        ctrl.sortBy(scope.column);
                    });
                });

            }
        }
    });