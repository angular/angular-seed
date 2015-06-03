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

    function deepDelete(object, path) {
      if (path.indexOf('.') != -1) {
          var partials = path.split('.');
          var key = partials.pop();
          var parentPath = partials.join('.'); 
          var parentObject = $parse(parentPath)(object)
          delete parentObject[key]; 
          if (Object.keys(parentObject).length == 0) {
            deepDelete(object, parentPath);
          }
        } else {
          delete object[path];
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
      $parse(prop).assign(predicateObject, input);
      // to avoid to filter out null value
      if (!input) {
        deepDelete(predicateObject, prop);
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
  .directive('stSearch', ['stConfig', '$timeout','$parse', function (stConfig, $timeout, $parse) {
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
          if (newValue.predicateObject && $parse(predicateExpression)(newValue.predicateObject) !== element[0].value) {
            element[0].value = $parse(predicateExpression)(newValue.predicateObject) || '';
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
        var skipNatural = attr.stSkipNatural !== undefined ? attr.stSkipNatural : stConfig.sort.skipNatural;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy90b3AudHh0Iiwic3JjL3NtYXJ0LXRhYmxlLm1vZHVsZS5qcyIsInNyYy9zdENvbmZpZy5qcyIsInNyYy9zdFRhYmxlLmpzIiwic3JjL3N0U2VhcmNoLmpzIiwic3JjL3N0U2VsZWN0Um93LmpzIiwic3JjL3N0U29ydC5qcyIsInNyYy9zdFBhZ2luYXRpb24uanMiLCJzcmMvc3RQaXBlLmpzIiwic3JjL2JvdHRvbS50eHQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDak5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQSIsImZpbGUiOiJzbWFydC10YWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAobmcsIHVuZGVmaW5lZCl7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnLCBbXSkucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcclxuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgndGVtcGxhdGUvc21hcnQtdGFibGUvcGFnaW5hdGlvbi5odG1sJyxcclxuICAgICAgICAnPG5hdiBuZy1pZj1cInBhZ2VzLmxlbmd0aCA+PSAyXCI+PHVsIGNsYXNzPVwicGFnaW5hdGlvblwiPicgK1xyXG4gICAgICAgICc8bGkgbmctcmVwZWF0PVwicGFnZSBpbiBwYWdlc1wiIG5nLWNsYXNzPVwie2FjdGl2ZTogcGFnZT09Y3VycmVudFBhZ2V9XCI+PGEgbmctY2xpY2s9XCJzZWxlY3RQYWdlKHBhZ2UpXCI+e3twYWdlfX08L2E+PC9saT4nICtcclxuICAgICAgICAnPC91bD48L25hdj4nKTtcclxufV0pO1xyXG5cclxuIiwibmcubW9kdWxlKCdzbWFydC10YWJsZScpXHJcbiAgLmNvbnN0YW50KCdzdENvbmZpZycsIHtcclxuICAgIHBhZ2luYXRpb246IHtcclxuICAgICAgdGVtcGxhdGU6ICd0ZW1wbGF0ZS9zbWFydC10YWJsZS9wYWdpbmF0aW9uLmh0bWwnLFxyXG4gICAgICBpdGVtc0J5UGFnZTogMTAsXHJcbiAgICAgIGRpc3BsYXllZFBhZ2VzOiA1XHJcbiAgICB9LFxyXG4gICAgc2VhcmNoOiB7XHJcbiAgICAgIGRlbGF5OiA0MDAgLy8gbXNcclxuICAgIH0sXHJcbiAgICBzZWxlY3Q6IHtcclxuICAgICAgbW9kZTogJ3NpbmdsZScsXHJcbiAgICAgIHNlbGVjdGVkQ2xhc3M6ICdzdC1zZWxlY3RlZCdcclxuICAgIH0sXHJcbiAgICBzb3J0OiB7XHJcbiAgICAgIGFzY2VudENsYXNzOiAnc3Qtc29ydC1hc2NlbnQnLFxyXG4gICAgICBkZXNjZW50Q2xhc3M6ICdzdC1zb3J0LWRlc2NlbnQnLFxyXG4gICAgICBza2lwTmF0dXJhbDogZmFsc2VcclxuICAgIH0sXHJcbiAgICBwaXBlOiB7XHJcbiAgICAgIGRlbGF5OiAxMDAgLy9tc1xyXG4gICAgfVxyXG4gIH0pOyIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnKVxyXG4gIC5jb250cm9sbGVyKCdzdFRhYmxlQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRwYXJzZScsICckZmlsdGVyJywgJyRhdHRycycsIGZ1bmN0aW9uIFN0VGFibGVDb250cm9sbGVyICgkc2NvcGUsICRwYXJzZSwgJGZpbHRlciwgJGF0dHJzKSB7XHJcbiAgICB2YXIgcHJvcGVydHlOYW1lID0gJGF0dHJzLnN0VGFibGU7XHJcbiAgICB2YXIgZGlzcGxheUdldHRlciA9ICRwYXJzZShwcm9wZXJ0eU5hbWUpO1xyXG4gICAgdmFyIGRpc3BsYXlTZXR0ZXIgPSBkaXNwbGF5R2V0dGVyLmFzc2lnbjtcclxuICAgIHZhciBzYWZlR2V0dGVyO1xyXG4gICAgdmFyIG9yZGVyQnkgPSAkZmlsdGVyKCdvcmRlckJ5Jyk7XHJcbiAgICB2YXIgZmlsdGVyID0gJGZpbHRlcignZmlsdGVyJyk7XHJcbiAgICB2YXIgc2FmZUNvcHkgPSBjb3B5UmVmcyhkaXNwbGF5R2V0dGVyKCRzY29wZSkpO1xyXG4gICAgdmFyIHRhYmxlU3RhdGUgPSB7XHJcbiAgICAgIHNvcnQ6IHt9LFxyXG4gICAgICBzZWFyY2g6IHt9LFxyXG4gICAgICBwYWdpbmF0aW9uOiB7XHJcbiAgICAgICAgc3RhcnQ6IDBcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZhciBmaWx0ZXJlZDtcclxuICAgIHZhciBwaXBlQWZ0ZXJTYWZlQ29weSA9IHRydWU7XHJcbiAgICB2YXIgY3RybCA9IHRoaXM7XHJcbiAgICB2YXIgbGFzdFNlbGVjdGVkO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvcHlSZWZzIChzcmMpIHtcclxuICAgICAgcmV0dXJuIHNyYyA/IFtdLmNvbmNhdChzcmMpIDogW107XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlU2FmZUNvcHkgKCkge1xyXG4gICAgICBzYWZlQ29weSA9IGNvcHlSZWZzKHNhZmVHZXR0ZXIoJHNjb3BlKSk7XHJcbiAgICAgIGlmIChwaXBlQWZ0ZXJTYWZlQ29weSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIGN0cmwucGlwZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGVlcERlbGV0ZShvYmplY3QsIHBhdGgpIHtcclxuICAgICAgaWYgKHBhdGguaW5kZXhPZignLicpICE9IC0xKSB7XHJcbiAgICAgICAgICB2YXIgcGFydGlhbHMgPSBwYXRoLnNwbGl0KCcuJyk7XHJcbiAgICAgICAgICB2YXIga2V5ID0gcGFydGlhbHMucG9wKCk7XHJcbiAgICAgICAgICB2YXIgcGFyZW50UGF0aCA9IHBhcnRpYWxzLmpvaW4oJy4nKTsgXHJcbiAgICAgICAgICB2YXIgcGFyZW50T2JqZWN0ID0gJHBhcnNlKHBhcmVudFBhdGgpKG9iamVjdClcclxuICAgICAgICAgIGRlbGV0ZSBwYXJlbnRPYmplY3Rba2V5XTsgXHJcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocGFyZW50T2JqZWN0KS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBkZWVwRGVsZXRlKG9iamVjdCwgcGFyZW50UGF0aCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRlbGV0ZSBvYmplY3RbcGF0aF07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICgkYXR0cnMuc3RTYWZlU3JjKSB7XHJcbiAgICAgIHNhZmVHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzLnN0U2FmZVNyYyk7XHJcbiAgICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzYWZlU3JjID0gc2FmZUdldHRlcigkc2NvcGUpO1xyXG4gICAgICAgIHJldHVybiBzYWZlU3JjID8gc2FmZVNyYy5sZW5ndGggOiAwO1xyXG5cclxuICAgICAgfSwgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xyXG4gICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gc2FmZUNvcHkubGVuZ3RoKSB7XHJcbiAgICAgICAgICB1cGRhdGVTYWZlQ29weSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBzYWZlR2V0dGVyKCRzY29wZSk7XHJcbiAgICAgIH0sIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcclxuICAgICAgICBpZiAobmV3VmFsdWUgIT09IG9sZFZhbHVlKSB7XHJcbiAgICAgICAgICB1cGRhdGVTYWZlQ29weSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzb3J0IHRoZSByb3dzXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uIHwgU3RyaW5nfSBwcmVkaWNhdGUgLSBmdW5jdGlvbiBvciBzdHJpbmcgd2hpY2ggd2lsbCBiZSB1c2VkIGFzIHByZWRpY2F0ZSBmb3IgdGhlIHNvcnRpbmdcclxuICAgICAqIEBwYXJhbSBbcmV2ZXJzZV0gLSBpZiB5b3Ugd2FudCB0byByZXZlcnNlIHRoZSBvcmRlclxyXG4gICAgICovXHJcbiAgICB0aGlzLnNvcnRCeSA9IGZ1bmN0aW9uIHNvcnRCeSAocHJlZGljYXRlLCByZXZlcnNlKSB7XHJcbiAgICAgIHRhYmxlU3RhdGUuc29ydC5wcmVkaWNhdGUgPSBwcmVkaWNhdGU7XHJcbiAgICAgIHRhYmxlU3RhdGUuc29ydC5yZXZlcnNlID0gcmV2ZXJzZSA9PT0gdHJ1ZTtcclxuXHJcbiAgICAgIGlmIChuZy5pc0Z1bmN0aW9uKHByZWRpY2F0ZSkpIHtcclxuICAgICAgICB0YWJsZVN0YXRlLnNvcnQuZnVuY3Rpb25OYW1lID0gcHJlZGljYXRlLm5hbWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGVsZXRlIHRhYmxlU3RhdGUuc29ydC5mdW5jdGlvbk5hbWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRhYmxlU3RhdGUucGFnaW5hdGlvbi5zdGFydCA9IDA7XHJcbiAgICAgIHJldHVybiB0aGlzLnBpcGUoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZWFyY2ggbWF0Y2hpbmcgcm93c1xyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IC0gdGhlIGlucHV0IHN0cmluZ1xyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtwcmVkaWNhdGVdIC0gdGhlIHByb3BlcnR5IG5hbWUgYWdhaW5zdCB5b3Ugd2FudCB0byBjaGVjayB0aGUgbWF0Y2gsIG90aGVyd2lzZSBpdCB3aWxsIHNlYXJjaCBvbiBhbGwgcHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICB0aGlzLnNlYXJjaCA9IGZ1bmN0aW9uIHNlYXJjaCAoaW5wdXQsIHByZWRpY2F0ZSkge1xyXG4gICAgICB2YXIgcHJlZGljYXRlT2JqZWN0ID0gdGFibGVTdGF0ZS5zZWFyY2gucHJlZGljYXRlT2JqZWN0IHx8IHt9O1xyXG4gICAgICB2YXIgcHJvcCA9IHByZWRpY2F0ZSA/IHByZWRpY2F0ZSA6ICckJztcclxuXHJcbiAgICAgIGlucHV0ID0gbmcuaXNTdHJpbmcoaW5wdXQpID8gaW5wdXQudHJpbSgpIDogaW5wdXQ7XHJcbiAgICAgICRwYXJzZShwcm9wKS5hc3NpZ24ocHJlZGljYXRlT2JqZWN0LCBpbnB1dCk7XHJcbiAgICAgIC8vIHRvIGF2b2lkIHRvIGZpbHRlciBvdXQgbnVsbCB2YWx1ZVxyXG4gICAgICBpZiAoIWlucHV0KSB7XHJcbiAgICAgICAgZGVlcERlbGV0ZShwcmVkaWNhdGVPYmplY3QsIHByb3ApO1xyXG4gICAgICB9XHJcbiAgICAgIHRhYmxlU3RhdGUuc2VhcmNoLnByZWRpY2F0ZU9iamVjdCA9IHByZWRpY2F0ZU9iamVjdDtcclxuICAgICAgdGFibGVTdGF0ZS5wYWdpbmF0aW9uLnN0YXJ0ID0gMDtcclxuICAgICAgcmV0dXJuIHRoaXMucGlwZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIHRoaXMgd2lsbCBjaGFpbiB0aGUgb3BlcmF0aW9ucyBvZiBzb3J0aW5nIGFuZCBmaWx0ZXJpbmcgYmFzZWQgb24gdGhlIGN1cnJlbnQgdGFibGUgc3RhdGUgKHNvcnQgb3B0aW9ucywgZmlsdGVyaW5nLCBlY3QpXHJcbiAgICAgKi9cclxuICAgIHRoaXMucGlwZSA9IGZ1bmN0aW9uIHBpcGUgKCkge1xyXG4gICAgICB2YXIgcGFnaW5hdGlvbiA9IHRhYmxlU3RhdGUucGFnaW5hdGlvbjtcclxuICAgICAgdmFyIG91dHB1dDtcclxuICAgICAgZmlsdGVyZWQgPSB0YWJsZVN0YXRlLnNlYXJjaC5wcmVkaWNhdGVPYmplY3QgPyBmaWx0ZXIoc2FmZUNvcHksIHRhYmxlU3RhdGUuc2VhcmNoLnByZWRpY2F0ZU9iamVjdCkgOiBzYWZlQ29weTtcclxuICAgICAgaWYgKHRhYmxlU3RhdGUuc29ydC5wcmVkaWNhdGUpIHtcclxuICAgICAgICBmaWx0ZXJlZCA9IG9yZGVyQnkoZmlsdGVyZWQsIHRhYmxlU3RhdGUuc29ydC5wcmVkaWNhdGUsIHRhYmxlU3RhdGUuc29ydC5yZXZlcnNlKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocGFnaW5hdGlvbi5udW1iZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHBhZ2luYXRpb24ubnVtYmVyT2ZQYWdlcyA9IGZpbHRlcmVkLmxlbmd0aCA+IDAgPyBNYXRoLmNlaWwoZmlsdGVyZWQubGVuZ3RoIC8gcGFnaW5hdGlvbi5udW1iZXIpIDogMTtcclxuICAgICAgICBwYWdpbmF0aW9uLnN0YXJ0ID0gcGFnaW5hdGlvbi5zdGFydCA+PSBmaWx0ZXJlZC5sZW5ndGggPyAocGFnaW5hdGlvbi5udW1iZXJPZlBhZ2VzIC0gMSkgKiBwYWdpbmF0aW9uLm51bWJlciA6IHBhZ2luYXRpb24uc3RhcnQ7XHJcbiAgICAgICAgb3V0cHV0ID0gZmlsdGVyZWQuc2xpY2UocGFnaW5hdGlvbi5zdGFydCwgcGFnaW5hdGlvbi5zdGFydCArIHBhcnNlSW50KHBhZ2luYXRpb24ubnVtYmVyKSk7XHJcbiAgICAgIH1cclxuICAgICAgZGlzcGxheVNldHRlcigkc2NvcGUsIG91dHB1dCB8fCBmaWx0ZXJlZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2VsZWN0IGEgZGF0YVJvdyAoaXQgd2lsbCBhZGQgdGhlIGF0dHJpYnV0ZSBpc1NlbGVjdGVkIHRvIHRoZSByb3cgb2JqZWN0KVxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJvdyAtIHRoZSByb3cgdG8gc2VsZWN0XHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW21vZGVdIC0gXCJzaW5nbGVcIiBvciBcIm11bHRpcGxlXCIgKG11bHRpcGxlIGJ5IGRlZmF1bHQpXHJcbiAgICAgKi9cclxuICAgIHRoaXMuc2VsZWN0ID0gZnVuY3Rpb24gc2VsZWN0IChyb3csIG1vZGUpIHtcclxuICAgICAgdmFyIHJvd3MgPSBjb3B5UmVmcyhkaXNwbGF5R2V0dGVyKCRzY29wZSkpO1xyXG4gICAgICB2YXIgaW5kZXggPSByb3dzLmluZGV4T2Yocm93KTtcclxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgIGlmIChtb2RlID09PSAnc2luZ2xlJykge1xyXG4gICAgICAgICAgcm93LmlzU2VsZWN0ZWQgPSByb3cuaXNTZWxlY3RlZCAhPT0gdHJ1ZTtcclxuICAgICAgICAgIGlmIChsYXN0U2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgbGFzdFNlbGVjdGVkLmlzU2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGxhc3RTZWxlY3RlZCA9IHJvdy5pc1NlbGVjdGVkID09PSB0cnVlID8gcm93IDogdW5kZWZpbmVkO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByb3dzW2luZGV4XS5pc1NlbGVjdGVkID0gIXJvd3NbaW5kZXhdLmlzU2VsZWN0ZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogdGFrZSBhIHNsaWNlIG9mIHRoZSBjdXJyZW50IHNvcnRlZC9maWx0ZXJlZCBjb2xsZWN0aW9uIChwYWdpbmF0aW9uKVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydCAtIHN0YXJ0IGluZGV4IG9mIHRoZSBzbGljZVxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bWJlciAtIHRoZSBudW1iZXIgb2YgaXRlbSBpbiB0aGUgc2xpY2VcclxuICAgICAqL1xyXG4gICAgdGhpcy5zbGljZSA9IGZ1bmN0aW9uIHNwbGljZSAoc3RhcnQsIG51bWJlcikge1xyXG4gICAgICB0YWJsZVN0YXRlLnBhZ2luYXRpb24uc3RhcnQgPSBzdGFydDtcclxuICAgICAgdGFibGVTdGF0ZS5wYWdpbmF0aW9uLm51bWJlciA9IG51bWJlcjtcclxuICAgICAgcmV0dXJuIHRoaXMucGlwZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIHJldHVybiB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgdGFibGVcclxuICAgICAqIEByZXR1cm5zIHt7c29ydDoge30sIHNlYXJjaDoge30sIHBhZ2luYXRpb246IHtzdGFydDogbnVtYmVyfX19XHJcbiAgICAgKi9cclxuICAgIHRoaXMudGFibGVTdGF0ZSA9IGZ1bmN0aW9uIGdldFRhYmxlU3RhdGUgKCkge1xyXG4gICAgICByZXR1cm4gdGFibGVTdGF0ZTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5nZXRGaWx0ZXJlZENvbGxlY3Rpb24gPSBmdW5jdGlvbiBnZXRGaWx0ZXJlZENvbGxlY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gZmlsdGVyZWQgfHwgc2FmZUNvcHk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXNlIGEgZGlmZmVyZW50IGZpbHRlciBmdW5jdGlvbiB0aGFuIHRoZSBhbmd1bGFyIEZpbHRlckZpbHRlclxyXG4gICAgICogQHBhcmFtIGZpbHRlck5hbWUgdGhlIG5hbWUgdW5kZXIgd2hpY2ggdGhlIGN1c3RvbSBmaWx0ZXIgaXMgcmVnaXN0ZXJlZFxyXG4gICAgICovXHJcbiAgICB0aGlzLnNldEZpbHRlckZ1bmN0aW9uID0gZnVuY3Rpb24gc2V0RmlsdGVyRnVuY3Rpb24gKGZpbHRlck5hbWUpIHtcclxuICAgICAgZmlsdGVyID0gJGZpbHRlcihmaWx0ZXJOYW1lKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVc2UgYSBkaWZmZXJlbnQgZnVuY3Rpb24gdGhhbiB0aGUgYW5ndWxhciBvcmRlckJ5XHJcbiAgICAgKiBAcGFyYW0gc29ydEZ1bmN0aW9uTmFtZSB0aGUgbmFtZSB1bmRlciB3aGljaCB0aGUgY3VzdG9tIG9yZGVyIGZ1bmN0aW9uIGlzIHJlZ2lzdGVyZWRcclxuICAgICAqL1xyXG4gICAgdGhpcy5zZXRTb3J0RnVuY3Rpb24gPSBmdW5jdGlvbiBzZXRTb3J0RnVuY3Rpb24gKHNvcnRGdW5jdGlvbk5hbWUpIHtcclxuICAgICAgb3JkZXJCeSA9ICRmaWx0ZXIoc29ydEZ1bmN0aW9uTmFtZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXN1YWxseSB3aGVuIHRoZSBzYWZlIGNvcHkgaXMgdXBkYXRlZCB0aGUgcGlwZSBmdW5jdGlvbiBpcyBjYWxsZWQuXHJcbiAgICAgKiBDYWxsaW5nIHRoaXMgbWV0aG9kIHdpbGwgcHJldmVudCBpdCwgd2hpY2ggaXMgc29tZXRoaW5nIHJlcXVpcmVkIHdoZW4gdXNpbmcgYSBjdXN0b20gcGlwZSBmdW5jdGlvblxyXG4gICAgICovXHJcbiAgICB0aGlzLnByZXZlbnRQaXBlT25XYXRjaCA9IGZ1bmN0aW9uIHByZXZlbnRQaXBlICgpIHtcclxuICAgICAgcGlwZUFmdGVyU2FmZUNvcHkgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgfV0pXHJcbiAgLmRpcmVjdGl2ZSgnc3RUYWJsZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgIGNvbnRyb2xsZXI6ICdzdFRhYmxlQ29udHJvbGxlcicsXHJcbiAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0ciwgY3RybCkge1xyXG5cclxuICAgICAgICBpZiAoYXR0ci5zdFNldEZpbHRlcikge1xyXG4gICAgICAgICAgY3RybC5zZXRGaWx0ZXJGdW5jdGlvbihhdHRyLnN0U2V0RmlsdGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhdHRyLnN0U2V0U29ydCkge1xyXG4gICAgICAgICAgY3RybC5zZXRTb3J0RnVuY3Rpb24oYXR0ci5zdFNldFNvcnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9KTtcclxuIiwibmcubW9kdWxlKCdzbWFydC10YWJsZScpXHJcbiAgLmRpcmVjdGl2ZSgnc3RTZWFyY2gnLCBbJ3N0Q29uZmlnJywgJyR0aW1lb3V0JywnJHBhcnNlJywgZnVuY3Rpb24gKHN0Q29uZmlnLCAkdGltZW91dCwgJHBhcnNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXF1aXJlOiAnXnN0VGFibGUnLFxyXG4gICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIsIGN0cmwpIHtcclxuICAgICAgICB2YXIgdGFibGVDdHJsID0gY3RybDtcclxuICAgICAgICB2YXIgcHJvbWlzZSA9IG51bGw7XHJcbiAgICAgICAgdmFyIHRocm90dGxlID0gYXR0ci5zdERlbGF5IHx8IHN0Q29uZmlnLnNlYXJjaC5kZWxheTtcclxuXHJcbiAgICAgICAgYXR0ci4kb2JzZXJ2ZSgnc3RTZWFyY2gnLCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XHJcbiAgICAgICAgICB2YXIgaW5wdXQgPSBlbGVtZW50WzBdLnZhbHVlO1xyXG4gICAgICAgICAgaWYgKG5ld1ZhbHVlICE9PSBvbGRWYWx1ZSAmJiBpbnB1dCkge1xyXG4gICAgICAgICAgICBjdHJsLnRhYmxlU3RhdGUoKS5zZWFyY2ggPSB7fTtcclxuICAgICAgICAgICAgdGFibGVDdHJsLnNlYXJjaChpbnB1dCwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL3RhYmxlIHN0YXRlIC0+IHZpZXdcclxuICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgcmV0dXJuIGN0cmwudGFibGVTdGF0ZSgpLnNlYXJjaDtcclxuICAgICAgICB9LCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XHJcbiAgICAgICAgICB2YXIgcHJlZGljYXRlRXhwcmVzc2lvbiA9IGF0dHIuc3RTZWFyY2ggfHwgJyQnO1xyXG4gICAgICAgICAgaWYgKG5ld1ZhbHVlLnByZWRpY2F0ZU9iamVjdCAmJiAkcGFyc2UocHJlZGljYXRlRXhwcmVzc2lvbikobmV3VmFsdWUucHJlZGljYXRlT2JqZWN0KSAhPT0gZWxlbWVudFswXS52YWx1ZSkge1xyXG4gICAgICAgICAgICBlbGVtZW50WzBdLnZhbHVlID0gJHBhcnNlKHByZWRpY2F0ZUV4cHJlc3Npb24pKG5ld1ZhbHVlLnByZWRpY2F0ZU9iamVjdCkgfHwgJyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vIHZpZXcgLT4gdGFibGUgc3RhdGVcclxuICAgICAgICBlbGVtZW50LmJpbmQoJ2lucHV0JywgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgICAgZXZ0ID0gZXZ0Lm9yaWdpbmFsRXZlbnQgfHwgZXZ0O1xyXG4gICAgICAgICAgaWYgKHByb21pc2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHByb21pc2UpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHByb21pc2UgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRhYmxlQ3RybC5zZWFyY2goZXZ0LnRhcmdldC52YWx1ZSwgYXR0ci5zdFNlYXJjaCB8fCAnJyk7XHJcbiAgICAgICAgICAgIHByb21pc2UgPSBudWxsO1xyXG4gICAgICAgICAgfSwgdGhyb3R0bGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1dKTtcclxuIiwibmcubW9kdWxlKCdzbWFydC10YWJsZScpXHJcbiAgLmRpcmVjdGl2ZSgnc3RTZWxlY3RSb3cnLCBbJ3N0Q29uZmlnJywgZnVuY3Rpb24gKHN0Q29uZmlnKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICByZXF1aXJlOiAnXnN0VGFibGUnLFxyXG4gICAgICBzY29wZToge1xyXG4gICAgICAgIHJvdzogJz1zdFNlbGVjdFJvdydcclxuICAgICAgfSxcclxuICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyLCBjdHJsKSB7XHJcbiAgICAgICAgdmFyIG1vZGUgPSBhdHRyLnN0U2VsZWN0TW9kZSB8fCBzdENvbmZpZy5zZWxlY3QubW9kZTtcclxuICAgICAgICBlbGVtZW50LmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY3RybC5zZWxlY3Qoc2NvcGUucm93LCBtb2RlKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzY29wZS4kd2F0Y2goJ3Jvdy5pc1NlbGVjdGVkJywgZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICBpZiAobmV3VmFsdWUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhzdENvbmZpZy5zZWxlY3Quc2VsZWN0ZWRDbGFzcyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKHN0Q29uZmlnLnNlbGVjdC5zZWxlY3RlZENsYXNzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XSk7XHJcbiIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnKVxyXG4gIC5kaXJlY3RpdmUoJ3N0U29ydCcsIFsnc3RDb25maWcnLCAnJHBhcnNlJywgZnVuY3Rpb24gKHN0Q29uZmlnLCAkcGFyc2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgIHJlcXVpcmU6ICdec3RUYWJsZScsXHJcbiAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0ciwgY3RybCkge1xyXG5cclxuICAgICAgICB2YXIgcHJlZGljYXRlID0gYXR0ci5zdFNvcnQ7XHJcbiAgICAgICAgdmFyIGdldHRlciA9ICRwYXJzZShwcmVkaWNhdGUpO1xyXG4gICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgdmFyIGNsYXNzQXNjZW50ID0gYXR0ci5zdENsYXNzQXNjZW50IHx8IHN0Q29uZmlnLnNvcnQuYXNjZW50Q2xhc3M7XHJcbiAgICAgICAgdmFyIGNsYXNzRGVzY2VudCA9IGF0dHIuc3RDbGFzc0Rlc2NlbnQgfHwgc3RDb25maWcuc29ydC5kZXNjZW50Q2xhc3M7XHJcbiAgICAgICAgdmFyIHN0YXRlQ2xhc3NlcyA9IFtjbGFzc0FzY2VudCwgY2xhc3NEZXNjZW50XTtcclxuICAgICAgICB2YXIgc29ydERlZmF1bHQ7XHJcbiAgICAgICAgdmFyIHNraXBOYXR1cmFsID0gYXR0ci5zdFNraXBOYXR1cmFsICE9PSB1bmRlZmluZWQgPyBhdHRyLnN0U2tpcE5hdHVyYWwgOiBzdENvbmZpZy5zb3J0LnNraXBOYXR1cmFsO1xyXG5cclxuICAgICAgICBpZiAoYXR0ci5zdFNvcnREZWZhdWx0KSB7XHJcbiAgICAgICAgICBzb3J0RGVmYXVsdCA9IHNjb3BlLiRldmFsKGF0dHIuc3RTb3J0RGVmYXVsdCkgIT09IHVuZGVmaW5lZCA/IHNjb3BlLiRldmFsKGF0dHIuc3RTb3J0RGVmYXVsdCkgOiBhdHRyLnN0U29ydERlZmF1bHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3ZpZXcgLS0+IHRhYmxlIHN0YXRlXHJcbiAgICAgICAgZnVuY3Rpb24gc29ydCAoKSB7XHJcbiAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgcHJlZGljYXRlID0gbmcuaXNGdW5jdGlvbihnZXR0ZXIoc2NvcGUpKSA/IGdldHRlcihzY29wZSkgOiBhdHRyLnN0U29ydDtcclxuICAgICAgICAgIGlmIChpbmRleCAlIDMgPT09IDAgJiYgISFza2lwTmF0dXJhbCAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAvL21hbnVhbCByZXNldFxyXG4gICAgICAgICAgICBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGN0cmwudGFibGVTdGF0ZSgpLnNvcnQgPSB7fTtcclxuICAgICAgICAgICAgY3RybC50YWJsZVN0YXRlKCkucGFnaW5hdGlvbi5zdGFydCA9IDA7XHJcbiAgICAgICAgICAgIGN0cmwucGlwZSgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY3RybC5zb3J0QnkocHJlZGljYXRlLCBpbmRleCAlIDIgPT09IDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxlbWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uIHNvcnRDbGljayAoKSB7XHJcbiAgICAgICAgICBpZiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgICAgIHNjb3BlLiRhcHBseShzb3J0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHNvcnREZWZhdWx0KSB7XHJcbiAgICAgICAgICBpbmRleCA9IHNvcnREZWZhdWx0ID09PSAncmV2ZXJzZScgPyAxIDogMDtcclxuICAgICAgICAgIHNvcnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdGFibGUgc3RhdGUgLS0+IHZpZXdcclxuICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgcmV0dXJuIGN0cmwudGFibGVTdGF0ZSgpLnNvcnQ7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICBpZiAobmV3VmFsdWUucHJlZGljYXRlICE9PSBwcmVkaWNhdGUpIHtcclxuICAgICAgICAgICAgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICBlbGVtZW50XHJcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKGNsYXNzQXNjZW50KVxyXG4gICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhjbGFzc0Rlc2NlbnQpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW5kZXggPSBuZXdWYWx1ZS5yZXZlcnNlID09PSB0cnVlID8gMiA6IDE7XHJcbiAgICAgICAgICAgIGVsZW1lbnRcclxuICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3Moc3RhdGVDbGFzc2VzW2luZGV4ICUgMl0pXHJcbiAgICAgICAgICAgICAgLmFkZENsYXNzKHN0YXRlQ2xhc3Nlc1tpbmRleCAtIDFdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XSk7XHJcbiIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnKVxyXG4gIC5kaXJlY3RpdmUoJ3N0UGFnaW5hdGlvbicsIFsnc3RDb25maWcnLCBmdW5jdGlvbiAoc3RDb25maWcpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICByZXF1aXJlOiAnXnN0VGFibGUnLFxyXG4gICAgICBzY29wZToge1xyXG4gICAgICAgIHN0SXRlbXNCeVBhZ2U6ICc9PycsXHJcbiAgICAgICAgc3REaXNwbGF5ZWRQYWdlczogJz0/JyxcclxuICAgICAgICBzdFBhZ2VDaGFuZ2U6ICcmJ1xyXG4gICAgICB9LFxyXG4gICAgICB0ZW1wbGF0ZVVybDogZnVuY3Rpb24gKGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgaWYgKGF0dHJzLnN0VGVtcGxhdGUpIHtcclxuICAgICAgICAgIHJldHVybiBhdHRycy5zdFRlbXBsYXRlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RDb25maWcucGFnaW5hdGlvbi50ZW1wbGF0ZTtcclxuICAgICAgfSxcclxuICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xyXG5cclxuICAgICAgICBzY29wZS5zdEl0ZW1zQnlQYWdlID0gc2NvcGUuc3RJdGVtc0J5UGFnZSA/ICsoc2NvcGUuc3RJdGVtc0J5UGFnZSkgOiBzdENvbmZpZy5wYWdpbmF0aW9uLml0ZW1zQnlQYWdlO1xyXG4gICAgICAgIHNjb3BlLnN0RGlzcGxheWVkUGFnZXMgPSBzY29wZS5zdERpc3BsYXllZFBhZ2VzID8gKyhzY29wZS5zdERpc3BsYXllZFBhZ2VzKSA6IHN0Q29uZmlnLnBhZ2luYXRpb24uZGlzcGxheWVkUGFnZXM7XHJcblxyXG4gICAgICAgIHNjb3BlLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICBzY29wZS5wYWdlcyA9IFtdO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiByZWRyYXcgKCkge1xyXG4gICAgICAgICAgdmFyIHBhZ2luYXRpb25TdGF0ZSA9IGN0cmwudGFibGVTdGF0ZSgpLnBhZ2luYXRpb247XHJcbiAgICAgICAgICB2YXIgc3RhcnQgPSAxO1xyXG4gICAgICAgICAgdmFyIGVuZDtcclxuICAgICAgICAgIHZhciBpO1xyXG4gICAgICAgICAgdmFyIHByZXZQYWdlID0gc2NvcGUuY3VycmVudFBhZ2U7XHJcbiAgICAgICAgICBzY29wZS5jdXJyZW50UGFnZSA9IE1hdGguZmxvb3IocGFnaW5hdGlvblN0YXRlLnN0YXJ0IC8gcGFnaW5hdGlvblN0YXRlLm51bWJlcikgKyAxO1xyXG5cclxuICAgICAgICAgIHN0YXJ0ID0gTWF0aC5tYXgoc3RhcnQsIHNjb3BlLmN1cnJlbnRQYWdlIC0gTWF0aC5hYnMoTWF0aC5mbG9vcihzY29wZS5zdERpc3BsYXllZFBhZ2VzIC8gMikpKTtcclxuICAgICAgICAgIGVuZCA9IHN0YXJ0ICsgc2NvcGUuc3REaXNwbGF5ZWRQYWdlcztcclxuXHJcbiAgICAgICAgICBpZiAoZW5kID4gcGFnaW5hdGlvblN0YXRlLm51bWJlck9mUGFnZXMpIHtcclxuICAgICAgICAgICAgZW5kID0gcGFnaW5hdGlvblN0YXRlLm51bWJlck9mUGFnZXMgKyAxO1xyXG4gICAgICAgICAgICBzdGFydCA9IE1hdGgubWF4KDEsIGVuZCAtIHNjb3BlLnN0RGlzcGxheWVkUGFnZXMpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHNjb3BlLnBhZ2VzID0gW107XHJcbiAgICAgICAgICBzY29wZS5udW1QYWdlcyA9IHBhZ2luYXRpb25TdGF0ZS5udW1iZXJPZlBhZ2VzO1xyXG5cclxuICAgICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcclxuICAgICAgICAgICAgc2NvcGUucGFnZXMucHVzaChpKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAocHJldlBhZ2UgIT09IHNjb3BlLmN1cnJlbnRQYWdlKSB7XHJcbiAgICAgICAgICAgIHNjb3BlLnN0UGFnZUNoYW5nZSh7bmV3UGFnZTogc2NvcGUuY3VycmVudFBhZ2V9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdGFibGUgc3RhdGUgLS0+IHZpZXdcclxuICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgcmV0dXJuIGN0cmwudGFibGVTdGF0ZSgpLnBhZ2luYXRpb247XHJcbiAgICAgICAgfSwgcmVkcmF3LCB0cnVlKTtcclxuXHJcbiAgICAgICAgLy9zY29wZSAtLT4gdGFibGUgc3RhdGUgICgtLT4gdmlldylcclxuICAgICAgICBzY29wZS4kd2F0Y2goJ3N0SXRlbXNCeVBhZ2UnLCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XHJcbiAgICAgICAgICBpZiAobmV3VmFsdWUgIT09IG9sZFZhbHVlKSB7XHJcbiAgICAgICAgICAgIHNjb3BlLnNlbGVjdFBhZ2UoMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNjb3BlLiR3YXRjaCgnc3REaXNwbGF5ZWRQYWdlcycsIHJlZHJhdyk7XHJcblxyXG4gICAgICAgIC8vdmlldyAtPiB0YWJsZSBzdGF0ZVxyXG4gICAgICAgIHNjb3BlLnNlbGVjdFBhZ2UgPSBmdW5jdGlvbiAocGFnZSkge1xyXG4gICAgICAgICAgaWYgKHBhZ2UgPiAwICYmIHBhZ2UgPD0gc2NvcGUubnVtUGFnZXMpIHtcclxuICAgICAgICAgICAgY3RybC5zbGljZSgocGFnZSAtIDEpICogc2NvcGUuc3RJdGVtc0J5UGFnZSwgc2NvcGUuc3RJdGVtc0J5UGFnZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCFjdHJsLnRhYmxlU3RhdGUoKS5wYWdpbmF0aW9uLm51bWJlcikge1xyXG4gICAgICAgICAgY3RybC5zbGljZSgwLCBzY29wZS5zdEl0ZW1zQnlQYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfV0pO1xyXG4iLCJuZy5tb2R1bGUoJ3NtYXJ0LXRhYmxlJylcclxuICAuZGlyZWN0aXZlKCdzdFBpcGUnLCBbJ3N0Q29uZmlnJywgJyR0aW1lb3V0JywgZnVuY3Rpb24gKGNvbmZpZywgJHRpbWVvdXQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlcXVpcmU6ICdzdFRhYmxlJyxcclxuICAgICAgc2NvcGU6IHtcclxuICAgICAgICBzdFBpcGU6ICc9J1xyXG4gICAgICB9LFxyXG4gICAgICBsaW5rOiB7XHJcblxyXG4gICAgICAgIHByZTogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xyXG5cclxuICAgICAgICAgIHZhciBwaXBlUHJvbWlzZSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgaWYgKG5nLmlzRnVuY3Rpb24oc2NvcGUuc3RQaXBlKSkge1xyXG4gICAgICAgICAgICBjdHJsLnByZXZlbnRQaXBlT25XYXRjaCgpO1xyXG4gICAgICAgICAgICBjdHJsLnBpcGUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChwaXBlUHJvbWlzZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHBpcGVQcm9taXNlKVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgcGlwZVByb21pc2UgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5zdFBpcGUoY3RybC50YWJsZVN0YXRlKCksIGN0cmwpO1xyXG4gICAgICAgICAgICAgIH0sIGNvbmZpZy5waXBlLmRlbGF5KTtcclxuXHJcbiAgICAgICAgICAgICAgcmV0dXJuIHBpcGVQcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcG9zdDogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xyXG4gICAgICAgICAgY3RybC5waXBlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1dKTtcclxuIiwifSkoYW5ndWxhcik7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9