/** 
* @version 1.4.12
* @license MIT
*/
(function (ng, undefined){
    'use strict';

ng.module('smart-table', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('template/smart-table/pagination.html',
        '<nav ng-if="pages.length >= 2"><ul class="pagination">' +
        '<li ng-repeat="page in pages" ng-class="{active: page==currentPage}"><a ng-click="selectPage(page)">{{page}}</a></li>' +
        '</ul></nav>');
}]);


ng.module('smart-table')
  .controller('stTableController', ['$scope', '$parse', '$filter', '$attrs', function StTableController($scope, $parse, $filter, $attrs) {
    var propertyName = $attrs.stTable;
    var displayGetter = $parse(propertyName);
    var displaySetter = displayGetter.assign;
    var safeGetter;
    var orderBy = $filter('orderBy');
    var filter = $filter('filter');
    var safeCopy = copyRefs(displayGetter($scope));
    var tableState = {
      sort: {},
      search: {},
      pagination: {
        start: 0
      }
    };
    var pipeAfterSafeCopy = true;
    var ctrl = this;
    var lastSelected;

    function copyRefs(src) {
      return src ? [].concat(src) : [];
    }

    function updateSafeCopy() {
      safeCopy = copyRefs(safeGetter($scope));
      if (pipeAfterSafeCopy === true) {
        ctrl.pipe();
      }
    }

    if ($attrs.stSafeSrc) {
      safeGetter = $parse($attrs.stSafeSrc);
      $scope.$watch(function () {
        var safeSrc = safeGetter($scope);
        return safeSrc ? safeSrc.length : 0;

      }, function (newValue, oldValue) {
        if (newValue !== safeCopy.length) {
          updateSafeCopy();
        }
      });
      $scope.$watch(function () {
        return safeGetter($scope);
      }, function (newValue, oldValue) {
        if (newValue !== oldValue) {
          updateSafeCopy();
        }
      });
    }

    /**
     * sort the rows
     * @param {Function | String} predicate - function or string which will be used as predicate for the sorting
     * @param [reverse] - if you want to reverse the order
     */
    this.sortBy = function sortBy(predicate, reverse) {
      tableState.sort.predicate = predicate;
      tableState.sort.reverse = reverse === true;

      if (ng.isFunction(predicate)) {
        tableState.sort.functionName = predicate.name;
      } else {
        delete tableState.sort.functionName;
      }

      tableState.pagination.start = 0;
      return this.pipe();
    };

    /**
     * search matching rows
     * @param {String} input - the input string
     * @param {String} [predicate] - the property name against you want to check the match, otherwise it will search on all properties
     */
    this.search = function search(input, predicate) {
      var predicateObject = tableState.search.predicateObject || {};
      var prop = predicate ? predicate : '$';

      input = ng.isString(input) ? input.trim() : input;
      predicateObject[prop] = input;
      // to avoid to filter out null value
      if (!input) {
        delete predicateObject[prop];
      }
      tableState.search.predicateObject = predicateObject;
      tableState.pagination.start = 0;
      return this.pipe();
    };

    /**
     * this will chain the operations of sorting and filtering based on the current table state (sort options, filtering, ect)
     */
    this.pipe = function pipe() {
      var pagination = tableState.pagination;
      var filtered = tableState.search.predicateObject ? filter(safeCopy, tableState.search.predicateObject) : safeCopy;
      if (tableState.sort.predicate) {
        filtered = orderBy(filtered, tableState.sort.predicate, tableState.sort.reverse);
      }
      if (pagination.number !== undefined) {
        pagination.numberOfPages = filtered.length > 0 ? Math.ceil(filtered.length / pagination.number) : 1;
        pagination.start = pagination.start >= filtered.length ? (pagination.numberOfPages - 1) * pagination.number : pagination.start;
        filtered = filtered.slice(pagination.start, pagination.start + parseInt(pagination.number));
      }
      displaySetter($scope, filtered);
    };

    /**
     * select a dataRow (it will add the attribute isSelected to the row object)
     * @param {Object} row - the row to select
     * @param {String} [mode] - "single" or "multiple" (multiple by default)
     */
    this.select = function select(row, mode) {
      var rows = safeCopy;
      var index = rows.indexOf(row);
      if (index !== -1) {
        if (mode === 'single') {
          row.isSelected = row.isSelected !== true;
          if (lastSelected) {
            lastSelected.isSelected = false;
          }
          lastSelected = row.isSelected === true ? row : undefined;
        } else {
          rows[index].isSelected = !rows[index].isSelected;
        }
      }
    };

    /**
     * take a slice of the current sorted/filtered collection (pagination)
     *
     * @param {Number} start - start index of the slice
     * @param {Number} number - the number of item in the slice
     */
    this.slice = function splice(start, number) {
      tableState.pagination.start = start;
      tableState.pagination.number = number;
      return this.pipe();
    };

    /**
     * return the current state of the table
     * @returns {{sort: {}, search: {}, pagination: {start: number}}}
     */
    this.tableState = function getTableState() {
      return tableState;
    };

    /**
     * Use a different filter function than the angular FilterFilter
     * @param filterName the name under which the custom filter is registered
     */
    this.setFilterFunction = function setFilterFunction(filterName) {
      filter = $filter(filterName);
    };

    /**
     *User a different function than the angular orderBy
     * @param sortFunctionName the name under which the custom order function is registered
     */
    this.setSortFunction = function setSortFunction(sortFunctionName) {
      orderBy = $filter(sortFunctionName);
    };

    /**
     * Usually when the safe copy is updated the pipe function is called.
     * Calling this method will prevent it, which is something required when using a custom pipe function
     */
    this.preventPipeOnWatch = function preventPipe() {
      pipeAfterSafeCopy = false;
    };
  }])
  .directive('stTable', function () {
    return {
      restrict: 'A',
      controller: 'stTableController',
      link: function (scope, element, attr, ctrl) {

        if (attr.stSetFilter) {
          ctrl.setFilterFunction(attr.stSetFilter);
        }

        if (attr.stSetSort) {
          ctrl.setSortFunction(attr.stSetSort);
        }
      }
    };
  });

