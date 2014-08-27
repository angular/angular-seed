(function (ng, undefined) {
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

                    function sort() {
                        index++;
                        var stateIndex = index % 2;
                        if (index % 3 === 0) {
                            //manual reset
                            ctrl.tableState().sort = {};
                            ctrl.tableState().pagination.start = 0;
                        } else {
                            ctrl.sortBy(predicate, stateIndex === 0);
                            element
                                .removeClass('st-sort-' + states[(stateIndex + 1) % 2])
                                .addClass('st-sort-' + states[stateIndex]);
                        }
                    }

                    if (ng.isFunction(getter(scope))) {
                        predicate = getter(scope);
                    }

                    element.bind('click', function sortClick() {
                        if (predicate) {
                            scope.$apply(sort);
                        }
                    });

                    if (attr.stSortDefault !== undefined) {
                        index = attr.stSortDefault === 'reverse' ? 1 : 0;
                        sort();
                    }

                    scope.$watch(function () {
                        return ctrl.tableState().sort;
                    }, function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            if (newValue.predicate !== predicate) {
                                reset();
                            }
                        }
                    }, true);

                }
            };
        }])
})(angular);
