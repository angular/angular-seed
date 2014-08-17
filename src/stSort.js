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
