(function (ng) {
    'use strict';
    ng.module('smart-table',[]);
})(angular);

(function (ng, undefined) {
    'use strict';
    ng.module('smart-table')
        .controller('stTableController', ['$scope', '$parse', '$filter', '$attrs', function StTableController($scope, $parse, $filter, $attrs) {
            var propertyName = $attrs.stTable;
            var displayGetter = $parse(propertyName);
            var displaySetter = displayGetter.assign;
            var safeGetter;
            var orderBy = $filter('orderBy');
            var filter = $filter('filter');
            var safeCopy = ng.copy(displayGetter($scope));
            var tableState = {
                sort: {},
                search: {},
                pagination: {
                    start: 0
                }
            };
            var pipeAfterSafeCopy = true;
            var ctrl = this;

            if ($attrs.stSafeSrc) {
                safeGetter = $parse($attrs.stSafeSrc);
                $scope.$watchCollection(function () {
                    return safeGetter($scope);
                }, function (val) {
                    if (val) {
                        safeCopy = ng.copy(val);
                        if (pipeAfterSafeCopy === true) {
                            ctrl.pipe();
                        }
                    }
                });
            }

            /**
             * sort the rows
             * @param predicate function or string which will be used as predicate for the sorting
             * @param [optional] reverse if you want to reverse the order
             */
            this.sortBy = function sortBy(predicate, reverse) {
                tableState.sort.predicate = predicate;
                tableState.sort.reverse = reverse === true;
                tableState.pagination.start = 0;
                this.pipe();
                $scope.$broadcast('st:sort', {predicate: predicate});
            };

            /**
             * search matching rows
             * @param input the input string
             * @param predicate [optional] the property name against you want to check the match, otherwise it will search on all properties
             */
            this.search = function search(input, predicate) {
                var predicateObject = tableState.search.predicateObject || {};
                var prop = predicate ? predicate : '$';
                predicateObject[prop] = input;
                tableState.search.predicateObject = predicateObject;
                tableState.pagination.start = 0;
                this.pipe();
                $scope.$broadcast('st:search', {input: input, predicate: predicate});
            };

            /**
             * this will chain the operations of sorting and filtering based on the current table state (sort options, filtering, ect)
             */
            this.pipe = function pipe() {
                var filtered = tableState.search.predicateObject ? filter(safeCopy, tableState.search.predicateObject) : safeCopy;
                filtered = orderBy(filtered, tableState.sort.predicate, tableState.sort.reverse);
                if (tableState.pagination.number !== undefined) {
                    tableState.pagination.numberOfPages = filtered.length > 0 ? Math.ceil(filtered.length / tableState.pagination.number) : 1;
                    filtered = filtered.slice(tableState.pagination.start, tableState.pagination.start + tableState.pagination.number);
                }
                displaySetter($scope, filtered);
            };

            /**
             * select a dataRow (it will add the attribute isSelected to the row object)
             * @param row the row to select
             * @param mode "single" or "multiple"
             */
            this.select = function select(row, mode) {
                var rows = displayGetter($scope);
                var index = rows.indexOf(row);
                if (index !== -1) {
                    if (mode === 'single') {
                        ng.forEach(displayGetter($scope), function (value, key) {
                            value.isSelected = key === index ? !value.isSelected : false;
                        });
                    } else {
                        rows[index].isSelected = !rows[index].isSelected;
                    }
                }
            };

            /**
             * reset the sorting state
             */
            this.reset = function reset() {
                tableState.sort = {};
                tableState.pagination.start = 0;
                this.pipe();
                $scope.$broadcast('st:reset');
            };


            /**
             * take a slice of the current sorted/filtered collection (pagination)
             *
             * @param start index of the slice
             * @param number the number of item in the slice
             */
            this.slice = function splice(start, number) {
                tableState.pagination.start = start;
                tableState.pagination.number = number;
                this.pipe();
                $scope.$broadcast('st:splice', {start: start, number: number});
            };

            /**
             * return the currently displayed dataSet
             * @returns [array] the currently displayed dataSet
             */
            this.dataSet = function getDataSet() {
                return displayGetter($scope);
            };

            /**
             * return the current state of the table
             * @returns {{sort: {}, search: {}, pagination: {start: number}}}
             */
            this.tableState = function getTableState() {
                return tableState;
            };

            /**
             * Usually when the safe copy is updated the pipe function is called.
             * Calling this method will prevent it, which is something required when using a custom pipe function
             */
            this.preventPipeOnWatch = function preventPipe() {
                pipeAfterSafeCopy = false;
            };
        }])
        .directive('stTable', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                controller: 'stTableController',
                link: function (scope, element, attr, ctrl) {
                }
            };
        }]);
})(angular);

