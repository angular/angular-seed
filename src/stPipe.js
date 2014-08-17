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

                    if(ng.isFunction(scope.stPipe)){
                        ctrl.pipe=scope.stPipe.bind(ctrl, ctrl.tableState());
                    }
                }
            };
        });
})(angular);
