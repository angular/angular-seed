(function (ng) {
    'use strict';

    ng.module('smart-table', [])
        .controller('stTableController', ['$scope', '$parse', '$filter', '$attrs', function StTableController($scope, $parse, $filter, $attrs) {
            var propertyName = $attrs.stTable;

            var getter = $parse(propertyName);
            var setter = getter.assign;

            var orderBy = $filter('orderBy');
            var filter = $filter('filter');

            var safeCopy = ng.copy(getter($scope));
            var tableState = {
                sort: {},
                search: {}
            };

            /**
             * sort the rows
             * @param predicate function or string which will be used as predicate for the sorting
             * @param [optional] reverse if you want to reverse the order
             */
            this.sortBy = function sortBy(predicate, reverse) {
                tableState.sort.predicate = predicate;
                tableState.sort.reverse = reverse === true;
                this.pipe();
                $scope.$broadcast('st:sort', {predicate: predicate});
            };

            /**
             * search matching rows
             * @param input the input string
             * @param predicate [optional] the property name against you want to check the match, otherwise it will search on all properties
             */
            this.search = function search(input, predicate) {
                var predicateObject = {};
                var prop = predicate ? predicate : '$';
                predicateObject[prop] = input;
                tableState.search.predicateObject = predicateObject;
                this.pipe();
            };

            /**
             * this will chain the operations of sorting and filtering based on the current table state (sort options, filtering, ect)
             */
            this.pipe = function pipe() {
                var filtered = tableState.search.predicateObject ? filter(safeCopy, tableState.search.predicateObject) : safeCopy;
                setter($scope, orderBy(filtered, tableState.sort.predicate, tableState.sort.reverse));
            };

            /**
             * select a dataRow (it will add the attribute isSelected to the row object)
             * @param row the row to select
             * @param mode "single" or "multiple"
             */
            this.select = function select(row, mode) {
                var rows = getter($scope);
                var index = rows.indexOf(row);
                if (index !== -1) {
                    if (mode === 'single') {
                        ng.forEach(getter($scope), function (value, key) {
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
                this.pipe();
                $scope.$broadcast('st:reset');
            }
        }])
        .directive('stTable', function () {
            return {
                restrict: 'A',
                controller: 'stTableController',
                link: function (scope, element, attr, ctrl) {

                }
            }
        })
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