ng.module('smart-table')
    .directive('stSearch', ['$timeout', function ($timeout) {
        return {
            require: '^stTable',
            link: function (scope, element, attr, ctrl) {
                var tableCtrl = ctrl;
                var promise = null;

                attr.$observe('stSearch', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        ctrl.tableState().search = {};
                        tableCtrl.search(element[0].value || '', newValue);
                    }
                });

                //table state -> view
                scope.$watch(function () {
                    return ctrl.tableState().search;
                }, function (newValue, oldValue) {
                    var predicateExpression = attr.stSearch || '$';
                    if (newValue.predicateObject && newValue.predicateObject[predicateExpression] !== element[0].value) {
                        element[0].value = newValue.predicateObject[predicateExpression] || '';
                    }
                }, true);

                // view -> table state
                element.bind('input', function (evt) {
                    evt = evt.originalEvent || evt;
                    if (promise !== null) {
                        $timeout.cancel(promise);
                    }

                    var throttle = attr.stDelay || 400;
                    promise = $timeout(function () {
                        tableCtrl.search(evt.target.value, attr.stSearch || '');
                        promise = null;
                    }, throttle);
                });
            }
        };
    }]);

ng.module('smart-table')
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

        scope.$watch('row.isSelected', function (newValue) {
          if (newValue === true) {
            element.addClass('st-selected');
          } else {
            element.removeClass('st-selected');
          }
        });
      }
    };
  });

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
        var sortDefault;

        if (attr.stSortDefault) {
          sortDefault = scope.$eval(attr.stSortDefault) !== undefined ?  scope.$eval(attr.stSortDefault) : attr.stSortDefault;
        }

        //view --> table state
        function sort() {
          index++;
          predicate = ng.isFunction(getter(scope)) ? getter(scope) : attr.stSort;
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

        element.bind('click', function sortClick() {
          if (predicate) {
            scope.$apply(sort);
          }
        });

        if (sortDefault) {
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

ng.module('smart-table')
  .directive('stPagination', function () {
    return {
      restrict: 'EA',
      require: '^stTable',
      scope: {
        stItemsByPage: '=?',
        stDisplayedPages: '=?',
        stPageChange: '&'
      },
      templateUrl: function (element, attrs) {
        if (attrs.stTemplate) {
          return attrs.stTemplate;
        }
        return 'template/smart-table/pagination.html';
      },
      link: function (scope, element, attrs, ctrl) {

        scope.stItemsByPage = scope.stItemsByPage ? +(scope.stItemsByPage) : 10;
        scope.stDisplayedPages = scope.stDisplayedPages ? +(scope.stDisplayedPages) : 5;

        scope.currentPage = 1;
        scope.pages = [];

        function redraw() {
          var paginationState = ctrl.tableState().pagination;
          var start = 1;
          var end;
          var i;
          var prevPage = scope.currentPage;
          scope.currentPage = Math.floor(paginationState.start / paginationState.number) + 1;

          start = Math.max(start, scope.currentPage - Math.abs(Math.floor(scope.stDisplayedPages / 2)));
          end = start + scope.stDisplayedPages;

          if (end > paginationState.numberOfPages) {
            end = paginationState.numberOfPages + 1;
            start = Math.max(1, end - scope.stDisplayedPages);
          }

          scope.pages = [];
          scope.numPages = paginationState.numberOfPages;

          for (i = start; i < end; i++) {
            scope.pages.push(i);
          }

          if (prevPage!==scope.currentPage) {
            scope.stPageChange({newPage: scope.currentPage});
          }
        }

        //table state --> view
        scope.$watch(function () {
          return ctrl.tableState().pagination;
        }, redraw, true);

        //scope --> table state  (--> view)
        scope.$watch('stItemsByPage', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            scope.selectPage(1);
          }
        });

        scope.$watch('stDisplayedPages', redraw);

        //view -> table state
        scope.selectPage = function (page) {
          if (page > 0 && page <= scope.numPages) {
            ctrl.slice((page - 1) * scope.stItemsByPage, scope.stItemsByPage);
          }
        };

        if(!ctrl.tableState().pagination.number){
          ctrl.slice(0, scope.stItemsByPage);
        }
      }
    };
  });

