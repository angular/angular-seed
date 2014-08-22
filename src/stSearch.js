(function (ng) {
    'use strict';
    ng.module('smart-table')
        .directive('stSearch', ['$timeout', function ($timeout) {
            return {
                replace: true,
                require: '^stTable',
                scope: {
                    predicate: '=?stSearch'
                },
                link: function (scope, element, attr, ctrl) {
                    var tableCtrl = ctrl;
                    var promise = null;
                    var throttle = attr.stDelay || 400;

                    scope.$watch('predicate', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            ctrl.tableState().search = {};
                            tableCtrl.search(element[0].value || '', newValue);
                        }
                    });

                    element.bind('input', function (evt) {
                        evt = evt.originalEvent || evt;
                        if (promise !== null) {
                            $timeout.cancel(promise);
                        }
                        promise = $timeout(function () {
                            tableCtrl.search(evt.target.value, scope.predicate || '');
                            promise = null;
                        }, throttle);
                    });
                }
            }
        }])
})(angular);
