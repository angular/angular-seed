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
    //a customisable cell (see templateUrl) and editable
    .directive('smartTableDataCell', ['$filter', '$http', '$templateCache', '$compile', function (filter, http, templateCache, compile) {
        return {
            restrict: 'C',
            terminal: true,
            link: function (scope, element) {
                var
                    column = scope.column,
                    row = scope.dataRow,
                    format = filter('format'),
                    childScope;

                //can be useful for child directives
                scope.formatedValue = format(row[column.map], column.formatFunction, column.formatParameter);

                function defaultContent() {
                    //clear content
                    if (column.isEditable) {
                        element.html('<editable-cell row="dataRow" column="column" type="column.type" value="dataRow[column.map]"></editable-cell>');
                        compile(element.contents())(scope);
                    } else {
                        element.text(scope.formatedValue);
                    }
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
                        defaultContent();
                    }
                });
            }
        };
    }])
//directive that allow type to be bound in input
    .
    directive('inputType', ['$parse', function (parse) {
        return {
            restrict: 'A',
            priority: 9999,
            link: function (scope, ielement, iattr) {
                //force the type to be set before inputDirective is called
                var getter = parse(iattr.type),
                    type = getter(scope);
                iattr.$set('type', type);
            }
        };
    }])
//    //Kai Gorner solution to bug (see https://groups.google.com/forum/?fromgroups=#!topic/angular/pRc5pu3bWQ0)
//    .directive('proxyValidity', function () {
//        return {
//            require: 'ngModel',
//            link: function ($scope, $element, $attrs, modelCtrl) {
//                if (typeof $element.prop('validity') === 'undefined')
//                    return;
//
//                $element.bind('input', function (e) {
//                    var validity = $element.prop('validity');
//                    $scope.$apply(function () {
//                        modelCtrl.$setValidity('badInput', !validity.badInput);
//                    });
//                });
//            }
//        };
//    })
    //an editable content in the context of a cell (see row, column)
    .directive('editableCell', function () {
        return {
            restrict: 'E',
            require: '^smartTable',
            templateUrl: 'partials/editableCell.html',
            scope: {
                row: '=',
                column: '=',
                type: '='
            },
            replace: true,
            link: function (scope, element, attrs, ctrl) {
                var form = angular.element(element.children()[1]),
                    input = angular.element(form.children()[0]);

                //init values
                scope.isEditMode = false;
                scope.value = scope.row[scope.column.map];

                scope.submit = function () {
                    //update model if valid
                    if (scope.myForm.$valid === true) {
                        scope.row[scope.column.map] = scope.value;
                        ctrl.sortBy();//it will trigger the refresh... some hack ? (ie it will sort, filter, etc with the new value)
                    }
                    scope.isEditMode = false;
                };

                scope.toggleEditMode = function ($event) {
                    scope.isEditMode = true;
                    $event.stopPropagation();
                };

                scope.$watch('isEditMode', function (newValue, oldValue) {
                    if (newValue) {
                        input[0].select();
                        input[0].focus();
                    }
                });

                input.bind('blur', function () {
                    scope.$apply(function () {
                        scope.submit();
                    });
                });
            }
        };
    });

