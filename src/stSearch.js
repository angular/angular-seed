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
