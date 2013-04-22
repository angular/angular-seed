'use strict';

/* Directives */


angular.module('SmartTable.directives', [])
    .directive('smartTable', ['$log', function (log) {
        return {
            restrict: 'E',
            scope: {
                columnCollection: '=columns',
                dataCollection: '=rows',
                tableTitle: '@'
            },
            replace: 'true',
            templateUrl: 'partials/smartTable.html',
            controller: 'TableCtrl',
            link: function (scope, element, attr, ctrl) {

                //insert columns from column config
                if (scope.columnCollection) {
                    for (var i = 0, l = scope.columnCollection.length; i < l; i++) {
                        ctrl.insertColumn(scope.columnCollection[i]);
                    }
                } else {
                    //or guess data Structure
                    if (scope.dataCollection && scope.dataCollection.length > 0) {
                        var templateObject = scope.dataCollection[0];
                        angular.forEach(templateObject, function (value, key) {
                            ctrl.insertColumn({label: key, map: key});
                        });
                    }
                }

                //if item are added or removed into the data model from outside the grid
                scope.$watch('dataCollection.length', function (oldValue, newValue) {
                    if (oldValue !== newValue) {
                        ctrl.sortBy();//it will trigger the refresh... some hack ?
                    }
                });

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
    })
    .directive('smartTableGlobalSearch', function () {
        return {
            restrict: 'C',
            require: '^smartTable',
            scope: {
                columnSpan: '@'
            },
            templateUrl: 'partials/globalSearchCell.html',
            replace: false,
            link: function (scope, element, attr, ctrl) {

                scope.searchValue = '';

                scope.$watch('searchValue', function (value) {
                    ctrl.search(value);
                });
            }
        }
    })
    .directive('smartTableDataCell', ['$filter', '$http', '$templateCache', '$compile', function (filter, http, templateCache, compile) {
        return {
            restrict: 'C',
            terminal: true,
            compile: function (element, attr) {

                return function (scope, element) {
                    var column = scope.column,
                        row = scope.dataRow,
                        format = filter('format'),
                        childScope;

                    //can be useful for child directives
                    scope.formatedValue = format(row[column.map], column.formatFunction, column.formatName, column.formatParameter)

                    function defaultContent() {
                        //clear content
                        element.html('');

                        //append formatedValue
                        element.text(scope.formatedValue);
                    }

                    scope.$watch('column.templateUrl', function (value) {

                        if (value) {
                            //we have to load the template (and cache it) : a kind of ngInclude
                            http.get(value, {cache: templateCache}).success(function (response) {

                                //create a scope
                                childScope = scope.$new();
                                //compile the element with its new content and new scope
                                element.html(response);
                                compile(element.contents())(childScope);
                            }).error(defaultContent);

                        } else {
                            //else append the formated value
                            defaultContent();
                        }
                    });
                };
            }
        };
    }])
    .directive('youpi', function () {
        return {
            restrict: 'C',
            link: function (scope, element, attr) {
                if (scope.dataRow) {
                    element.text(scope.dataRow.birthDate < new Date('1980/01/01') ? 'old' : 'young');
                }
            }
        }
    })
