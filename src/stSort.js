ng.module('smart-table')
    .directive('stSort', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            require: '^stTable',
            link: function (scope, element, attr, ctrl) {

                var predicate = attr.stSort;
                var getter = $parse(predicate);
                var index = 0;
                var classAscent = attr.stClassAscent || 'st-sort-ascent';
                var classDescent = attr.stClassDescent || 'st-sort-descent';
                var stateClasses = [classAscent, classDescent];

                //view --> table state
                function sort() {
                    index++;
                    if (index % 3 === 0 && attr.stSkipNatural === undefined) {
                        //manual reset
                        index = 0;
                        ctrl.tableState().sort = {};
                        ctrl.tableState().pagination.start = 0;
                        ctrl.pipe();
                    } else {
                        ctrl.sortBy(predicate, index % 2 === 0);
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

                //table state --> view
                scope.$watch(function () {
                    return ctrl.tableState().sort;
                }, function (newValue) {
                    if (newValue.predicate !== predicate) {
                        index = 0;
                        element
                            .removeClass(classAscent)
                            .removeClass(classDescent);
                    } else {
                        index = newValue.reverse === true ? 2 : 1;
                        element
                            .removeClass(stateClasses[index % 2])
                            .addClass(stateClasses[index - 1]);
                    }
                }, true);
            }
        };
    }]);
