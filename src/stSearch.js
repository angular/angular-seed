(function (ng) {
    'use strict';
    ng.module('smart-table')
        .directive('stSearch', ['$timeout', function ($timeout) {
            return {
                replace: true,
                require: '^stTable',
                link: function (scope, element, attr, ctrl) {
                    var tableCtrl = ctrl;
                    var predicate = attr.stSearch || '';
                    var promise = null;
                    var throttle= attr.stDelay || 400;

                    element.bind('input', function (evt) {
                        evt = evt.originalEvent || evt;
                        if (promise !== null) {
                            $timeout.cancel(promise);
                        }
                        promise = $timeout(function () {
                            tableCtrl.search(evt.target.value, predicate);
                            promise = null;
                        }, throttle);
                    });
                }
            }
        }])
})(angular);
