/** 
* @version 2.0.2
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
      descentClass: 'st-sort-descent'
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

        if (attr.stSortDefault) {
          sortDefault = scope.$eval(attr.stSortDefault) !== undefined ? scope.$eval(attr.stSortDefault) : attr.stSortDefault;
        }

        //view --> table state
        function sort () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy90b3AudHh0Iiwic3JjL3NtYXJ0LXRhYmxlLm1vZHVsZS5qcyIsInNyYy9zdENvbmZpZy5qcyIsInNyYy9zdFRhYmxlLmpzIiwic3JjL3N0U2VhcmNoLmpzIiwic3JjL3N0U2VsZWN0Um93LmpzIiwic3JjL3N0U29ydC5qcyIsInNyYy9zdFBhZ2luYXRpb24uanMiLCJzcmMvc3RQaXBlLmpzIiwic3JjL2JvdHRvbS50eHQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBIiwiZmlsZSI6InNtYXJ0LXRhYmxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChuZywgdW5kZWZpbmVkKXtcbiAgICAndXNlIHN0cmljdCc7XG4iLCJuZy5tb2R1bGUoJ3NtYXJ0LXRhYmxlJywgW10pLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCd0ZW1wbGF0ZS9zbWFydC10YWJsZS9wYWdpbmF0aW9uLmh0bWwnLFxuICAgICAgICAnPG5hdiBuZy1pZj1cInBhZ2VzLmxlbmd0aCA+PSAyXCI+PHVsIGNsYXNzPVwicGFnaW5hdGlvblwiPicgK1xuICAgICAgICAnPGxpIG5nLXJlcGVhdD1cInBhZ2UgaW4gcGFnZXNcIiBuZy1jbGFzcz1cInthY3RpdmU6IHBhZ2U9PWN1cnJlbnRQYWdlfVwiPjxhIG5nLWNsaWNrPVwic2VsZWN0UGFnZShwYWdlKVwiPnt7cGFnZX19PC9hPjwvbGk+JyArXG4gICAgICAgICc8L3VsPjwvbmF2PicpO1xufV0pO1xuXG4iLCJuZy5tb2R1bGUoJ3NtYXJ0LXRhYmxlJylcbiAgLmNvbnN0YW50KCdzdENvbmZpZycsIHtcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICB0ZW1wbGF0ZTogJ3RlbXBsYXRlL3NtYXJ0LXRhYmxlL3BhZ2luYXRpb24uaHRtbCcsXG4gICAgICBpdGVtc0J5UGFnZTogMTAsXG4gICAgICBkaXNwbGF5ZWRQYWdlczogNVxuICAgIH0sXG4gICAgc2VhcmNoOiB7XG4gICAgICBkZWxheTogNDAwIC8vIG1zXG4gICAgfSxcbiAgICBzZWxlY3Q6IHtcbiAgICAgIG1vZGU6ICdzaW5nbGUnLFxuICAgICAgc2VsZWN0ZWRDbGFzczogJ3N0LXNlbGVjdGVkJ1xuICAgIH0sXG4gICAgc29ydDoge1xuICAgICAgYXNjZW50Q2xhc3M6ICdzdC1zb3J0LWFzY2VudCcsXG4gICAgICBkZXNjZW50Q2xhc3M6ICdzdC1zb3J0LWRlc2NlbnQnXG4gICAgfSxcbiAgICBwaXBlOiB7XG4gICAgICBkZWxheTogMTAwIC8vbXNcbiAgICB9XG4gIH0pOyIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnKVxuICAuY29udHJvbGxlcignc3RUYWJsZUNvbnRyb2xsZXInLCBbJyRzY29wZScsICckcGFyc2UnLCAnJGZpbHRlcicsICckYXR0cnMnLCBmdW5jdGlvbiBTdFRhYmxlQ29udHJvbGxlciAoJHNjb3BlLCAkcGFyc2UsICRmaWx0ZXIsICRhdHRycykge1xuICAgIHZhciBwcm9wZXJ0eU5hbWUgPSAkYXR0cnMuc3RUYWJsZTtcbiAgICB2YXIgZGlzcGxheUdldHRlciA9ICRwYXJzZShwcm9wZXJ0eU5hbWUpO1xuICAgIHZhciBkaXNwbGF5U2V0dGVyID0gZGlzcGxheUdldHRlci5hc3NpZ247XG4gICAgdmFyIHNhZmVHZXR0ZXI7XG4gICAgdmFyIG9yZGVyQnkgPSAkZmlsdGVyKCdvcmRlckJ5Jyk7XG4gICAgdmFyIGZpbHRlciA9ICRmaWx0ZXIoJ2ZpbHRlcicpO1xuICAgIHZhciBzYWZlQ29weSA9IGNvcHlSZWZzKGRpc3BsYXlHZXR0ZXIoJHNjb3BlKSk7XG4gICAgdmFyIHRhYmxlU3RhdGUgPSB7XG4gICAgICBzb3J0OiB7fSxcbiAgICAgIHNlYXJjaDoge30sXG4gICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgIHN0YXJ0OiAwXG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgZmlsdGVyZWQ7XG4gICAgdmFyIHBpcGVBZnRlclNhZmVDb3B5ID0gdHJ1ZTtcbiAgICB2YXIgY3RybCA9IHRoaXM7XG4gICAgdmFyIGxhc3RTZWxlY3RlZDtcblxuICAgIGZ1bmN0aW9uIGNvcHlSZWZzIChzcmMpIHtcbiAgICAgIHJldHVybiBzcmMgPyBbXS5jb25jYXQoc3JjKSA6IFtdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVNhZmVDb3B5ICgpIHtcbiAgICAgIHNhZmVDb3B5ID0gY29weVJlZnMoc2FmZUdldHRlcigkc2NvcGUpKTtcbiAgICAgIGlmIChwaXBlQWZ0ZXJTYWZlQ29weSA9PT0gdHJ1ZSkge1xuICAgICAgICBjdHJsLnBpcGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoJGF0dHJzLnN0U2FmZVNyYykge1xuICAgICAgc2FmZUdldHRlciA9ICRwYXJzZSgkYXR0cnMuc3RTYWZlU3JjKTtcbiAgICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2FmZVNyYyA9IHNhZmVHZXR0ZXIoJHNjb3BlKTtcbiAgICAgICAgcmV0dXJuIHNhZmVTcmMgPyBzYWZlU3JjLmxlbmd0aCA6IDA7XG5cbiAgICAgIH0sIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9PSBzYWZlQ29weS5sZW5ndGgpIHtcbiAgICAgICAgICB1cGRhdGVTYWZlQ29weSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc2FmZUdldHRlcigkc2NvcGUpO1xuICAgICAgfSwgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICBpZiAobmV3VmFsdWUgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgdXBkYXRlU2FmZUNvcHkoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc29ydCB0aGUgcm93c1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb24gfCBTdHJpbmd9IHByZWRpY2F0ZSAtIGZ1bmN0aW9uIG9yIHN0cmluZyB3aGljaCB3aWxsIGJlIHVzZWQgYXMgcHJlZGljYXRlIGZvciB0aGUgc29ydGluZ1xuICAgICAqIEBwYXJhbSBbcmV2ZXJzZV0gLSBpZiB5b3Ugd2FudCB0byByZXZlcnNlIHRoZSBvcmRlclxuICAgICAqL1xuICAgIHRoaXMuc29ydEJ5ID0gZnVuY3Rpb24gc29ydEJ5IChwcmVkaWNhdGUsIHJldmVyc2UpIHtcbiAgICAgIHRhYmxlU3RhdGUuc29ydC5wcmVkaWNhdGUgPSBwcmVkaWNhdGU7XG4gICAgICB0YWJsZVN0YXRlLnNvcnQucmV2ZXJzZSA9IHJldmVyc2UgPT09IHRydWU7XG5cbiAgICAgIGlmIChuZy5pc0Z1bmN0aW9uKHByZWRpY2F0ZSkpIHtcbiAgICAgICAgdGFibGVTdGF0ZS5zb3J0LmZ1bmN0aW9uTmFtZSA9IHByZWRpY2F0ZS5uYW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIHRhYmxlU3RhdGUuc29ydC5mdW5jdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHRhYmxlU3RhdGUucGFnaW5hdGlvbi5zdGFydCA9IDA7XG4gICAgICByZXR1cm4gdGhpcy5waXBlKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHNlYXJjaCBtYXRjaGluZyByb3dzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IC0gdGhlIGlucHV0IHN0cmluZ1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbcHJlZGljYXRlXSAtIHRoZSBwcm9wZXJ0eSBuYW1lIGFnYWluc3QgeW91IHdhbnQgdG8gY2hlY2sgdGhlIG1hdGNoLCBvdGhlcndpc2UgaXQgd2lsbCBzZWFyY2ggb24gYWxsIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICB0aGlzLnNlYXJjaCA9IGZ1bmN0aW9uIHNlYXJjaCAoaW5wdXQsIHByZWRpY2F0ZSkge1xuICAgICAgdmFyIHByZWRpY2F0ZU9iamVjdCA9IHRhYmxlU3RhdGUuc2VhcmNoLnByZWRpY2F0ZU9iamVjdCB8fCB7fTtcbiAgICAgIHZhciBwcm9wID0gcHJlZGljYXRlID8gcHJlZGljYXRlIDogJyQnO1xuXG4gICAgICBpbnB1dCA9IG5nLmlzU3RyaW5nKGlucHV0KSA/IGlucHV0LnRyaW0oKSA6IGlucHV0O1xuICAgICAgcHJlZGljYXRlT2JqZWN0W3Byb3BdID0gaW5wdXQ7XG4gICAgICAvLyB0byBhdm9pZCB0byBmaWx0ZXIgb3V0IG51bGwgdmFsdWVcbiAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgZGVsZXRlIHByZWRpY2F0ZU9iamVjdFtwcm9wXTtcbiAgICAgIH1cbiAgICAgIHRhYmxlU3RhdGUuc2VhcmNoLnByZWRpY2F0ZU9iamVjdCA9IHByZWRpY2F0ZU9iamVjdDtcbiAgICAgIHRhYmxlU3RhdGUucGFnaW5hdGlvbi5zdGFydCA9IDA7XG4gICAgICByZXR1cm4gdGhpcy5waXBlKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHRoaXMgd2lsbCBjaGFpbiB0aGUgb3BlcmF0aW9ucyBvZiBzb3J0aW5nIGFuZCBmaWx0ZXJpbmcgYmFzZWQgb24gdGhlIGN1cnJlbnQgdGFibGUgc3RhdGUgKHNvcnQgb3B0aW9ucywgZmlsdGVyaW5nLCBlY3QpXG4gICAgICovXG4gICAgdGhpcy5waXBlID0gZnVuY3Rpb24gcGlwZSAoKSB7XG4gICAgICB2YXIgcGFnaW5hdGlvbiA9IHRhYmxlU3RhdGUucGFnaW5hdGlvbjtcbiAgICAgIHZhciBvdXRwdXQ7XG4gICAgICBmaWx0ZXJlZCA9IHRhYmxlU3RhdGUuc2VhcmNoLnByZWRpY2F0ZU9iamVjdCA/IGZpbHRlcihzYWZlQ29weSwgdGFibGVTdGF0ZS5zZWFyY2gucHJlZGljYXRlT2JqZWN0KSA6IHNhZmVDb3B5O1xuICAgICAgaWYgKHRhYmxlU3RhdGUuc29ydC5wcmVkaWNhdGUpIHtcbiAgICAgICAgZmlsdGVyZWQgPSBvcmRlckJ5KGZpbHRlcmVkLCB0YWJsZVN0YXRlLnNvcnQucHJlZGljYXRlLCB0YWJsZVN0YXRlLnNvcnQucmV2ZXJzZSk7XG4gICAgICB9XG4gICAgICBpZiAocGFnaW5hdGlvbi5udW1iZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwYWdpbmF0aW9uLm51bWJlck9mUGFnZXMgPSBmaWx0ZXJlZC5sZW5ndGggPiAwID8gTWF0aC5jZWlsKGZpbHRlcmVkLmxlbmd0aCAvIHBhZ2luYXRpb24ubnVtYmVyKSA6IDE7XG4gICAgICAgIHBhZ2luYXRpb24uc3RhcnQgPSBwYWdpbmF0aW9uLnN0YXJ0ID49IGZpbHRlcmVkLmxlbmd0aCA/IChwYWdpbmF0aW9uLm51bWJlck9mUGFnZXMgLSAxKSAqIHBhZ2luYXRpb24ubnVtYmVyIDogcGFnaW5hdGlvbi5zdGFydDtcbiAgICAgICAgb3V0cHV0ID0gZmlsdGVyZWQuc2xpY2UocGFnaW5hdGlvbi5zdGFydCwgcGFnaW5hdGlvbi5zdGFydCArIHBhcnNlSW50KHBhZ2luYXRpb24ubnVtYmVyKSk7XG4gICAgICB9XG4gICAgICBkaXNwbGF5U2V0dGVyKCRzY29wZSwgb3V0cHV0IHx8IGZpbHRlcmVkKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogc2VsZWN0IGEgZGF0YVJvdyAoaXQgd2lsbCBhZGQgdGhlIGF0dHJpYnV0ZSBpc1NlbGVjdGVkIHRvIHRoZSByb3cgb2JqZWN0KVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByb3cgLSB0aGUgcm93IHRvIHNlbGVjdFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbbW9kZV0gLSBcInNpbmdsZVwiIG9yIFwibXVsdGlwbGVcIiAobXVsdGlwbGUgYnkgZGVmYXVsdClcbiAgICAgKi9cbiAgICB0aGlzLnNlbGVjdCA9IGZ1bmN0aW9uIHNlbGVjdCAocm93LCBtb2RlKSB7XG4gICAgICB2YXIgcm93cyA9IHNhZmVDb3B5O1xuICAgICAgdmFyIGluZGV4ID0gcm93cy5pbmRleE9mKHJvdyk7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIGlmIChtb2RlID09PSAnc2luZ2xlJykge1xuICAgICAgICAgIHJvdy5pc1NlbGVjdGVkID0gcm93LmlzU2VsZWN0ZWQgIT09IHRydWU7XG4gICAgICAgICAgaWYgKGxhc3RTZWxlY3RlZCkge1xuICAgICAgICAgICAgbGFzdFNlbGVjdGVkLmlzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGFzdFNlbGVjdGVkID0gcm93LmlzU2VsZWN0ZWQgPT09IHRydWUgPyByb3cgOiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcm93c1tpbmRleF0uaXNTZWxlY3RlZCA9ICFyb3dzW2luZGV4XS5pc1NlbGVjdGVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHRha2UgYSBzbGljZSBvZiB0aGUgY3VycmVudCBzb3J0ZWQvZmlsdGVyZWQgY29sbGVjdGlvbiAocGFnaW5hdGlvbilcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydCAtIHN0YXJ0IGluZGV4IG9mIHRoZSBzbGljZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBudW1iZXIgLSB0aGUgbnVtYmVyIG9mIGl0ZW0gaW4gdGhlIHNsaWNlXG4gICAgICovXG4gICAgdGhpcy5zbGljZSA9IGZ1bmN0aW9uIHNwbGljZSAoc3RhcnQsIG51bWJlcikge1xuICAgICAgdGFibGVTdGF0ZS5wYWdpbmF0aW9uLnN0YXJ0ID0gc3RhcnQ7XG4gICAgICB0YWJsZVN0YXRlLnBhZ2luYXRpb24ubnVtYmVyID0gbnVtYmVyO1xuICAgICAgcmV0dXJuIHRoaXMucGlwZSgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHRhYmxlXG4gICAgICogQHJldHVybnMge3tzb3J0OiB7fSwgc2VhcmNoOiB7fSwgcGFnaW5hdGlvbjoge3N0YXJ0OiBudW1iZXJ9fX1cbiAgICAgKi9cbiAgICB0aGlzLnRhYmxlU3RhdGUgPSBmdW5jdGlvbiBnZXRUYWJsZVN0YXRlICgpIHtcbiAgICAgIHJldHVybiB0YWJsZVN0YXRlO1xuICAgIH07XG5cbiAgICB0aGlzLmdldEZpbHRlcmVkQ29sbGVjdGlvbiA9IGZ1bmN0aW9uIGdldEZpbHRlcmVkQ29sbGVjdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZmlsdGVyZWQgfHwgc2FmZUNvcHk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVzZSBhIGRpZmZlcmVudCBmaWx0ZXIgZnVuY3Rpb24gdGhhbiB0aGUgYW5ndWxhciBGaWx0ZXJGaWx0ZXJcbiAgICAgKiBAcGFyYW0gZmlsdGVyTmFtZSB0aGUgbmFtZSB1bmRlciB3aGljaCB0aGUgY3VzdG9tIGZpbHRlciBpcyByZWdpc3RlcmVkXG4gICAgICovXG4gICAgdGhpcy5zZXRGaWx0ZXJGdW5jdGlvbiA9IGZ1bmN0aW9uIHNldEZpbHRlckZ1bmN0aW9uIChmaWx0ZXJOYW1lKSB7XG4gICAgICBmaWx0ZXIgPSAkZmlsdGVyKGZpbHRlck5hbWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVc2UgYSBkaWZmZXJlbnQgZnVuY3Rpb24gdGhhbiB0aGUgYW5ndWxhciBvcmRlckJ5XG4gICAgICogQHBhcmFtIHNvcnRGdW5jdGlvbk5hbWUgdGhlIG5hbWUgdW5kZXIgd2hpY2ggdGhlIGN1c3RvbSBvcmRlciBmdW5jdGlvbiBpcyByZWdpc3RlcmVkXG4gICAgICovXG4gICAgdGhpcy5zZXRTb3J0RnVuY3Rpb24gPSBmdW5jdGlvbiBzZXRTb3J0RnVuY3Rpb24gKHNvcnRGdW5jdGlvbk5hbWUpIHtcbiAgICAgIG9yZGVyQnkgPSAkZmlsdGVyKHNvcnRGdW5jdGlvbk5hbWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVc3VhbGx5IHdoZW4gdGhlIHNhZmUgY29weSBpcyB1cGRhdGVkIHRoZSBwaXBlIGZ1bmN0aW9uIGlzIGNhbGxlZC5cbiAgICAgKiBDYWxsaW5nIHRoaXMgbWV0aG9kIHdpbGwgcHJldmVudCBpdCwgd2hpY2ggaXMgc29tZXRoaW5nIHJlcXVpcmVkIHdoZW4gdXNpbmcgYSBjdXN0b20gcGlwZSBmdW5jdGlvblxuICAgICAqL1xuICAgIHRoaXMucHJldmVudFBpcGVPbldhdGNoID0gZnVuY3Rpb24gcHJldmVudFBpcGUgKCkge1xuICAgICAgcGlwZUFmdGVyU2FmZUNvcHkgPSBmYWxzZTtcbiAgICB9O1xuICB9XSlcbiAgLmRpcmVjdGl2ZSgnc3RUYWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdzdFRhYmxlQ29udHJvbGxlcicsXG4gICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIsIGN0cmwpIHtcblxuICAgICAgICBpZiAoYXR0ci5zdFNldEZpbHRlcikge1xuICAgICAgICAgIGN0cmwuc2V0RmlsdGVyRnVuY3Rpb24oYXR0ci5zdFNldEZpbHRlcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXR0ci5zdFNldFNvcnQpIHtcbiAgICAgICAgICBjdHJsLnNldFNvcnRGdW5jdGlvbihhdHRyLnN0U2V0U29ydCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbiIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnKVxuICAuZGlyZWN0aXZlKCdzdFNlYXJjaCcsIFsnc3RDb25maWcnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbiAoc3RDb25maWcsICR0aW1lb3V0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlcXVpcmU6ICdec3RUYWJsZScsXG4gICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIsIGN0cmwpIHtcbiAgICAgICAgdmFyIHRhYmxlQ3RybCA9IGN0cmw7XG4gICAgICAgIHZhciBwcm9taXNlID0gbnVsbDtcbiAgICAgICAgdmFyIHRocm90dGxlID0gYXR0ci5zdERlbGF5IHx8IHN0Q29uZmlnLnNlYXJjaC5kZWxheTtcblxuICAgICAgICBhdHRyLiRvYnNlcnZlKCdzdFNlYXJjaCcsIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICB2YXIgaW5wdXQgPSBlbGVtZW50WzBdLnZhbHVlO1xuICAgICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gb2xkVmFsdWUgJiYgaW5wdXQpIHtcbiAgICAgICAgICAgIGN0cmwudGFibGVTdGF0ZSgpLnNlYXJjaCA9IHt9O1xuICAgICAgICAgICAgdGFibGVDdHJsLnNlYXJjaChpbnB1dCwgbmV3VmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy90YWJsZSBzdGF0ZSAtPiB2aWV3XG4gICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGN0cmwudGFibGVTdGF0ZSgpLnNlYXJjaDtcbiAgICAgICAgfSwgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgIHZhciBwcmVkaWNhdGVFeHByZXNzaW9uID0gYXR0ci5zdFNlYXJjaCB8fCAnJCc7XG4gICAgICAgICAgaWYgKG5ld1ZhbHVlLnByZWRpY2F0ZU9iamVjdCAmJiBuZXdWYWx1ZS5wcmVkaWNhdGVPYmplY3RbcHJlZGljYXRlRXhwcmVzc2lvbl0gIT09IGVsZW1lbnRbMF0udmFsdWUpIHtcbiAgICAgICAgICAgIGVsZW1lbnRbMF0udmFsdWUgPSBuZXdWYWx1ZS5wcmVkaWNhdGVPYmplY3RbcHJlZGljYXRlRXhwcmVzc2lvbl0gfHwgJyc7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAvLyB2aWV3IC0+IHRhYmxlIHN0YXRlXG4gICAgICAgIGVsZW1lbnQuYmluZCgnaW5wdXQnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgZXZ0ID0gZXZ0Lm9yaWdpbmFsRXZlbnQgfHwgZXZ0O1xuICAgICAgICAgIGlmIChwcm9taXNlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAkdGltZW91dC5jYW5jZWwocHJvbWlzZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcHJvbWlzZSA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRhYmxlQ3RybC5zZWFyY2goZXZ0LnRhcmdldC52YWx1ZSwgYXR0ci5zdFNlYXJjaCB8fCAnJyk7XG4gICAgICAgICAgICBwcm9taXNlID0gbnVsbDtcbiAgICAgICAgICB9LCB0aHJvdHRsZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1dKTtcbiIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnKVxuICAuZGlyZWN0aXZlKCdzdFNlbGVjdFJvdycsIFsnc3RDb25maWcnLCBmdW5jdGlvbiAoc3RDb25maWcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgIHJlcXVpcmU6ICdec3RUYWJsZScsXG4gICAgICBzY29wZToge1xuICAgICAgICByb3c6ICc9c3RTZWxlY3RSb3cnXG4gICAgICB9LFxuICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyLCBjdHJsKSB7XG4gICAgICAgIHZhciBtb2RlID0gYXR0ci5zdFNlbGVjdE1vZGUgfHwgc3RDb25maWcuc2VsZWN0Lm1vZGU7XG4gICAgICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGN0cmwuc2VsZWN0KHNjb3BlLnJvdywgbW9kZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNjb3BlLiR3YXRjaCgncm93LmlzU2VsZWN0ZWQnLCBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgICBpZiAobmV3VmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3Moc3RDb25maWcuc2VsZWN0LnNlbGVjdGVkQ2xhc3MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKHN0Q29uZmlnLnNlbGVjdC5zZWxlY3RlZENsYXNzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1dKTtcbiIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnKVxuICAuZGlyZWN0aXZlKCdzdFNvcnQnLCBbJ3N0Q29uZmlnJywgJyRwYXJzZScsIGZ1bmN0aW9uIChzdENvbmZpZywgJHBhcnNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICByZXF1aXJlOiAnXnN0VGFibGUnLFxuICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyLCBjdHJsKSB7XG5cbiAgICAgICAgdmFyIHByZWRpY2F0ZSA9IGF0dHIuc3RTb3J0O1xuICAgICAgICB2YXIgZ2V0dGVyID0gJHBhcnNlKHByZWRpY2F0ZSk7XG4gICAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICAgIHZhciBjbGFzc0FzY2VudCA9IGF0dHIuc3RDbGFzc0FzY2VudCB8fCBzdENvbmZpZy5zb3J0LmFzY2VudENsYXNzO1xuICAgICAgICB2YXIgY2xhc3NEZXNjZW50ID0gYXR0ci5zdENsYXNzRGVzY2VudCB8fCBzdENvbmZpZy5zb3J0LmRlc2NlbnRDbGFzcztcbiAgICAgICAgdmFyIHN0YXRlQ2xhc3NlcyA9IFtjbGFzc0FzY2VudCwgY2xhc3NEZXNjZW50XTtcbiAgICAgICAgdmFyIHNvcnREZWZhdWx0O1xuXG4gICAgICAgIGlmIChhdHRyLnN0U29ydERlZmF1bHQpIHtcbiAgICAgICAgICBzb3J0RGVmYXVsdCA9IHNjb3BlLiRldmFsKGF0dHIuc3RTb3J0RGVmYXVsdCkgIT09IHVuZGVmaW5lZCA/IHNjb3BlLiRldmFsKGF0dHIuc3RTb3J0RGVmYXVsdCkgOiBhdHRyLnN0U29ydERlZmF1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICAvL3ZpZXcgLS0+IHRhYmxlIHN0YXRlXG4gICAgICAgIGZ1bmN0aW9uIHNvcnQgKCkge1xuICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgcHJlZGljYXRlID0gbmcuaXNGdW5jdGlvbihnZXR0ZXIoc2NvcGUpKSA/IGdldHRlcihzY29wZSkgOiBhdHRyLnN0U29ydDtcbiAgICAgICAgICBpZiAoaW5kZXggJSAzID09PSAwICYmIGF0dHIuc3RTa2lwTmF0dXJhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvL21hbnVhbCByZXNldFxuICAgICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICAgICAgY3RybC50YWJsZVN0YXRlKCkuc29ydCA9IHt9O1xuICAgICAgICAgICAgY3RybC50YWJsZVN0YXRlKCkucGFnaW5hdGlvbi5zdGFydCA9IDA7XG4gICAgICAgICAgICBjdHJsLnBpcGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3RybC5zb3J0QnkocHJlZGljYXRlLCBpbmRleCAlIDIgPT09IDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCBmdW5jdGlvbiBzb3J0Q2xpY2sgKCkge1xuICAgICAgICAgIGlmIChwcmVkaWNhdGUpIHtcbiAgICAgICAgICAgIHNjb3BlLiRhcHBseShzb3J0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzb3J0RGVmYXVsdCkge1xuICAgICAgICAgIGluZGV4ID0gc29ydERlZmF1bHQgPT09ICdyZXZlcnNlJyA/IDEgOiAwO1xuICAgICAgICAgIHNvcnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vdGFibGUgc3RhdGUgLS0+IHZpZXdcbiAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY3RybC50YWJsZVN0YXRlKCkuc29ydDtcbiAgICAgICAgfSwgZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgaWYgKG5ld1ZhbHVlLnByZWRpY2F0ZSAhPT0gcHJlZGljYXRlKSB7XG4gICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgICAgICBlbGVtZW50XG4gICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhjbGFzc0FzY2VudClcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKGNsYXNzRGVzY2VudCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluZGV4ID0gbmV3VmFsdWUucmV2ZXJzZSA9PT0gdHJ1ZSA/IDIgOiAxO1xuICAgICAgICAgICAgZWxlbWVudFxuICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3Moc3RhdGVDbGFzc2VzW2luZGV4ICUgMl0pXG4gICAgICAgICAgICAgIC5hZGRDbGFzcyhzdGF0ZUNsYXNzZXNbaW5kZXggLSAxXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XSk7XG4iLCJuZy5tb2R1bGUoJ3NtYXJ0LXRhYmxlJylcbiAgLmRpcmVjdGl2ZSgnc3RQYWdpbmF0aW9uJywgWydzdENvbmZpZycsIGZ1bmN0aW9uIChzdENvbmZpZykge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgIHJlcXVpcmU6ICdec3RUYWJsZScsXG4gICAgICBzY29wZToge1xuICAgICAgICBzdEl0ZW1zQnlQYWdlOiAnPT8nLFxuICAgICAgICBzdERpc3BsYXllZFBhZ2VzOiAnPT8nLFxuICAgICAgICBzdFBhZ2VDaGFuZ2U6ICcmJ1xuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbiAoZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgaWYgKGF0dHJzLnN0VGVtcGxhdGUpIHtcbiAgICAgICAgICByZXR1cm4gYXR0cnMuc3RUZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RDb25maWcucGFnaW5hdGlvbi50ZW1wbGF0ZTtcbiAgICAgIH0sXG4gICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XG5cbiAgICAgICAgc2NvcGUuc3RJdGVtc0J5UGFnZSA9IHNjb3BlLnN0SXRlbXNCeVBhZ2UgPyArKHNjb3BlLnN0SXRlbXNCeVBhZ2UpIDogc3RDb25maWcucGFnaW5hdGlvbi5pdGVtc0J5UGFnZTtcbiAgICAgICAgc2NvcGUuc3REaXNwbGF5ZWRQYWdlcyA9IHNjb3BlLnN0RGlzcGxheWVkUGFnZXMgPyArKHNjb3BlLnN0RGlzcGxheWVkUGFnZXMpIDogc3RDb25maWcucGFnaW5hdGlvbi5kaXNwbGF5ZWRQYWdlcztcblxuICAgICAgICBzY29wZS5jdXJyZW50UGFnZSA9IDE7XG4gICAgICAgIHNjb3BlLnBhZ2VzID0gW107XG5cbiAgICAgICAgZnVuY3Rpb24gcmVkcmF3ICgpIHtcbiAgICAgICAgICB2YXIgcGFnaW5hdGlvblN0YXRlID0gY3RybC50YWJsZVN0YXRlKCkucGFnaW5hdGlvbjtcbiAgICAgICAgICB2YXIgc3RhcnQgPSAxO1xuICAgICAgICAgIHZhciBlbmQ7XG4gICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgdmFyIHByZXZQYWdlID0gc2NvcGUuY3VycmVudFBhZ2U7XG4gICAgICAgICAgc2NvcGUuY3VycmVudFBhZ2UgPSBNYXRoLmZsb29yKHBhZ2luYXRpb25TdGF0ZS5zdGFydCAvIHBhZ2luYXRpb25TdGF0ZS5udW1iZXIpICsgMTtcblxuICAgICAgICAgIHN0YXJ0ID0gTWF0aC5tYXgoc3RhcnQsIHNjb3BlLmN1cnJlbnRQYWdlIC0gTWF0aC5hYnMoTWF0aC5mbG9vcihzY29wZS5zdERpc3BsYXllZFBhZ2VzIC8gMikpKTtcbiAgICAgICAgICBlbmQgPSBzdGFydCArIHNjb3BlLnN0RGlzcGxheWVkUGFnZXM7XG5cbiAgICAgICAgICBpZiAoZW5kID4gcGFnaW5hdGlvblN0YXRlLm51bWJlck9mUGFnZXMpIHtcbiAgICAgICAgICAgIGVuZCA9IHBhZ2luYXRpb25TdGF0ZS5udW1iZXJPZlBhZ2VzICsgMTtcbiAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5tYXgoMSwgZW5kIC0gc2NvcGUuc3REaXNwbGF5ZWRQYWdlcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2NvcGUucGFnZXMgPSBbXTtcbiAgICAgICAgICBzY29wZS5udW1QYWdlcyA9IHBhZ2luYXRpb25TdGF0ZS5udW1iZXJPZlBhZ2VzO1xuXG4gICAgICAgICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICAgICAgc2NvcGUucGFnZXMucHVzaChpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocHJldlBhZ2UgIT09IHNjb3BlLmN1cnJlbnRQYWdlKSB7XG4gICAgICAgICAgICBzY29wZS5zdFBhZ2VDaGFuZ2Uoe25ld1BhZ2U6IHNjb3BlLmN1cnJlbnRQYWdlfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy90YWJsZSBzdGF0ZSAtLT4gdmlld1xuICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjdHJsLnRhYmxlU3RhdGUoKS5wYWdpbmF0aW9uO1xuICAgICAgICB9LCByZWRyYXcsIHRydWUpO1xuXG4gICAgICAgIC8vc2NvcGUgLS0+IHRhYmxlIHN0YXRlICAoLS0+IHZpZXcpXG4gICAgICAgIHNjb3BlLiR3YXRjaCgnc3RJdGVtc0J5UGFnZScsIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICBpZiAobmV3VmFsdWUgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICBzY29wZS5zZWxlY3RQYWdlKDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2NvcGUuJHdhdGNoKCdzdERpc3BsYXllZFBhZ2VzJywgcmVkcmF3KTtcblxuICAgICAgICAvL3ZpZXcgLT4gdGFibGUgc3RhdGVcbiAgICAgICAgc2NvcGUuc2VsZWN0UGFnZSA9IGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgICAgaWYgKHBhZ2UgPiAwICYmIHBhZ2UgPD0gc2NvcGUubnVtUGFnZXMpIHtcbiAgICAgICAgICAgIGN0cmwuc2xpY2UoKHBhZ2UgLSAxKSAqIHNjb3BlLnN0SXRlbXNCeVBhZ2UsIHNjb3BlLnN0SXRlbXNCeVBhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIWN0cmwudGFibGVTdGF0ZSgpLnBhZ2luYXRpb24ubnVtYmVyKSB7XG4gICAgICAgICAgY3RybC5zbGljZSgwLCBzY29wZS5zdEl0ZW1zQnlQYWdlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1dKTtcbiIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnKVxuICAuZGlyZWN0aXZlKCdzdFBpcGUnLCBbJ3N0Q29uZmlnJywgJyR0aW1lb3V0JywgZnVuY3Rpb24gKGNvbmZpZywgJHRpbWVvdXQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVxdWlyZTogJ3N0VGFibGUnLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgc3RQaXBlOiAnPSdcbiAgICAgIH0sXG4gICAgICBsaW5rOiB7XG5cbiAgICAgICAgcHJlOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XG5cbiAgICAgICAgICB2YXIgcGlwZVByb21pc2UgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKG5nLmlzRnVuY3Rpb24oc2NvcGUuc3RQaXBlKSkge1xuICAgICAgICAgICAgY3RybC5wcmV2ZW50UGlwZU9uV2F0Y2goKTtcbiAgICAgICAgICAgIGN0cmwucGlwZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICBpZiAocGlwZVByb21pc2UgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkdGltZW91dC5jYW5jZWwocGlwZVByb21pc2UpXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBwaXBlUHJvbWlzZSA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzY29wZS5zdFBpcGUoY3RybC50YWJsZVN0YXRlKCksIGN0cmwpO1xuICAgICAgICAgICAgICB9LCBjb25maWcucGlwZS5kZWxheSk7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHBpcGVQcm9taXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwb3N0OiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XG4gICAgICAgICAgY3RybC5waXBlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XSk7XG4iLCJ9KShhbmd1bGFyKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=