(function (ng) {
    'use strict';
    ng.module('smart-table')
        .directive('stSearch', function () {
            return {
                replace: true,
                require: '^stTable',
                link: function (scope, element, attr, ctrl) {
                    var tableCtrl = ctrl;
                    var predicate = attr.stSearch || '';

                    element.bind('input', function (evt) {
                        evt = evt.originalEvent || evt;
                        scope.$apply(function () {
                            tableCtrl.search(evt.target.value, predicate);
                        });
                    });
                }
            }
        })
})(angular);

(function (ng) {
    'use strict';
    ng.module('smart-table')
        .directive('stSelectRow', function () {
            return {
                restrict: 'A',
                require: '^stTable',
                scope: {
                    row: '=stSelectRow'
                },
                link: function (scope, element, attr, ctrl) {
                    var mode = attr.stSelectMode || 'single';
                    element.bind('click', function () {
                        scope.$apply(function () {
                            ctrl.select(scope.row, mode);
                        });
                    });

                    scope.$watch('row.isSelected', function (newValue, oldValue) {
                        if (newValue === true) {
                            element.addClass('st-selected');
                        } else {
                            element.removeClass('st-selected');
                        }
                    });
                }
            }
        });
})(angular);

(function (ng) {
    'use strict';
    ng.module('smart-table')
        .directive('stSort', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                require: '^stTable',
                link: function (scope, element, attr, ctrl) {

                    var predicate = attr.stSort;
                    var getter = $parse(predicate);
                    var index = 0;
                    var states = ['descent', 'ascent', 'natural'];

                    function reset() {
                        index = 0;
                        element
                            .removeClass('st-sort-ascent')
                            .removeClass('st-sort-descent');
                    }

                    if (ng.isFunction(getter(scope))) {
                        predicate = getter(scope);
                    }

                    element.bind('click', function sortClick() {
                        if (predicate) {
                            scope.$apply(function () {
                                index++;
                                var stateIndex = index % 2;
                                if (index % 3 === 0) {
                                    ctrl.reset();
                                } else {
                                    ctrl.sortBy(predicate, stateIndex === 0);
                                    element
                                        .removeClass('st-sort-' + states[(stateIndex + 1) % 2])
                                        .addClass('st-sort-' + states[stateIndex]);
                                }
                            });
                        }
                    });

                    scope.$on('st:sort', function (event, args) {
                        if (args.predicate !== predicate) {
                            reset();
                        }
                    });

                    scope.$on('st:reset', reset);
                }
            };
        }])
})(angular);

(function (ng) {
    'use strict';
    ng.module('smart-table')
        .directive('stPagination', function () {
            return {
                restrict: 'EA',
                require: '^stTable',
                scope: {},
                template: '<div class="pagination"><ul class="pagination"><li ng-repeat="page in pages" ng-class="{active: page==currentPage}"><a ng-click="selectPage(page)">{{page}}</a></li></ul></div>',
                replace: true,
                link: function (scope, element, attrs, ctrl) {

                    function isNotNan(value) {
                        return !(typeof value === 'number' && isNaN(value));
                    }

                    var itemsByPage = isNotNan(parseInt(attrs.stItemsByPage, 10)) == true ? parseInt(attrs.stItemsByPage, 10) : 10;
                    var displayedPages = isNotNan(parseInt(attrs.stDisplayedPages, 10)) == true ? parseInt(attrs.stDisplayedPages, 10) : 5;

                    scope.currentPage = 1;
                    scope.pages = [];


                    scope.$watch(function () {
                            return ctrl.tableState().pagination;
                        },
                        function () {
                            var paginationState = ctrl.tableState().pagination;
                            var start = 1;
                            var end;
                            var i;
                            scope.currentPage = Math.floor(paginationState.start / paginationState.number) + 1;

                            start = Math.max(start, scope.currentPage - Math.abs(Math.floor(displayedPages / 2)));
                            end = start + displayedPages;

                            if (end > paginationState.numberOfPages) {
                                end = paginationState.numberOfPages + 1;
                                start = Math.max(1, end - displayedPages);
                            }

                            scope.pages = [];
                            scope.numPages = paginationState.numberOfPages;

                            for (i = start; i < end; i++) {
                                scope.pages.push(i);
                            }


                        }, true);

                    scope.selectPage = function (page) {
                        if (page > 0 && page <= scope.numPages) {
                            ctrl.slice((page - 1) * itemsByPage, itemsByPage);
                        }
                    };

                    //select the first page
                    ctrl.slice(0, itemsByPage);
                }
            };
        });
})(angular);

(function (ng) {
    'use strict';
    ng.module('smart-table')
        .directive('stPipe', function () {
            return {
                require: 'stTable',
                scope: {
                    stPipe: '='
                },
                link: function (scope, element, attrs, ctrl) {

                    if (ng.isFunction(scope.stPipe)) {
                        ctrl.preventPipeOnWatch();
                        ctrl.pipe = scope.stPipe.bind(ctrl, ctrl.tableState());
                    }
                }
            };
        });
})(angular);
