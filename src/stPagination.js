(function (ng) {
    'use strict';
    ng.module('smart-table')
        .directive('stPagination', function () {
            return {
                restrict: 'EA',
                require: '^stTable',
                scope: {},
                template: '<div class="pagination" ng-if="pages.length >= 2"><ul class="pagination"><li ng-repeat="page in pages" ng-class="{active: page==currentPage}"><a ng-click="selectPage(page)">{{page}}</a></li></ul></div>',
                replace: true,
                link: function (scope, element, attrs, ctrl) {

                    function isNotNan(value) {
                        return !(typeof value === 'number' && isNaN(value));
                    }

                    var itemsByPage = isNotNan(parseInt(attrs.stItemsByPage, 10)) == true ? parseInt(attrs.stItemsByPage, 10) : 10;
                    var displayedPages = isNotNan(parseInt(attrs.stDisplayedPages, 10)) == true ? parseInt(attrs.stDisplayedPages, 10) : 5;

                    scope.currentPage = 1;
                    scope.pages = [];

                    //table state --> view
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

                    //view -> table state
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
