/** 
* @version 2.0.3
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
  .constant('stConfig', {
    pagination: {
      template: 'template/smart-table/pagination.html',
      itemsByPage: 10,
      displayedPages: 5
    },
    search: {
      delay: 400 // ms
    },
    select: {
      mode: 'single',
      selectedClass: 'st-selected'
    },
    sort: {
      ascentClass: 'st-sort-ascent',
      descentClass: 'st-sort-descent',
      skipNatural: false
    },
    pipe: {
      delay: 100 //ms
    }
  });
ng.module('smart-table')
  .controller('stTableController', ['$scope', '$parse', '$filter', '$attrs', function StTableController ($scope, $parse, $filter, $attrs) {
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
    var filtered;
    var pipeAfterSafeCopy = true;
    var ctrl = this;
    var lastSelected;

    function copyRefs (src) {
      return src ? [].concat(src) : [];
    }

    function updateSafeCopy () {
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
    this.sortBy = function sortBy (predicate, reverse) {
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
    this.search = function search (input, predicate) {
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
    this.pipe = function pipe () {
      var pagination = tableState.pagination;
      var output;
      filtered = tableState.search.predicateObject ? filter(safeCopy, tableState.search.predicateObject) : safeCopy;
      if (tableState.sort.predicate) {
        filtered = orderBy(filtered, tableState.sort.predicate, tableState.sort.reverse);
      }
      if (pagination.number !== undefined) {
        pagination.numberOfPages = filtered.length > 0 ? Math.ceil(filtered.length / pagination.number) : 1;
        pagination.start = pagination.start >= filtered.length ? (pagination.numberOfPages - 1) * pagination.number : pagination.start;
        output = filtered.slice(pagination.start, pagination.start + parseInt(pagination.number));
      }
      displaySetter($scope, output || filtered);
    };

    /**
     * select a dataRow (it will add the attribute isSelected to the row object)
     * @param {Object} row - the row to select
     * @param {String} [mode] - "single" or "multiple" (multiple by default)
     */
    this.select = function select (row, mode) {
      var rows = copyRefs(displayGetter($scope));
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
    this.slice = function splice (start, number) {
      tableState.pagination.start = start;
      tableState.pagination.number = number;
      return this.pipe();
    };

    /**
     * return the current state of the table
     * @returns {{sort: {}, search: {}, pagination: {start: number}}}
     */
    this.tableState = function getTableState () {
      return tableState;
    };

    this.getFilteredCollection = function getFilteredCollection () {
      return filtered || safeCopy;
    };

    /**
     * Use a different filter function than the angular FilterFilter
     * @param filterName the name under which the custom filter is registered
     */
    this.setFilterFunction = function setFilterFunction (filterName) {
      filter = $filter(filterName);
    };

    /**
     * Use a different function than the angular orderBy
     * @param sortFunctionName the name under which the custom order function is registered
     */
    this.setSortFunction = function setSortFunction (sortFunctionName) {
      orderBy = $filter(sortFunctionName);
    };

    /**
     * Usually when the safe copy is updated the pipe function is called.
     * Calling this method will prevent it, which is something required when using a custom pipe function
     */
    this.preventPipeOnWatch = function preventPipe () {
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
  .directive('stSearch', ['stConfig', '$timeout', function (stConfig, $timeout) {
    return {
      require: '^stTable',
      link: function (scope, element, attr, ctrl) {
        var tableCtrl = ctrl;
        var promise = null;
        var throttle = attr.stDelay || stConfig.search.delay;

        attr.$observe('stSearch', function (newValue, oldValue) {
          var input = element[0].value;
          if (newValue !== oldValue && input) {
            ctrl.tableState().search = {};
            tableCtrl.search(input, newValue);
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

          promise = $timeout(function () {
            tableCtrl.search(evt.target.value, attr.stSearch || '');
            promise = null;
          }, throttle);
        });
      }
    };
  }]);

ng.module('smart-table')
  .directive('stSelectRow', ['stConfig', function (stConfig) {
    return {
      restrict: 'A',
      require: '^stTable',
      scope: {
        row: '=stSelectRow'
      },
      link: function (scope, element, attr, ctrl) {
        var mode = attr.stSelectMode || stConfig.select.mode;
        element.bind('click', function () {
          scope.$apply(function () {
            ctrl.select(scope.row, mode);
          });
        });

        scope.$watch('row.isSelected', function (newValue) {
          if (newValue === true) {
            element.addClass(stConfig.select.selectedClass);
          } else {
            element.removeClass(stConfig.select.selectedClass);
          }
        });
      }
    };
  }]);

ng.module('smart-table')
  .directive('stSort', ['stConfig', '$parse', function (stConfig, $parse) {
    return {
      restrict: 'A',
      require: '^stTable',
      link: function (scope, element, attr, ctrl) {

        var predicate = attr.stSort;
        var getter = $parse(predicate);
        var index = 0;
        var classAscent = attr.stClassAscent || stConfig.sort.ascentClass;
        var classDescent = attr.stClassDescent || stConfig.sort.descentClass;
        var stateClasses = [classAscent, classDescent];
        var sortDefault;
        var skipNatural = attr.stSkipNatural !== undefined ? attr.stSkipNatural : stConfig.skipNatural;

        if (attr.stSortDefault) {
          sortDefault = scope.$eval(attr.stSortDefault) !== undefined ? scope.$eval(attr.stSortDefault) : attr.stSortDefault;
        }

        //view --> table state
        function sort () {
          index++;
          predicate = ng.isFunction(getter(scope)) ? getter(scope) : attr.stSort;
          if (index % 3 === 0 && !!skipNatural !== true) {
            //manual reset
            index = 0;
            ctrl.tableState().sort = {};
            ctrl.tableState().pagination.start = 0;
            ctrl.pipe();
          } else {
            ctrl.sortBy(predicate, index % 2 === 0);
          }
        }

        element.bind('click', function sortClick () {
          if (predicate) {
            scope.$apply(sort);
          }
        });

        if (sortDefault) {
          index = sortDefault === 'reverse' ? 1 : 0;
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
  .directive('stPagination', ['stConfig', function (stConfig) {
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
        return stConfig.pagination.template;
      },
      link: function (scope, element, attrs, ctrl) {

        scope.stItemsByPage = scope.stItemsByPage ? +(scope.stItemsByPage) : stConfig.pagination.itemsByPage;
        scope.stDisplayedPages = scope.stDisplayedPages ? +(scope.stDisplayedPages) : stConfig.pagination.displayedPages;

        scope.currentPage = 1;
        scope.pages = [];

        function redraw () {
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

          if (prevPage !== scope.currentPage) {
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

        if (!ctrl.tableState().pagination.number) {
          ctrl.slice(0, scope.stItemsByPage);
        }
      }
    };
  }]);

ng.module('smart-table')
  .directive('stPipe', ['stConfig', '$timeout', function (config, $timeout) {
    return {
      require: 'stTable',
      scope: {
        stPipe: '='
      },
      link: {

        pre: function (scope, element, attrs, ctrl) {

          var pipePromise = null;

          if (ng.isFunction(scope.stPipe)) {
            ctrl.preventPipeOnWatch();
            ctrl.pipe = function () {

              if (pipePromise !== null) {
                $timeout.cancel(pipePromise)
              }

              pipePromise = $timeout(function () {
                scope.stPipe(ctrl.tableState(), ctrl);
              }, config.pipe.delay);

              return pipePromise;
            }
          }
        },

        post: function (scope, element, attrs, ctrl) {
          ctrl.pipe();
        }
      }
    };
  }]);

})(angular);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy90b3AudHh0Iiwic3JjL3NtYXJ0LXRhYmxlLm1vZHVsZS5qcyIsInNyYy9zdENvbmZpZy5qcyIsInNyYy9zdFRhYmxlLmpzIiwic3JjL3N0U2VhcmNoLmpzIiwic3JjL3N0U2VsZWN0Um93LmpzIiwic3JjL3N0U29ydC5qcyIsInNyYy9zdFBhZ2luYXRpb24uanMiLCJzcmMvc3RQaXBlLmpzIiwic3JjL2JvdHRvbS50eHQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQSIsImZpbGUiOiJzbWFydC10YWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAobmcsIHVuZGVmaW5lZCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuIiwibmcubW9kdWxlKCdzbWFydC10YWJsZScsIFtdKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgndGVtcGxhdGUvc21hcnQtdGFibGUvcGFnaW5hdGlvbi5odG1sJyxcbiAgICAgICAgJzxuYXYgbmctaWY9XCJwYWdlcy5sZW5ndGggPj0gMlwiPjx1bCBjbGFzcz1cInBhZ2luYXRpb25cIj4nICtcbiAgICAgICAgJzxsaSBuZy1yZXBlYXQ9XCJwYWdlIGluIHBhZ2VzXCIgbmctY2xhc3M9XCJ7YWN0aXZlOiBwYWdlPT1jdXJyZW50UGFnZX1cIj48YSBuZy1jbGljaz1cInNlbGVjdFBhZ2UocGFnZSlcIj57e3BhZ2V9fTwvYT48L2xpPicgK1xuICAgICAgICAnPC91bD48L25hdj4nKTtcbn1dKTtcblxuIiwibmcubW9kdWxlKCdzbWFydC10YWJsZScpXG4gIC5jb25zdGFudCgnc3RDb25maWcnLCB7XG4gICAgcGFnaW5hdGlvbjoge1xuICAgICAgdGVtcGxhdGU6ICd0ZW1wbGF0ZS9zbWFydC10YWJsZS9wYWdpbmF0aW9uLmh0bWwnLFxuICAgICAgaXRlbXNCeVBhZ2U6IDEwLFxuICAgICAgZGlzcGxheWVkUGFnZXM6IDVcbiAgICB9LFxuICAgIHNlYXJjaDoge1xuICAgICAgZGVsYXk6IDQwMCAvLyBtc1xuICAgIH0sXG4gICAgc2VsZWN0OiB7XG4gICAgICBtb2RlOiAnc2luZ2xlJyxcbiAgICAgIHNlbGVjdGVkQ2xhc3M6ICdzdC1zZWxlY3RlZCdcbiAgICB9LFxuICAgIHNvcnQ6IHtcbiAgICAgIGFzY2VudENsYXNzOiAnc3Qtc29ydC1hc2NlbnQnLFxuICAgICAgZGVzY2VudENsYXNzOiAnc3Qtc29ydC1kZXNjZW50JyxcbiAgICAgIHNraXBOYXR1cmFsOiBmYWxzZVxuICAgIH0sXG4gICAgcGlwZToge1xuICAgICAgZGVsYXk6IDEwMCAvL21zXG4gICAgfVxuICB9KTsiLCJuZy5tb2R1bGUoJ3NtYXJ0LXRhYmxlJylcbiAgLmNvbnRyb2xsZXIoJ3N0VGFibGVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHBhcnNlJywgJyRmaWx0ZXInLCAnJGF0dHJzJywgZnVuY3Rpb24gU3RUYWJsZUNvbnRyb2xsZXIgKCRzY29wZSwgJHBhcnNlLCAkZmlsdGVyLCAkYXR0cnMpIHtcbiAgICB2YXIgcHJvcGVydHlOYW1lID0gJGF0dHJzLnN0VGFibGU7XG4gICAgdmFyIGRpc3BsYXlHZXR0ZXIgPSAkcGFyc2UocHJvcGVydHlOYW1lKTtcbiAgICB2YXIgZGlzcGxheVNldHRlciA9IGRpc3BsYXlHZXR0ZXIuYXNzaWduO1xuICAgIHZhciBzYWZlR2V0dGVyO1xuICAgIHZhciBvcmRlckJ5ID0gJGZpbHRlcignb3JkZXJCeScpO1xuICAgIHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdmaWx0ZXInKTtcbiAgICB2YXIgc2FmZUNvcHkgPSBjb3B5UmVmcyhkaXNwbGF5R2V0dGVyKCRzY29wZSkpO1xuICAgIHZhciB0YWJsZVN0YXRlID0ge1xuICAgICAgc29ydDoge30sXG4gICAgICBzZWFyY2g6IHt9LFxuICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICBzdGFydDogMFxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGZpbHRlcmVkO1xuICAgIHZhciBwaXBlQWZ0ZXJTYWZlQ29weSA9IHRydWU7XG4gICAgdmFyIGN0cmwgPSB0aGlzO1xuICAgIHZhciBsYXN0U2VsZWN0ZWQ7XG5cbiAgICBmdW5jdGlvbiBjb3B5UmVmcyAoc3JjKSB7XG4gICAgICByZXR1cm4gc3JjID8gW10uY29uY2F0KHNyYykgOiBbXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVTYWZlQ29weSAoKSB7XG4gICAgICBzYWZlQ29weSA9IGNvcHlSZWZzKHNhZmVHZXR0ZXIoJHNjb3BlKSk7XG4gICAgICBpZiAocGlwZUFmdGVyU2FmZUNvcHkgPT09IHRydWUpIHtcbiAgICAgICAgY3RybC5waXBlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCRhdHRycy5zdFNhZmVTcmMpIHtcbiAgICAgIHNhZmVHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzLnN0U2FmZVNyYyk7XG4gICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNhZmVTcmMgPSBzYWZlR2V0dGVyKCRzY29wZSk7XG4gICAgICAgIHJldHVybiBzYWZlU3JjID8gc2FmZVNyYy5sZW5ndGggOiAwO1xuXG4gICAgICB9LCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gc2FmZUNvcHkubGVuZ3RoKSB7XG4gICAgICAgICAgdXBkYXRlU2FmZUNvcHkoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHNhZmVHZXR0ZXIoJHNjb3BlKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9PSBvbGRWYWx1ZSkge1xuICAgICAgICAgIHVwZGF0ZVNhZmVDb3B5KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNvcnQgdGhlIHJvd3NcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uIHwgU3RyaW5nfSBwcmVkaWNhdGUgLSBmdW5jdGlvbiBvciBzdHJpbmcgd2hpY2ggd2lsbCBiZSB1c2VkIGFzIHByZWRpY2F0ZSBmb3IgdGhlIHNvcnRpbmdcbiAgICAgKiBAcGFyYW0gW3JldmVyc2VdIC0gaWYgeW91IHdhbnQgdG8gcmV2ZXJzZSB0aGUgb3JkZXJcbiAgICAgKi9cbiAgICB0aGlzLnNvcnRCeSA9IGZ1bmN0aW9uIHNvcnRCeSAocHJlZGljYXRlLCByZXZlcnNlKSB7XG4gICAgICB0YWJsZVN0YXRlLnNvcnQucHJlZGljYXRlID0gcHJlZGljYXRlO1xuICAgICAgdGFibGVTdGF0ZS5zb3J0LnJldmVyc2UgPSByZXZlcnNlID09PSB0cnVlO1xuXG4gICAgICBpZiAobmcuaXNGdW5jdGlvbihwcmVkaWNhdGUpKSB7XG4gICAgICAgIHRhYmxlU3RhdGUuc29ydC5mdW5jdGlvbk5hbWUgPSBwcmVkaWNhdGUubmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSB0YWJsZVN0YXRlLnNvcnQuZnVuY3Rpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICB0YWJsZVN0YXRlLnBhZ2luYXRpb24uc3RhcnQgPSAwO1xuICAgICAgcmV0dXJuIHRoaXMucGlwZSgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBzZWFyY2ggbWF0Y2hpbmcgcm93c1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCAtIHRoZSBpbnB1dCBzdHJpbmdcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW3ByZWRpY2F0ZV0gLSB0aGUgcHJvcGVydHkgbmFtZSBhZ2FpbnN0IHlvdSB3YW50IHRvIGNoZWNrIHRoZSBtYXRjaCwgb3RoZXJ3aXNlIGl0IHdpbGwgc2VhcmNoIG9uIGFsbCBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgdGhpcy5zZWFyY2ggPSBmdW5jdGlvbiBzZWFyY2ggKGlucHV0LCBwcmVkaWNhdGUpIHtcbiAgICAgIHZhciBwcmVkaWNhdGVPYmplY3QgPSB0YWJsZVN0YXRlLnNlYXJjaC5wcmVkaWNhdGVPYmplY3QgfHwge307XG4gICAgICB2YXIgcHJvcCA9IHByZWRpY2F0ZSA/IHByZWRpY2F0ZSA6ICckJztcblxuICAgICAgaW5wdXQgPSBuZy5pc1N0cmluZyhpbnB1dCkgPyBpbnB1dC50cmltKCkgOiBpbnB1dDtcbiAgICAgIHByZWRpY2F0ZU9iamVjdFtwcm9wXSA9IGlucHV0O1xuICAgICAgLy8gdG8gYXZvaWQgdG8gZmlsdGVyIG91dCBudWxsIHZhbHVlXG4gICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgIGRlbGV0ZSBwcmVkaWNhdGVPYmplY3RbcHJvcF07XG4gICAgICB9XG4gICAgICB0YWJsZVN0YXRlLnNlYXJjaC5wcmVkaWNhdGVPYmplY3QgPSBwcmVkaWNhdGVPYmplY3Q7XG4gICAgICB0YWJsZVN0YXRlLnBhZ2luYXRpb24uc3RhcnQgPSAwO1xuICAgICAgcmV0dXJuIHRoaXMucGlwZSgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiB0aGlzIHdpbGwgY2hhaW4gdGhlIG9wZXJhdGlvbnMgb2Ygc29ydGluZyBhbmQgZmlsdGVyaW5nIGJhc2VkIG9uIHRoZSBjdXJyZW50IHRhYmxlIHN0YXRlIChzb3J0IG9wdGlvbnMsIGZpbHRlcmluZywgZWN0KVxuICAgICAqL1xuICAgIHRoaXMucGlwZSA9IGZ1bmN0aW9uIHBpcGUgKCkge1xuICAgICAgdmFyIHBhZ2luYXRpb24gPSB0YWJsZVN0YXRlLnBhZ2luYXRpb247XG4gICAgICB2YXIgb3V0cHV0O1xuICAgICAgZmlsdGVyZWQgPSB0YWJsZVN0YXRlLnNlYXJjaC5wcmVkaWNhdGVPYmplY3QgPyBmaWx0ZXIoc2FmZUNvcHksIHRhYmxlU3RhdGUuc2VhcmNoLnByZWRpY2F0ZU9iamVjdCkgOiBzYWZlQ29weTtcbiAgICAgIGlmICh0YWJsZVN0YXRlLnNvcnQucHJlZGljYXRlKSB7XG4gICAgICAgIGZpbHRlcmVkID0gb3JkZXJCeShmaWx0ZXJlZCwgdGFibGVTdGF0ZS5zb3J0LnByZWRpY2F0ZSwgdGFibGVTdGF0ZS5zb3J0LnJldmVyc2UpO1xuICAgICAgfVxuICAgICAgaWYgKHBhZ2luYXRpb24ubnVtYmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGFnaW5hdGlvbi5udW1iZXJPZlBhZ2VzID0gZmlsdGVyZWQubGVuZ3RoID4gMCA/IE1hdGguY2VpbChmaWx0ZXJlZC5sZW5ndGggLyBwYWdpbmF0aW9uLm51bWJlcikgOiAxO1xuICAgICAgICBwYWdpbmF0aW9uLnN0YXJ0ID0gcGFnaW5hdGlvbi5zdGFydCA+PSBmaWx0ZXJlZC5sZW5ndGggPyAocGFnaW5hdGlvbi5udW1iZXJPZlBhZ2VzIC0gMSkgKiBwYWdpbmF0aW9uLm51bWJlciA6IHBhZ2luYXRpb24uc3RhcnQ7XG4gICAgICAgIG91dHB1dCA9IGZpbHRlcmVkLnNsaWNlKHBhZ2luYXRpb24uc3RhcnQsIHBhZ2luYXRpb24uc3RhcnQgKyBwYXJzZUludChwYWdpbmF0aW9uLm51bWJlcikpO1xuICAgICAgfVxuICAgICAgZGlzcGxheVNldHRlcigkc2NvcGUsIG91dHB1dCB8fCBmaWx0ZXJlZCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHNlbGVjdCBhIGRhdGFSb3cgKGl0IHdpbGwgYWRkIHRoZSBhdHRyaWJ1dGUgaXNTZWxlY3RlZCB0byB0aGUgcm93IG9iamVjdClcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcm93IC0gdGhlIHJvdyB0byBzZWxlY3RcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW21vZGVdIC0gXCJzaW5nbGVcIiBvciBcIm11bHRpcGxlXCIgKG11bHRpcGxlIGJ5IGRlZmF1bHQpXG4gICAgICovXG4gICAgdGhpcy5zZWxlY3QgPSBmdW5jdGlvbiBzZWxlY3QgKHJvdywgbW9kZSkge1xuICAgICAgdmFyIHJvd3MgPSBjb3B5UmVmcyhkaXNwbGF5R2V0dGVyKCRzY29wZSkpO1xuICAgICAgdmFyIGluZGV4ID0gcm93cy5pbmRleE9mKHJvdyk7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIGlmIChtb2RlID09PSAnc2luZ2xlJykge1xuICAgICAgICAgIHJvdy5pc1NlbGVjdGVkID0gcm93LmlzU2VsZWN0ZWQgIT09IHRydWU7XG4gICAgICAgICAgaWYgKGxhc3RTZWxlY3RlZCkge1xuICAgICAgICAgICAgbGFzdFNlbGVjdGVkLmlzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGFzdFNlbGVjdGVkID0gcm93LmlzU2VsZWN0ZWQgPT09IHRydWUgPyByb3cgOiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcm93c1tpbmRleF0uaXNTZWxlY3RlZCA9ICFyb3dzW2luZGV4XS5pc1NlbGVjdGVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHRha2UgYSBzbGljZSBvZiB0aGUgY3VycmVudCBzb3J0ZWQvZmlsdGVyZWQgY29sbGVjdGlvbiAocGFnaW5hdGlvbilcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydCAtIHN0YXJ0IGluZGV4IG9mIHRoZSBzbGljZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBudW1iZXIgLSB0aGUgbnVtYmVyIG9mIGl0ZW0gaW4gdGhlIHNsaWNlXG4gICAgICovXG4gICAgdGhpcy5zbGljZSA9IGZ1bmN0aW9uIHNwbGljZSAoc3RhcnQsIG51bWJlcikge1xuICAgICAgdGFibGVTdGF0ZS5wYWdpbmF0aW9uLnN0YXJ0ID0gc3RhcnQ7XG4gICAgICB0YWJsZVN0YXRlLnBhZ2luYXRpb24ubnVtYmVyID0gbnVtYmVyO1xuICAgICAgcmV0dXJuIHRoaXMucGlwZSgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHRhYmxlXG4gICAgICogQHJldHVybnMge3tzb3J0OiB7fSwgc2VhcmNoOiB7fSwgcGFnaW5hdGlvbjoge3N0YXJ0OiBudW1iZXJ9fX1cbiAgICAgKi9cbiAgICB0aGlzLnRhYmxlU3RhdGUgPSBmdW5jdGlvbiBnZXRUYWJsZVN0YXRlICgpIHtcbiAgICAgIHJldHVybiB0YWJsZVN0YXRlO1xuICAgIH07XG5cbiAgICB0aGlzLmdldEZpbHRlcmVkQ29sbGVjdGlvbiA9IGZ1bmN0aW9uIGdldEZpbHRlcmVkQ29sbGVjdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZmlsdGVyZWQgfHwgc2FmZUNvcHk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVzZSBhIGRpZmZlcmVudCBmaWx0ZXIgZnVuY3Rpb24gdGhhbiB0aGUgYW5ndWxhciBGaWx0ZXJGaWx0ZXJcbiAgICAgKiBAcGFyYW0gZmlsdGVyTmFtZSB0aGUgbmFtZSB1bmRlciB3aGljaCB0aGUgY3VzdG9tIGZpbHRlciBpcyByZWdpc3RlcmVkXG4gICAgICovXG4gICAgdGhpcy5zZXRGaWx0ZXJGdW5jdGlvbiA9IGZ1bmN0aW9uIHNldEZpbHRlckZ1bmN0aW9uIChmaWx0ZXJOYW1lKSB7XG4gICAgICBmaWx0ZXIgPSAkZmlsdGVyKGZpbHRlck5hbWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVc2UgYSBkaWZmZXJlbnQgZnVuY3Rpb24gdGhhbiB0aGUgYW5ndWxhciBvcmRlckJ5XG4gICAgICogQHBhcmFtIHNvcnRGdW5jdGlvbk5hbWUgdGhlIG5hbWUgdW5kZXIgd2hpY2ggdGhlIGN1c3RvbSBvcmRlciBmdW5jdGlvbiBpcyByZWdpc3RlcmVkXG4gICAgICovXG4gICAgdGhpcy5zZXRTb3J0RnVuY3Rpb24gPSBmdW5jdGlvbiBzZXRTb3J0RnVuY3Rpb24gKHNvcnRGdW5jdGlvbk5hbWUpIHtcbiAgICAgIG9yZGVyQnkgPSAkZmlsdGVyKHNvcnRGdW5jdGlvbk5hbWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVc3VhbGx5IHdoZW4gdGhlIHNhZmUgY29weSBpcyB1cGRhdGVkIHRoZSBwaXBlIGZ1bmN0aW9uIGlzIGNhbGxlZC5cbiAgICAgKiBDYWxsaW5nIHRoaXMgbWV0aG9kIHdpbGwgcHJldmVudCBpdCwgd2hpY2ggaXMgc29tZXRoaW5nIHJlcXVpcmVkIHdoZW4gdXNpbmcgYSBjdXN0b20gcGlwZSBmdW5jdGlvblxuICAgICAqL1xuICAgIHRoaXMucHJldmVudFBpcGVPbldhdGNoID0gZnVuY3Rpb24gcHJldmVudFBpcGUgKCkge1xuICAgICAgcGlwZUFmdGVyU2FmZUNvcHkgPSBmYWxzZTtcbiAgICB9O1xuICB9XSlcbiAgLmRpcmVjdGl2ZSgnc3RUYWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdzdFRhYmxlQ29udHJvbGxlcicsXG4gICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIsIGN0cmwpIHtcblxuICAgICAgICBpZiAoYXR0ci5zdFNldEZpbHRlcikge1xuICAgICAgICAgIGN0cmwuc2V0RmlsdGVyRnVuY3Rpb24oYXR0ci5zdFNldEZpbHRlcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXR0ci5zdFNldFNvcnQpIHtcbiAgICAgICAgICBjdHJsLnNldFNvcnRGdW5jdGlvbihhdHRyLnN0U2V0U29ydCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbiIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnKVxuICAuZGlyZWN0aXZlKCdzdFNlYXJjaCcsIFsnc3RDb25maWcnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbiAoc3RDb25maWcsICR0aW1lb3V0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlcXVpcmU6ICdec3RUYWJsZScsXG4gICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIsIGN0cmwpIHtcbiAgICAgICAgdmFyIHRhYmxlQ3RybCA9IGN0cmw7XG4gICAgICAgIHZhciBwcm9taXNlID0gbnVsbDtcbiAgICAgICAgdmFyIHRocm90dGxlID0gYXR0ci5zdERlbGF5IHx8IHN0Q29uZmlnLnNlYXJjaC5kZWxheTtcblxuICAgICAgICBhdHRyLiRvYnNlcnZlKCdzdFNlYXJjaCcsIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICB2YXIgaW5wdXQgPSBlbGVtZW50WzBdLnZhbHVlO1xuICAgICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gb2xkVmFsdWUgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgIGN0cmwudGFibGVTdGF0ZSgpLnNlYXJjaCA9IHt9O1xuICAgICAgICAgICAgdGFibGVDdHJsLnNlYXJjaChpbnB1dCwgbmV3VmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy90YWJsZSBzdGF0ZSAtPiB2aWV3XG4gICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGN0cmwudGFibGVTdGF0ZSgpLnNlYXJjaDtcbiAgICAgICAgfSwgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgIHZhciBwcmVkaWNhdGVFeHByZXNzaW9uID0gYXR0ci5zdFNlYXJjaCB8fCAnJCc7XG4gICAgICAgICAgaWYgKG5ld1ZhbHVlLnByZWRpY2F0ZU9iamVjdCAmJiBuZXdWYWx1ZS5wcmVkaWNhdGVPYmplY3RbcHJlZGljYXRlRXhwcmVzc2lvbl0gIT09IGVsZW1lbnRbMF0udmFsdWUpIHtcbiAgICAgICAgICAgIGVsZW1lbnRbMF0udmFsdWUgPSBuZXdWYWx1ZS5wcmVkaWNhdGVPYmplY3RbcHJlZGljYXRlRXhwcmVzc2lvbl0gfHwgJyc7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAvLyB2aWV3IC0+IHRhYmxlIHN0YXRlXG4gICAgICAgIGVsZW1lbnQuYmluZCgnaW5wdXQnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgZXZ0ID0gZXZ0Lm9yaWdpbmFsRXZlbnQgfHwgZXZ0O1xuICAgICAgICAgIGlmIChwcm9taXNlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAkdGltZW91dC5jYW5jZWwocHJvbWlzZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcHJvbWlzZSA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRhYmxlQ3RybC5zZWFyY2goZXZ0LnRhcmdldC52YWx1ZSwgYXR0ci5zdFNlYXJjaCB8fCAnJyk7XG4gICAgICAgICAgICBwcm9taXNlID0gbnVsbDtcbiAgICAgICAgICB9LCB0aHJvdHRsZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1dKTtcbiIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnKVxuICAuZGlyZWN0aXZlKCdzdFNlbGVjdFJvdycsIFsnc3RDb25maWcnLCBmdW5jdGlvbiAoc3RDb25maWcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgIHJlcXVpcmU6ICdec3RUYWJsZScsXG4gICAgICBzY29wZToge1xuICAgICAgICByb3c6ICc9c3RTZWxlY3RSb3cnXG4gICAgICB9LFxuICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyLCBjdHJsKSB7XG4gICAgICAgIHZhciBtb2RlID0gYXR0ci5zdFNlbGVjdE1vZGUgfHwgc3RDb25maWcuc2VsZWN0Lm1vZGU7XG4gICAgICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGN0cmwuc2VsZWN0KHNjb3BlLnJvdywgbW9kZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNjb3BlLiR3YXRjaCgncm93LmlzU2VsZWN0ZWQnLCBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgICBpZiAobmV3VmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3Moc3RDb25maWcuc2VsZWN0LnNlbGVjdGVkQ2xhc3MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKHN0Q29uZmlnLnNlbGVjdC5zZWxlY3RlZENsYXNzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1dKTtcbiIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnKVxuICAuZGlyZWN0aXZlKCdzdFNvcnQnLCBbJ3N0Q29uZmlnJywgJyRwYXJzZScsIGZ1bmN0aW9uIChzdENvbmZpZywgJHBhcnNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICByZXF1aXJlOiAnXnN0VGFibGUnLFxuICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyLCBjdHJsKSB7XG5cbiAgICAgICAgdmFyIHByZWRpY2F0ZSA9IGF0dHIuc3RTb3J0O1xuICAgICAgICB2YXIgZ2V0dGVyID0gJHBhcnNlKHByZWRpY2F0ZSk7XG4gICAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICAgIHZhciBjbGFzc0FzY2VudCA9IGF0dHIuc3RDbGFzc0FzY2VudCB8fCBzdENvbmZpZy5zb3J0LmFzY2VudENsYXNzO1xuICAgICAgICB2YXIgY2xhc3NEZXNjZW50ID0gYXR0ci5zdENsYXNzRGVzY2VudCB8fCBzdENvbmZpZy5zb3J0LmRlc2NlbnRDbGFzcztcbiAgICAgICAgdmFyIHN0YXRlQ2xhc3NlcyA9IFtjbGFzc0FzY2VudCwgY2xhc3NEZXNjZW50XTtcbiAgICAgICAgdmFyIHNvcnREZWZhdWx0O1xuICAgICAgICB2YXIgc2tpcE5hdHVyYWwgPSBhdHRyLnN0U2tpcE5hdHVyYWwgIT09IHVuZGVmaW5lZCA/IGF0dHIuc3RTa2lwTmF0dXJhbCA6IHN0Q29uZmlnLnNraXBOYXR1cmFsO1xuXG4gICAgICAgIGlmIChhdHRyLnN0U29ydERlZmF1bHQpIHtcbiAgICAgICAgICBzb3J0RGVmYXVsdCA9IHNjb3BlLiRldmFsKGF0dHIuc3RTb3J0RGVmYXVsdCkgIT09IHVuZGVmaW5lZCA/IHNjb3BlLiRldmFsKGF0dHIuc3RTb3J0RGVmYXVsdCkgOiBhdHRyLnN0U29ydERlZmF1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICAvL3ZpZXcgLS0+IHRhYmxlIHN0YXRlXG4gICAgICAgIGZ1bmN0aW9uIHNvcnQgKCkge1xuICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgcHJlZGljYXRlID0gbmcuaXNGdW5jdGlvbihnZXR0ZXIoc2NvcGUpKSA/IGdldHRlcihzY29wZSkgOiBhdHRyLnN0U29ydDtcbiAgICAgICAgICBpZiAoaW5kZXggJSAzID09PSAwICYmICEhc2tpcE5hdHVyYWwgIT09IHRydWUpIHtcbiAgICAgICAgICAgIC8vbWFudWFsIHJlc2V0XG4gICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgICAgICBjdHJsLnRhYmxlU3RhdGUoKS5zb3J0ID0ge307XG4gICAgICAgICAgICBjdHJsLnRhYmxlU3RhdGUoKS5wYWdpbmF0aW9uLnN0YXJ0ID0gMDtcbiAgICAgICAgICAgIGN0cmwucGlwZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdHJsLnNvcnRCeShwcmVkaWNhdGUsIGluZGV4ICUgMiA9PT0gMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uIHNvcnRDbGljayAoKSB7XG4gICAgICAgICAgaWYgKHByZWRpY2F0ZSkge1xuICAgICAgICAgICAgc2NvcGUuJGFwcGx5KHNvcnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHNvcnREZWZhdWx0KSB7XG4gICAgICAgICAgaW5kZXggPSBzb3J0RGVmYXVsdCA9PT0gJ3JldmVyc2UnID8gMSA6IDA7XG4gICAgICAgICAgc29ydCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy90YWJsZSBzdGF0ZSAtLT4gdmlld1xuICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjdHJsLnRhYmxlU3RhdGUoKS5zb3J0O1xuICAgICAgICB9LCBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgICBpZiAobmV3VmFsdWUucHJlZGljYXRlICE9PSBwcmVkaWNhdGUpIHtcbiAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKGNsYXNzQXNjZW50KVxuICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoY2xhc3NEZXNjZW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5kZXggPSBuZXdWYWx1ZS5yZXZlcnNlID09PSB0cnVlID8gMiA6IDE7XG4gICAgICAgICAgICBlbGVtZW50XG4gICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhzdGF0ZUNsYXNzZXNbaW5kZXggJSAyXSlcbiAgICAgICAgICAgICAgLmFkZENsYXNzKHN0YXRlQ2xhc3Nlc1tpbmRleCAtIDFdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuICAgICAgfVxuICAgIH07XG4gIH1dKTtcbiIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnKVxuICAuZGlyZWN0aXZlKCdzdFBhZ2luYXRpb24nLCBbJ3N0Q29uZmlnJywgZnVuY3Rpb24gKHN0Q29uZmlnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgcmVxdWlyZTogJ15zdFRhYmxlJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHN0SXRlbXNCeVBhZ2U6ICc9PycsXG4gICAgICAgIHN0RGlzcGxheWVkUGFnZXM6ICc9PycsXG4gICAgICAgIHN0UGFnZUNoYW5nZTogJyYnXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVVcmw6IGZ1bmN0aW9uIChlbGVtZW50LCBhdHRycykge1xuICAgICAgICBpZiAoYXR0cnMuc3RUZW1wbGF0ZSkge1xuICAgICAgICAgIHJldHVybiBhdHRycy5zdFRlbXBsYXRlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdENvbmZpZy5wYWdpbmF0aW9uLnRlbXBsYXRlO1xuICAgICAgfSxcbiAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcblxuICAgICAgICBzY29wZS5zdEl0ZW1zQnlQYWdlID0gc2NvcGUuc3RJdGVtc0J5UGFnZSA/ICsoc2NvcGUuc3RJdGVtc0J5UGFnZSkgOiBzdENvbmZpZy5wYWdpbmF0aW9uLml0ZW1zQnlQYWdlO1xuICAgICAgICBzY29wZS5zdERpc3BsYXllZFBhZ2VzID0gc2NvcGUuc3REaXNwbGF5ZWRQYWdlcyA/ICsoc2NvcGUuc3REaXNwbGF5ZWRQYWdlcykgOiBzdENvbmZpZy5wYWdpbmF0aW9uLmRpc3BsYXllZFBhZ2VzO1xuXG4gICAgICAgIHNjb3BlLmN1cnJlbnRQYWdlID0gMTtcbiAgICAgICAgc2NvcGUucGFnZXMgPSBbXTtcblxuICAgICAgICBmdW5jdGlvbiByZWRyYXcgKCkge1xuICAgICAgICAgIHZhciBwYWdpbmF0aW9uU3RhdGUgPSBjdHJsLnRhYmxlU3RhdGUoKS5wYWdpbmF0aW9uO1xuICAgICAgICAgIHZhciBzdGFydCA9IDE7XG4gICAgICAgICAgdmFyIGVuZDtcbiAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICB2YXIgcHJldlBhZ2UgPSBzY29wZS5jdXJyZW50UGFnZTtcbiAgICAgICAgICBzY29wZS5jdXJyZW50UGFnZSA9IE1hdGguZmxvb3IocGFnaW5hdGlvblN0YXRlLnN0YXJ0IC8gcGFnaW5hdGlvblN0YXRlLm51bWJlcikgKyAxO1xuXG4gICAgICAgICAgc3RhcnQgPSBNYXRoLm1heChzdGFydCwgc2NvcGUuY3VycmVudFBhZ2UgLSBNYXRoLmFicyhNYXRoLmZsb29yKHNjb3BlLnN0RGlzcGxheWVkUGFnZXMgLyAyKSkpO1xuICAgICAgICAgIGVuZCA9IHN0YXJ0ICsgc2NvcGUuc3REaXNwbGF5ZWRQYWdlcztcblxuICAgICAgICAgIGlmIChlbmQgPiBwYWdpbmF0aW9uU3RhdGUubnVtYmVyT2ZQYWdlcykge1xuICAgICAgICAgICAgZW5kID0gcGFnaW5hdGlvblN0YXRlLm51bWJlck9mUGFnZXMgKyAxO1xuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLm1heCgxLCBlbmQgLSBzY29wZS5zdERpc3BsYXllZFBhZ2VzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzY29wZS5wYWdlcyA9IFtdO1xuICAgICAgICAgIHNjb3BlLm51bVBhZ2VzID0gcGFnaW5hdGlvblN0YXRlLm51bWJlck9mUGFnZXM7XG5cbiAgICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICBzY29wZS5wYWdlcy5wdXNoKGkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwcmV2UGFnZSAhPT0gc2NvcGUuY3VycmVudFBhZ2UpIHtcbiAgICAgICAgICAgIHNjb3BlLnN0UGFnZUNoYW5nZSh7bmV3UGFnZTogc2NvcGUuY3VycmVudFBhZ2V9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL3RhYmxlIHN0YXRlIC0tPiB2aWV3XG4gICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGN0cmwudGFibGVTdGF0ZSgpLnBhZ2luYXRpb247XG4gICAgICAgIH0sIHJlZHJhdywgdHJ1ZSk7XG5cbiAgICAgICAgLy9zY29wZSAtLT4gdGFibGUgc3RhdGUgICgtLT4gdmlldylcbiAgICAgICAgc2NvcGUuJHdhdGNoKCdzdEl0ZW1zQnlQYWdlJywgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICAgIHNjb3BlLnNlbGVjdFBhZ2UoMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBzY29wZS4kd2F0Y2goJ3N0RGlzcGxheWVkUGFnZXMnLCByZWRyYXcpO1xuXG4gICAgICAgIC8vdmlldyAtPiB0YWJsZSBzdGF0ZVxuICAgICAgICBzY29wZS5zZWxlY3RQYWdlID0gZnVuY3Rpb24gKHBhZ2UpIHtcbiAgICAgICAgICBpZiAocGFnZSA+IDAgJiYgcGFnZSA8PSBzY29wZS5udW1QYWdlcykge1xuICAgICAgICAgICAgY3RybC5zbGljZSgocGFnZSAtIDEpICogc2NvcGUuc3RJdGVtc0J5UGFnZSwgc2NvcGUuc3RJdGVtc0J5UGFnZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghY3RybC50YWJsZVN0YXRlKCkucGFnaW5hdGlvbi5udW1iZXIpIHtcbiAgICAgICAgICBjdHJsLnNsaWNlKDAsIHNjb3BlLnN0SXRlbXNCeVBhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfV0pO1xuIiwibmcubW9kdWxlKCdzbWFydC10YWJsZScpXG4gIC5kaXJlY3RpdmUoJ3N0UGlwZScsIFsnc3RDb25maWcnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbiAoY29uZmlnLCAkdGltZW91dCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXF1aXJlOiAnc3RUYWJsZScsXG4gICAgICBzY29wZToge1xuICAgICAgICBzdFBpcGU6ICc9J1xuICAgICAgfSxcbiAgICAgIGxpbms6IHtcblxuICAgICAgICBwcmU6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcblxuICAgICAgICAgIHZhciBwaXBlUHJvbWlzZSA9IG51bGw7XG5cbiAgICAgICAgICBpZiAobmcuaXNGdW5jdGlvbihzY29wZS5zdFBpcGUpKSB7XG4gICAgICAgICAgICBjdHJsLnByZXZlbnRQaXBlT25XYXRjaCgpO1xuICAgICAgICAgICAgY3RybC5waXBlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgIGlmIChwaXBlUHJvbWlzZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbChwaXBlUHJvbWlzZSlcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHBpcGVQcm9taXNlID0gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLnN0UGlwZShjdHJsLnRhYmxlU3RhdGUoKSwgY3RybCk7XG4gICAgICAgICAgICAgIH0sIGNvbmZpZy5waXBlLmRlbGF5KTtcblxuICAgICAgICAgICAgICByZXR1cm4gcGlwZVByb21pc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHBvc3Q6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcbiAgICAgICAgICBjdHJsLnBpcGUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1dKTtcbiIsIn0pKGFuZ3VsYXIpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==