ng.module('smart-table')
  .directive('stPipe', function () {
    return {
      require: 'stTable',
      scope: {
        stPipe: '='
      },
      link: {

        pre: function (scope, element, attrs, ctrl) {
          if (ng.isFunction(scope.stPipe)) {
            ctrl.preventPipeOnWatch();
            ctrl.pipe = function () {
              return scope.stPipe(ctrl.tableState(), ctrl);
            }
          }
        },

        post: function (scope, element, attrs, ctrl) {
          ctrl.pipe();
        }
      }
    };
  });

})(angular);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy90b3AudHh0Iiwic3JjL3NtYXJ0LXRhYmxlLm1vZHVsZS5qcyIsInNyYy9zdFRhYmxlLmpzIiwic3JjL3N0U2VhcmNoLmpzIiwic3JjL3N0U2VsZWN0Um93LmpzIiwic3JjL3N0U29ydC5qcyIsInNyYy9zdFBhZ2luYXRpb24uanMiLCJzcmMvc3RQaXBlLmpzIiwic3JjL2JvdHRvbS50eHQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQSIsImZpbGUiOiJzbWFydC10YWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAobmcsIHVuZGVmaW5lZCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuIiwibmcubW9kdWxlKCdzbWFydC10YWJsZScsIFtdKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgndGVtcGxhdGUvc21hcnQtdGFibGUvcGFnaW5hdGlvbi5odG1sJyxcbiAgICAgICAgJzxuYXYgbmctaWY9XCJwYWdlcy5sZW5ndGggPj0gMlwiPjx1bCBjbGFzcz1cInBhZ2luYXRpb25cIj4nICtcbiAgICAgICAgJzxsaSBuZy1yZXBlYXQ9XCJwYWdlIGluIHBhZ2VzXCIgbmctY2xhc3M9XCJ7YWN0aXZlOiBwYWdlPT1jdXJyZW50UGFnZX1cIj48YSBuZy1jbGljaz1cInNlbGVjdFBhZ2UocGFnZSlcIj57e3BhZ2V9fTwvYT48L2xpPicgK1xuICAgICAgICAnPC91bD48L25hdj4nKTtcbn1dKTtcblxuIiwibmcubW9kdWxlKCdzbWFydC10YWJsZScpXG4gIC5jb250cm9sbGVyKCdzdFRhYmxlQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRwYXJzZScsICckZmlsdGVyJywgJyRhdHRycycsIGZ1bmN0aW9uIFN0VGFibGVDb250cm9sbGVyKCRzY29wZSwgJHBhcnNlLCAkZmlsdGVyLCAkYXR0cnMpIHtcbiAgICB2YXIgcHJvcGVydHlOYW1lID0gJGF0dHJzLnN0VGFibGU7XG4gICAgdmFyIGRpc3BsYXlHZXR0ZXIgPSAkcGFyc2UocHJvcGVydHlOYW1lKTtcbiAgICB2YXIgZGlzcGxheVNldHRlciA9IGRpc3BsYXlHZXR0ZXIuYXNzaWduO1xuICAgIHZhciBzYWZlR2V0dGVyO1xuICAgIHZhciBvcmRlckJ5ID0gJGZpbHRlcignb3JkZXJCeScpO1xuICAgIHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdmaWx0ZXInKTtcbiAgICB2YXIgc2FmZUNvcHkgPSBjb3B5UmVmcyhkaXNwbGF5R2V0dGVyKCRzY29wZSkpO1xuICAgIHZhciB0YWJsZVN0YXRlID0ge1xuICAgICAgc29ydDoge30sXG4gICAgICBzZWFyY2g6IHt9LFxuICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICBzdGFydDogMFxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIHBpcGVBZnRlclNhZmVDb3B5ID0gdHJ1ZTtcbiAgICB2YXIgY3RybCA9IHRoaXM7XG4gICAgdmFyIGxhc3RTZWxlY3RlZDtcblxuICAgIGZ1bmN0aW9uIGNvcHlSZWZzKHNyYykge1xuICAgICAgcmV0dXJuIHNyYyA/IFtdLmNvbmNhdChzcmMpIDogW107XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlU2FmZUNvcHkoKSB7XG4gICAgICBzYWZlQ29weSA9IGNvcHlSZWZzKHNhZmVHZXR0ZXIoJHNjb3BlKSk7XG4gICAgICBpZiAocGlwZUFmdGVyU2FmZUNvcHkgPT09IHRydWUpIHtcbiAgICAgICAgY3RybC5waXBlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCRhdHRycy5zdFNhZmVTcmMpIHtcbiAgICAgIHNhZmVHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzLnN0U2FmZVNyYyk7XG4gICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNhZmVTcmMgPSBzYWZlR2V0dGVyKCRzY29wZSk7XG4gICAgICAgIHJldHVybiBzYWZlU3JjID8gc2FmZVNyYy5sZW5ndGggOiAwO1xuXG4gICAgICB9LCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gc2FmZUNvcHkubGVuZ3RoKSB7XG4gICAgICAgICAgdXBkYXRlU2FmZUNvcHkoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHNhZmVHZXR0ZXIoJHNjb3BlKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9PSBvbGRWYWx1ZSkge1xuICAgICAgICAgIHVwZGF0ZVNhZmVDb3B5KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNvcnQgdGhlIHJvd3NcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uIHwgU3RyaW5nfSBwcmVkaWNhdGUgLSBmdW5jdGlvbiBvciBzdHJpbmcgd2hpY2ggd2lsbCBiZSB1c2VkIGFzIHByZWRpY2F0ZSBmb3IgdGhlIHNvcnRpbmdcbiAgICAgKiBAcGFyYW0gW3JldmVyc2VdIC0gaWYgeW91IHdhbnQgdG8gcmV2ZXJzZSB0aGUgb3JkZXJcbiAgICAgKi9cbiAgICB0aGlzLnNvcnRCeSA9IGZ1bmN0aW9uIHNvcnRCeShwcmVkaWNhdGUsIHJldmVyc2UpIHtcbiAgICAgIHRhYmxlU3RhdGUuc29ydC5wcmVkaWNhdGUgPSBwcmVkaWNhdGU7XG4gICAgICB0YWJsZVN0YXRlLnNvcnQucmV2ZXJzZSA9IHJldmVyc2UgPT09IHRydWU7XG5cbiAgICAgIGlmIChuZy5pc0Z1bmN0aW9uKHByZWRpY2F0ZSkpIHtcbiAgICAgICAgdGFibGVTdGF0ZS5zb3J0LmZ1bmN0aW9uTmFtZSA9IHByZWRpY2F0ZS5uYW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIHRhYmxlU3RhdGUuc29ydC5mdW5jdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHRhYmxlU3RhdGUucGFnaW5hdGlvbi5zdGFydCA9IDA7XG4gICAgICByZXR1cm4gdGhpcy5waXBlKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHNlYXJjaCBtYXRjaGluZyByb3dzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IC0gdGhlIGlucHV0IHN0cmluZ1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbcHJlZGljYXRlXSAtIHRoZSBwcm9wZXJ0eSBuYW1lIGFnYWluc3QgeW91IHdhbnQgdG8gY2hlY2sgdGhlIG1hdGNoLCBvdGhlcndpc2UgaXQgd2lsbCBzZWFyY2ggb24gYWxsIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICB0aGlzLnNlYXJjaCA9IGZ1bmN0aW9uIHNlYXJjaChpbnB1dCwgcHJlZGljYXRlKSB7XG4gICAgICB2YXIgcHJlZGljYXRlT2JqZWN0ID0gdGFibGVTdGF0ZS5zZWFyY2gucHJlZGljYXRlT2JqZWN0IHx8IHt9O1xuICAgICAgdmFyIHByb3AgPSBwcmVkaWNhdGUgPyBwcmVkaWNhdGUgOiAnJCc7XG5cbiAgICAgIGlucHV0ID0gbmcuaXNTdHJpbmcoaW5wdXQpID8gaW5wdXQudHJpbSgpIDogaW5wdXQ7XG4gICAgICBwcmVkaWNhdGVPYmplY3RbcHJvcF0gPSBpbnB1dDtcbiAgICAgIC8vIHRvIGF2b2lkIHRvIGZpbHRlciBvdXQgbnVsbCB2YWx1ZVxuICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICBkZWxldGUgcHJlZGljYXRlT2JqZWN0W3Byb3BdO1xuICAgICAgfVxuICAgICAgdGFibGVTdGF0ZS5zZWFyY2gucHJlZGljYXRlT2JqZWN0ID0gcHJlZGljYXRlT2JqZWN0O1xuICAgICAgdGFibGVTdGF0ZS5wYWdpbmF0aW9uLnN0YXJ0ID0gMDtcbiAgICAgIHJldHVybiB0aGlzLnBpcGUoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogdGhpcyB3aWxsIGNoYWluIHRoZSBvcGVyYXRpb25zIG9mIHNvcnRpbmcgYW5kIGZpbHRlcmluZyBiYXNlZCBvbiB0aGUgY3VycmVudCB0YWJsZSBzdGF0ZSAoc29ydCBvcHRpb25zLCBmaWx0ZXJpbmcsIGVjdClcbiAgICAgKi9cbiAgICB0aGlzLnBpcGUgPSBmdW5jdGlvbiBwaXBlKCkge1xuICAgICAgdmFyIHBhZ2luYXRpb24gPSB0YWJsZVN0YXRlLnBhZ2luYXRpb247XG4gICAgICB2YXIgZmlsdGVyZWQgPSB0YWJsZVN0YXRlLnNlYXJjaC5wcmVkaWNhdGVPYmplY3QgPyBmaWx0ZXIoc2FmZUNvcHksIHRhYmxlU3RhdGUuc2VhcmNoLnByZWRpY2F0ZU9iamVjdCkgOiBzYWZlQ29weTtcbiAgICAgIGlmICh0YWJsZVN0YXRlLnNvcnQucHJlZGljYXRlKSB7XG4gICAgICAgIGZpbHRlcmVkID0gb3JkZXJCeShmaWx0ZXJlZCwgdGFibGVTdGF0ZS5zb3J0LnByZWRpY2F0ZSwgdGFibGVTdGF0ZS5zb3J0LnJldmVyc2UpO1xuICAgICAgfVxuICAgICAgaWYgKHBhZ2luYXRpb24ubnVtYmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGFnaW5hdGlvbi5udW1iZXJPZlBhZ2VzID0gZmlsdGVyZWQubGVuZ3RoID4gMCA/IE1hdGguY2VpbChmaWx0ZXJlZC5sZW5ndGggLyBwYWdpbmF0aW9uLm51bWJlcikgOiAxO1xuICAgICAgICBwYWdpbmF0aW9uLnN0YXJ0ID0gcGFnaW5hdGlvbi5zdGFydCA+PSBmaWx0ZXJlZC5sZW5ndGggPyAocGFnaW5hdGlvbi5udW1iZXJPZlBhZ2VzIC0gMSkgKiBwYWdpbmF0aW9uLm51bWJlciA6IHBhZ2luYXRpb24uc3RhcnQ7XG4gICAgICAgIGZpbHRlcmVkID0gZmlsdGVyZWQuc2xpY2UocGFnaW5hdGlvbi5zdGFydCwgcGFnaW5hdGlvbi5zdGFydCArIHBhcnNlSW50KHBhZ2luYXRpb24ubnVtYmVyKSk7XG4gICAgICB9XG4gICAgICBkaXNwbGF5U2V0dGVyKCRzY29wZSwgZmlsdGVyZWQpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBzZWxlY3QgYSBkYXRhUm93IChpdCB3aWxsIGFkZCB0aGUgYXR0cmlidXRlIGlzU2VsZWN0ZWQgdG8gdGhlIHJvdyBvYmplY3QpXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJvdyAtIHRoZSByb3cgdG8gc2VsZWN0XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFttb2RlXSAtIFwic2luZ2xlXCIgb3IgXCJtdWx0aXBsZVwiIChtdWx0aXBsZSBieSBkZWZhdWx0KVxuICAgICAqL1xuICAgIHRoaXMuc2VsZWN0ID0gZnVuY3Rpb24gc2VsZWN0KHJvdywgbW9kZSkge1xuICAgICAgdmFyIHJvd3MgPSBzYWZlQ29weTtcbiAgICAgIHZhciBpbmRleCA9IHJvd3MuaW5kZXhPZihyb3cpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICBpZiAobW9kZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICAgICByb3cuaXNTZWxlY3RlZCA9IHJvdy5pc1NlbGVjdGVkICE9PSB0cnVlO1xuICAgICAgICAgIGlmIChsYXN0U2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIGxhc3RTZWxlY3RlZC5pc1NlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxhc3RTZWxlY3RlZCA9IHJvdy5pc1NlbGVjdGVkID09PSB0cnVlID8gcm93IDogdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJvd3NbaW5kZXhdLmlzU2VsZWN0ZWQgPSAhcm93c1tpbmRleF0uaXNTZWxlY3RlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiB0YWtlIGEgc2xpY2Ugb2YgdGhlIGN1cnJlbnQgc29ydGVkL2ZpbHRlcmVkIGNvbGxlY3Rpb24gKHBhZ2luYXRpb24pXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnQgLSBzdGFydCBpbmRleCBvZiB0aGUgc2xpY2VcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbnVtYmVyIC0gdGhlIG51bWJlciBvZiBpdGVtIGluIHRoZSBzbGljZVxuICAgICAqL1xuICAgIHRoaXMuc2xpY2UgPSBmdW5jdGlvbiBzcGxpY2Uoc3RhcnQsIG51bWJlcikge1xuICAgICAgdGFibGVTdGF0ZS5wYWdpbmF0aW9uLnN0YXJ0ID0gc3RhcnQ7XG4gICAgICB0YWJsZVN0YXRlLnBhZ2luYXRpb24ubnVtYmVyID0gbnVtYmVyO1xuICAgICAgcmV0dXJuIHRoaXMucGlwZSgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHRhYmxlXG4gICAgICogQHJldHVybnMge3tzb3J0OiB7fSwgc2VhcmNoOiB7fSwgcGFnaW5hdGlvbjoge3N0YXJ0OiBudW1iZXJ9fX1cbiAgICAgKi9cbiAgICB0aGlzLnRhYmxlU3RhdGUgPSBmdW5jdGlvbiBnZXRUYWJsZVN0YXRlKCkge1xuICAgICAgcmV0dXJuIHRhYmxlU3RhdGU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVzZSBhIGRpZmZlcmVudCBmaWx0ZXIgZnVuY3Rpb24gdGhhbiB0aGUgYW5ndWxhciBGaWx0ZXJGaWx0ZXJcbiAgICAgKiBAcGFyYW0gZmlsdGVyTmFtZSB0aGUgbmFtZSB1bmRlciB3aGljaCB0aGUgY3VzdG9tIGZpbHRlciBpcyByZWdpc3RlcmVkXG4gICAgICovXG4gICAgdGhpcy5zZXRGaWx0ZXJGdW5jdGlvbiA9IGZ1bmN0aW9uIHNldEZpbHRlckZ1bmN0aW9uKGZpbHRlck5hbWUpIHtcbiAgICAgIGZpbHRlciA9ICRmaWx0ZXIoZmlsdGVyTmFtZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqVXNlciBhIGRpZmZlcmVudCBmdW5jdGlvbiB0aGFuIHRoZSBhbmd1bGFyIG9yZGVyQnlcbiAgICAgKiBAcGFyYW0gc29ydEZ1bmN0aW9uTmFtZSB0aGUgbmFtZSB1bmRlciB3aGljaCB0aGUgY3VzdG9tIG9yZGVyIGZ1bmN0aW9uIGlzIHJlZ2lzdGVyZWRcbiAgICAgKi9cbiAgICB0aGlzLnNldFNvcnRGdW5jdGlvbiA9IGZ1bmN0aW9uIHNldFNvcnRGdW5jdGlvbihzb3J0RnVuY3Rpb25OYW1lKSB7XG4gICAgICBvcmRlckJ5ID0gJGZpbHRlcihzb3J0RnVuY3Rpb25OYW1lKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXN1YWxseSB3aGVuIHRoZSBzYWZlIGNvcHkgaXMgdXBkYXRlZCB0aGUgcGlwZSBmdW5jdGlvbiBpcyBjYWxsZWQuXG4gICAgICogQ2FsbGluZyB0aGlzIG1ldGhvZCB3aWxsIHByZXZlbnQgaXQsIHdoaWNoIGlzIHNvbWV0aGluZyByZXF1aXJlZCB3aGVuIHVzaW5nIGEgY3VzdG9tIHBpcGUgZnVuY3Rpb25cbiAgICAgKi9cbiAgICB0aGlzLnByZXZlbnRQaXBlT25XYXRjaCA9IGZ1bmN0aW9uIHByZXZlbnRQaXBlKCkge1xuICAgICAgcGlwZUFmdGVyU2FmZUNvcHkgPSBmYWxzZTtcbiAgICB9O1xuICB9XSlcbiAgLmRpcmVjdGl2ZSgnc3RUYWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdzdFRhYmxlQ29udHJvbGxlcicsXG4gICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIsIGN0cmwpIHtcblxuICAgICAgICBpZiAoYXR0ci5zdFNldEZpbHRlcikge1xuICAgICAgICAgIGN0cmwuc2V0RmlsdGVyRnVuY3Rpb24oYXR0ci5zdFNldEZpbHRlcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXR0ci5zdFNldFNvcnQpIHtcbiAgICAgICAgICBjdHJsLnNldFNvcnRGdW5jdGlvbihhdHRyLnN0U2V0U29ydCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbiIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnKVxuICAgIC5kaXJlY3RpdmUoJ3N0U2VhcmNoJywgWyckdGltZW91dCcsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVxdWlyZTogJ15zdFRhYmxlJyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0ciwgY3RybCkge1xuICAgICAgICAgICAgICAgIHZhciB0YWJsZUN0cmwgPSBjdHJsO1xuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGF0dHIuJG9ic2VydmUoJ3N0U2VhcmNoJywgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsLnRhYmxlU3RhdGUoKS5zZWFyY2ggPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlQ3RybC5zZWFyY2goZWxlbWVudFswXS52YWx1ZSB8fCAnJywgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvL3RhYmxlIHN0YXRlIC0+IHZpZXdcbiAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3RybC50YWJsZVN0YXRlKCkuc2VhcmNoO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByZWRpY2F0ZUV4cHJlc3Npb24gPSBhdHRyLnN0U2VhcmNoIHx8ICckJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlLnByZWRpY2F0ZU9iamVjdCAmJiBuZXdWYWx1ZS5wcmVkaWNhdGVPYmplY3RbcHJlZGljYXRlRXhwcmVzc2lvbl0gIT09IGVsZW1lbnRbMF0udmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRbMF0udmFsdWUgPSBuZXdWYWx1ZS5wcmVkaWNhdGVPYmplY3RbcHJlZGljYXRlRXhwcmVzc2lvbl0gfHwgJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIC8vIHZpZXcgLT4gdGFibGUgc3RhdGVcbiAgICAgICAgICAgICAgICBlbGVtZW50LmJpbmQoJ2lucHV0JywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICBldnQgPSBldnQub3JpZ2luYWxFdmVudCB8fCBldnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dC5jYW5jZWwocHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGhyb3R0bGUgPSBhdHRyLnN0RGVsYXkgfHwgNDAwO1xuICAgICAgICAgICAgICAgICAgICBwcm9taXNlID0gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVDdHJsLnNlYXJjaChldnQudGFyZ2V0LnZhbHVlLCBhdHRyLnN0U2VhcmNoIHx8ICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9LCB0aHJvdHRsZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pO1xuIiwibmcubW9kdWxlKCdzbWFydC10YWJsZScpXG4gIC5kaXJlY3RpdmUoJ3N0U2VsZWN0Um93JywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgcmVxdWlyZTogJ15zdFRhYmxlJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHJvdzogJz1zdFNlbGVjdFJvdydcbiAgICAgIH0sXG4gICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIsIGN0cmwpIHtcbiAgICAgICAgdmFyIG1vZGUgPSBhdHRyLnN0U2VsZWN0TW9kZSB8fCAnc2luZ2xlJztcbiAgICAgICAgZWxlbWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY3RybC5zZWxlY3Qoc2NvcGUucm93LCBtb2RlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2NvcGUuJHdhdGNoKCdyb3cuaXNTZWxlY3RlZCcsIGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnc3Qtc2VsZWN0ZWQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnc3Qtc2VsZWN0ZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuIiwibmcubW9kdWxlKCdzbWFydC10YWJsZScpXG4gIC5kaXJlY3RpdmUoJ3N0U29ydCcsIFsnJHBhcnNlJywgZnVuY3Rpb24gKCRwYXJzZSkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgcmVxdWlyZTogJ15zdFRhYmxlJyxcbiAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0ciwgY3RybCkge1xuXG4gICAgICAgIHZhciBwcmVkaWNhdGUgPSBhdHRyLnN0U29ydDtcbiAgICAgICAgdmFyIGdldHRlciA9ICRwYXJzZShwcmVkaWNhdGUpO1xuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICB2YXIgY2xhc3NBc2NlbnQgPSBhdHRyLnN0Q2xhc3NBc2NlbnQgfHwgJ3N0LXNvcnQtYXNjZW50JztcbiAgICAgICAgdmFyIGNsYXNzRGVzY2VudCA9IGF0dHIuc3RDbGFzc0Rlc2NlbnQgfHwgJ3N0LXNvcnQtZGVzY2VudCc7XG4gICAgICAgIHZhciBzdGF0ZUNsYXNzZXMgPSBbY2xhc3NBc2NlbnQsIGNsYXNzRGVzY2VudF07XG4gICAgICAgIHZhciBzb3J0RGVmYXVsdDtcblxuICAgICAgICBpZiAoYXR0ci5zdFNvcnREZWZhdWx0KSB7XG4gICAgICAgICAgc29ydERlZmF1bHQgPSBzY29wZS4kZXZhbChhdHRyLnN0U29ydERlZmF1bHQpICE9PSB1bmRlZmluZWQgPyAgc2NvcGUuJGV2YWwoYXR0ci5zdFNvcnREZWZhdWx0KSA6IGF0dHIuc3RTb3J0RGVmYXVsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vdmlldyAtLT4gdGFibGUgc3RhdGVcbiAgICAgICAgZnVuY3Rpb24gc29ydCgpIHtcbiAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgIHByZWRpY2F0ZSA9IG5nLmlzRnVuY3Rpb24oZ2V0dGVyKHNjb3BlKSkgPyBnZXR0ZXIoc2NvcGUpIDogYXR0ci5zdFNvcnQ7XG4gICAgICAgICAgaWYgKGluZGV4ICUgMyA9PT0gMCAmJiBhdHRyLnN0U2tpcE5hdHVyYWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy9tYW51YWwgcmVzZXRcbiAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgIGN0cmwudGFibGVTdGF0ZSgpLnNvcnQgPSB7fTtcbiAgICAgICAgICAgIGN0cmwudGFibGVTdGF0ZSgpLnBhZ2luYXRpb24uc3RhcnQgPSAwO1xuICAgICAgICAgICAgY3RybC5waXBlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN0cmwuc29ydEJ5KHByZWRpY2F0ZSwgaW5kZXggJSAyID09PSAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50LmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24gc29ydENsaWNrKCkge1xuICAgICAgICAgIGlmIChwcmVkaWNhdGUpIHtcbiAgICAgICAgICAgIHNjb3BlLiRhcHBseShzb3J0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzb3J0RGVmYXVsdCkge1xuICAgICAgICAgIGluZGV4ID0gYXR0ci5zdFNvcnREZWZhdWx0ID09PSAncmV2ZXJzZScgPyAxIDogMDtcbiAgICAgICAgICBzb3J0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL3RhYmxlIHN0YXRlIC0tPiB2aWV3XG4gICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGN0cmwudGFibGVTdGF0ZSgpLnNvcnQ7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgIGlmIChuZXdWYWx1ZS5wcmVkaWNhdGUgIT09IHByZWRpY2F0ZSkge1xuICAgICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICAgICAgZWxlbWVudFxuICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoY2xhc3NBc2NlbnQpXG4gICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhjbGFzc0Rlc2NlbnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbmRleCA9IG5ld1ZhbHVlLnJldmVyc2UgPT09IHRydWUgPyAyIDogMTtcbiAgICAgICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKHN0YXRlQ2xhc3Nlc1tpbmRleCAlIDJdKVxuICAgICAgICAgICAgICAuYWRkQ2xhc3Moc3RhdGVDbGFzc2VzW2luZGV4IC0gMV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfV0pO1xuIiwibmcubW9kdWxlKCdzbWFydC10YWJsZScpXG4gIC5kaXJlY3RpdmUoJ3N0UGFnaW5hdGlvbicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICByZXF1aXJlOiAnXnN0VGFibGUnLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgc3RJdGVtc0J5UGFnZTogJz0/JyxcbiAgICAgICAgc3REaXNwbGF5ZWRQYWdlczogJz0/JyxcbiAgICAgICAgc3RQYWdlQ2hhbmdlOiAnJidcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZVVybDogZnVuY3Rpb24gKGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIGlmIChhdHRycy5zdFRlbXBsYXRlKSB7XG4gICAgICAgICAgcmV0dXJuIGF0dHJzLnN0VGVtcGxhdGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICd0ZW1wbGF0ZS9zbWFydC10YWJsZS9wYWdpbmF0aW9uLmh0bWwnO1xuICAgICAgfSxcbiAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcblxuICAgICAgICBzY29wZS5zdEl0ZW1zQnlQYWdlID0gc2NvcGUuc3RJdGVtc0J5UGFnZSA/ICsoc2NvcGUuc3RJdGVtc0J5UGFnZSkgOiAxMDtcbiAgICAgICAgc2NvcGUuc3REaXNwbGF5ZWRQYWdlcyA9IHNjb3BlLnN0RGlzcGxheWVkUGFnZXMgPyArKHNjb3BlLnN0RGlzcGxheWVkUGFnZXMpIDogNTtcblxuICAgICAgICBzY29wZS5jdXJyZW50UGFnZSA9IDE7XG4gICAgICAgIHNjb3BlLnBhZ2VzID0gW107XG5cbiAgICAgICAgZnVuY3Rpb24gcmVkcmF3KCkge1xuICAgICAgICAgIHZhciBwYWdpbmF0aW9uU3RhdGUgPSBjdHJsLnRhYmxlU3RhdGUoKS5wYWdpbmF0aW9uO1xuICAgICAgICAgIHZhciBzdGFydCA9IDE7XG4gICAgICAgICAgdmFyIGVuZDtcbiAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICB2YXIgcHJldlBhZ2UgPSBzY29wZS5jdXJyZW50UGFnZTtcbiAgICAgICAgICBzY29wZS5jdXJyZW50UGFnZSA9IE1hdGguZmxvb3IocGFnaW5hdGlvblN0YXRlLnN0YXJ0IC8gcGFnaW5hdGlvblN0YXRlLm51bWJlcikgKyAxO1xuXG4gICAgICAgICAgc3RhcnQgPSBNYXRoLm1heChzdGFydCwgc2NvcGUuY3VycmVudFBhZ2UgLSBNYXRoLmFicyhNYXRoLmZsb29yKHNjb3BlLnN0RGlzcGxheWVkUGFnZXMgLyAyKSkpO1xuICAgICAgICAgIGVuZCA9IHN0YXJ0ICsgc2NvcGUuc3REaXNwbGF5ZWRQYWdlcztcblxuICAgICAgICAgIGlmIChlbmQgPiBwYWdpbmF0aW9uU3RhdGUubnVtYmVyT2ZQYWdlcykge1xuICAgICAgICAgICAgZW5kID0gcGFnaW5hdGlvblN0YXRlLm51bWJlck9mUGFnZXMgKyAxO1xuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLm1heCgxLCBlbmQgLSBzY29wZS5zdERpc3BsYXllZFBhZ2VzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzY29wZS5wYWdlcyA9IFtdO1xuICAgICAgICAgIHNjb3BlLm51bVBhZ2VzID0gcGFnaW5hdGlvblN0YXRlLm51bWJlck9mUGFnZXM7XG5cbiAgICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICBzY29wZS5wYWdlcy5wdXNoKGkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwcmV2UGFnZSE9PXNjb3BlLmN1cnJlbnRQYWdlKSB7XG4gICAgICAgICAgICBzY29wZS5zdFBhZ2VDaGFuZ2Uoe25ld1BhZ2U6IHNjb3BlLmN1cnJlbnRQYWdlfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy90YWJsZSBzdGF0ZSAtLT4gdmlld1xuICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjdHJsLnRhYmxlU3RhdGUoKS5wYWdpbmF0aW9uO1xuICAgICAgICB9LCByZWRyYXcsIHRydWUpO1xuXG4gICAgICAgIC8vc2NvcGUgLS0+IHRhYmxlIHN0YXRlICAoLS0+IHZpZXcpXG4gICAgICAgIHNjb3BlLiR3YXRjaCgnc3RJdGVtc0J5UGFnZScsIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICBpZiAobmV3VmFsdWUgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICBzY29wZS5zZWxlY3RQYWdlKDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2NvcGUuJHdhdGNoKCdzdERpc3BsYXllZFBhZ2VzJywgcmVkcmF3KTtcblxuICAgICAgICAvL3ZpZXcgLT4gdGFibGUgc3RhdGVcbiAgICAgICAgc2NvcGUuc2VsZWN0UGFnZSA9IGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgICAgaWYgKHBhZ2UgPiAwICYmIHBhZ2UgPD0gc2NvcGUubnVtUGFnZXMpIHtcbiAgICAgICAgICAgIGN0cmwuc2xpY2UoKHBhZ2UgLSAxKSAqIHNjb3BlLnN0SXRlbXNCeVBhZ2UsIHNjb3BlLnN0SXRlbXNCeVBhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZighY3RybC50YWJsZVN0YXRlKCkucGFnaW5hdGlvbi5udW1iZXIpe1xuICAgICAgICAgIGN0cmwuc2xpY2UoMCwgc2NvcGUuc3RJdGVtc0J5UGFnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbiIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnKVxuICAuZGlyZWN0aXZlKCdzdFBpcGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlcXVpcmU6ICdzdFRhYmxlJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHN0UGlwZTogJz0nXG4gICAgICB9LFxuICAgICAgbGluazoge1xuXG4gICAgICAgIHByZTogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xuICAgICAgICAgIGlmIChuZy5pc0Z1bmN0aW9uKHNjb3BlLnN0UGlwZSkpIHtcbiAgICAgICAgICAgIGN0cmwucHJldmVudFBpcGVPbldhdGNoKCk7XG4gICAgICAgICAgICBjdHJsLnBpcGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzY29wZS5zdFBpcGUoY3RybC50YWJsZVN0YXRlKCksIGN0cmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwb3N0OiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XG4gICAgICAgICAgY3RybC5waXBlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbiIsIn0pKGFuZ3VsYXIpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==