/**
 * this is the implementation of https://github.com/angular-ui/bootstrap/blob/master/src/pagination/pagination.js adapted to smart-table needs
 */

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

                    var itemsByPage = ng.isNumber(attrs.stItemsByPage) ? parseInt(attrs.stItemsByPage, 10) : 10;
                    var displayedPages = ng.isNumber(attrs.stDisplayedPages) ? parseInt(attrs.stDisplayedPages, 10) : 5;

                    scope.currentPage = 1;
                    scope.pages = [];


                    scope.$watch(function () {
                            return ctrl.tableState().pagination;
                        },
                        function () {
                            var paginationState = ctrl.tableState().pagination;
                            var start = 1;
                            var end = start + displayedPages;
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
