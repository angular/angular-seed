/* Directives */
angular.module('SmartTable.directives', [])
    .constant('templateUrlList', {
        smartTable: 'partials/smartTable.html',
        smartTableGlobalSearch: 'partials/globalSearchCell.html',
        editableCell: 'partials/editableCell.html',
        selectionCheckbox: 'partials/selectionCheckbox.html'
    })
    .directive('smartTable', ['templateUrlList', function (templateList) {
        return {
            restrict: 'E',
            scope: {
                columnCollection: '=columns',
                dataCollection: '=rows',
                tableTitle: '@'
            },
            replace: 'true',
            templateUrl: templateList.smartTable,
            controller: 'TableCtrl',
            link: function (scope, element, attr, ctrl) {

                var i = 0,
                    l = scope.columnCollection.length,
                    templateObject;
                //insert columns from column config
                if (scope.columnCollection) {
                    for (; i < l; i++) {
                        ctrl.insertColumn(scope.columnCollection[i]);
                    }
                } else {
                    //or guess data Structure
                    if (scope.dataCollection && scope.dataCollection.length > 0) {
                        templateObject = scope.dataCollection[0];
                        angular.forEach(templateObject, function (value, key) {
                            ctrl.insertColumn({label: key, map: key});
                        });
                    }
                }

                //add selection box column if required
                if (scope.selectionMode === 'multiple' && scope.displaySelectionCheckbox === true) {
                    ctrl.insertColumn({templateUrl: templateList.selectionCheckbox, headerClass: 'selection-column', isSelectionColumn: true});
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
    //just to be able to select the row
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
    //header cell with sorting functionality or put a checkbox if this column is a selection column
    .directive('smartTableHeaderCell', function () {
        return {
            restrict: 'C',
            require: '^smartTable',
            link: function (scope, element, attr, ctrl) {

                //if it is the column with selectionCheckbox
                if (scope.column.isSelectionColumn) {
                    element.html('');
                    var input = angular.element('<input type="checkbox" />');
                    input.bind('change', function () {
                        scope.$apply(function () {
                            ctrl.toggleSelectionAll(input[0].checked);
                        });
                    });
                    element.append(input);
                }
                //otherwise, normal behavior
                else {
                    element.bind('click', function () {
                        scope.$apply(function () {
                            ctrl.sortBy(scope.column);
                        });
                    })
                }
            }
        }
    })
    //credit to Valentyn shybanov : http://stackoverflow.com/questions/14544741/angularjs-directive-to-stoppropagation
    .directive('stopEvent', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind(attr.stopEvent, function (e) {
                    e.stopPropagation();
                });
            }
        }
    })
    //the global filter
    .directive('smartTableGlobalSearch', ['templateUrlList', function (templateList) {
        return {
            restrict: 'C',
            require: '^smartTable',
            scope: {
                columnSpan: '@'
            },
            templateUrl: templateList.smartTableGlobalSearch,
            replace: false,
            link: function (scope, element, attr, ctrl) {

                scope.searchValue = '';

                scope.$watch('searchValue', function (value) {
                    ctrl.search(value);
                });
            }
        }
    }])
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
    //directive that allows type to be bound in input
    .directive('inputType', ['$parse', function (parse) {
        return {
            restrict: 'A',
            priority: 1,
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
    .directive('editableCell', ['templateUrlList', function (templateList) {
        return {
            restrict: 'E',
            require: '^smartTable',
            templateUrl: templateList.editableCell,
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

                scope.submit = function () {
                    //update model if valid
                    if (scope.myForm.$valid === true) {
                        scope.row[scope.column.map] = scope.value;
                        ctrl.sortBy();//it will trigger the refresh...  (ie it will sort, filter, etc with the new value)
                    }
                    scope.isEditMode = false;
                };

                scope.toggleEditMode = function ($event) {
                    scope.value = scope.row[scope.column.map];
                    scope.isEditMode = true;
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
    }]);

