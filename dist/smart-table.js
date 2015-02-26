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

                //table state -> view
                scope.$watch(function () {
                    return ctrl.tableState().search;
                }, function (newValue, oldValue) {
                    var predicateExpression = scope.predicate || '$';
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
                        tableCtrl.search(evt.target.value, scope.predicate || '');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy90b3AudHh0Iiwic3JjL3NtYXJ0LXRhYmxlLm1vZHVsZS5qcyIsInNyYy9zdFRhYmxlLmpzIiwic3JjL3N0U2VhcmNoLmpzIiwic3JjL3N0U2VsZWN0Um93LmpzIiwic3JjL3N0U29ydC5qcyIsInNyYy9zdFBhZ2luYXRpb24uanMiLCJzcmMvc3RQaXBlLmpzIiwic3JjL2JvdHRvbS50eHQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkEiLCJmaWxlIjoic21hcnQtdGFibGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKG5nLCB1bmRlZmluZWQpe1xuICAgICd1c2Ugc3RyaWN0JztcbiIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnLCBbXSkucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3RlbXBsYXRlL3NtYXJ0LXRhYmxlL3BhZ2luYXRpb24uaHRtbCcsXG4gICAgICAgICc8bmF2IG5nLWlmPVwicGFnZXMubGVuZ3RoID49IDJcIj48dWwgY2xhc3M9XCJwYWdpbmF0aW9uXCI+JyArXG4gICAgICAgICc8bGkgbmctcmVwZWF0PVwicGFnZSBpbiBwYWdlc1wiIG5nLWNsYXNzPVwie2FjdGl2ZTogcGFnZT09Y3VycmVudFBhZ2V9XCI+PGEgbmctY2xpY2s9XCJzZWxlY3RQYWdlKHBhZ2UpXCI+e3twYWdlfX08L2E+PC9saT4nICtcbiAgICAgICAgJzwvdWw+PC9uYXY+Jyk7XG59XSk7XG5cbiIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnKVxuICAuY29udHJvbGxlcignc3RUYWJsZUNvbnRyb2xsZXInLCBbJyRzY29wZScsICckcGFyc2UnLCAnJGZpbHRlcicsICckYXR0cnMnLCBmdW5jdGlvbiBTdFRhYmxlQ29udHJvbGxlcigkc2NvcGUsICRwYXJzZSwgJGZpbHRlciwgJGF0dHJzKSB7XG4gICAgdmFyIHByb3BlcnR5TmFtZSA9ICRhdHRycy5zdFRhYmxlO1xuICAgIHZhciBkaXNwbGF5R2V0dGVyID0gJHBhcnNlKHByb3BlcnR5TmFtZSk7XG4gICAgdmFyIGRpc3BsYXlTZXR0ZXIgPSBkaXNwbGF5R2V0dGVyLmFzc2lnbjtcbiAgICB2YXIgc2FmZUdldHRlcjtcbiAgICB2YXIgb3JkZXJCeSA9ICRmaWx0ZXIoJ29yZGVyQnknKTtcbiAgICB2YXIgZmlsdGVyID0gJGZpbHRlcignZmlsdGVyJyk7XG4gICAgdmFyIHNhZmVDb3B5ID0gY29weVJlZnMoZGlzcGxheUdldHRlcigkc2NvcGUpKTtcbiAgICB2YXIgdGFibGVTdGF0ZSA9IHtcbiAgICAgIHNvcnQ6IHt9LFxuICAgICAgc2VhcmNoOiB7fSxcbiAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgc3RhcnQ6IDBcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBwaXBlQWZ0ZXJTYWZlQ29weSA9IHRydWU7XG4gICAgdmFyIGN0cmwgPSB0aGlzO1xuICAgIHZhciBsYXN0U2VsZWN0ZWQ7XG5cbiAgICBmdW5jdGlvbiBjb3B5UmVmcyhzcmMpIHtcbiAgICAgIHJldHVybiBzcmMgPyBbXS5jb25jYXQoc3JjKSA6IFtdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVNhZmVDb3B5KCkge1xuICAgICAgc2FmZUNvcHkgPSBjb3B5UmVmcyhzYWZlR2V0dGVyKCRzY29wZSkpO1xuICAgICAgaWYgKHBpcGVBZnRlclNhZmVDb3B5ID09PSB0cnVlKSB7XG4gICAgICAgIGN0cmwucGlwZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICgkYXR0cnMuc3RTYWZlU3JjKSB7XG4gICAgICBzYWZlR2V0dGVyID0gJHBhcnNlKCRhdHRycy5zdFNhZmVTcmMpO1xuICAgICAgJHNjb3BlLiR3YXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzYWZlU3JjID0gc2FmZUdldHRlcigkc2NvcGUpO1xuICAgICAgICByZXR1cm4gc2FmZVNyYyA/IHNhZmVTcmMubGVuZ3RoIDogMDtcblxuICAgICAgfSwgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICBpZiAobmV3VmFsdWUgIT09IHNhZmVDb3B5Lmxlbmd0aCkge1xuICAgICAgICAgIHVwZGF0ZVNhZmVDb3B5KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgJHNjb3BlLiR3YXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBzYWZlR2V0dGVyKCRzY29wZSk7XG4gICAgICB9LCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICB1cGRhdGVTYWZlQ29weSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzb3J0IHRoZSByb3dzXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbiB8IFN0cmluZ30gcHJlZGljYXRlIC0gZnVuY3Rpb24gb3Igc3RyaW5nIHdoaWNoIHdpbGwgYmUgdXNlZCBhcyBwcmVkaWNhdGUgZm9yIHRoZSBzb3J0aW5nXG4gICAgICogQHBhcmFtIFtyZXZlcnNlXSAtIGlmIHlvdSB3YW50IHRvIHJldmVyc2UgdGhlIG9yZGVyXG4gICAgICovXG4gICAgdGhpcy5zb3J0QnkgPSBmdW5jdGlvbiBzb3J0QnkocHJlZGljYXRlLCByZXZlcnNlKSB7XG4gICAgICB0YWJsZVN0YXRlLnNvcnQucHJlZGljYXRlID0gcHJlZGljYXRlO1xuICAgICAgdGFibGVTdGF0ZS5zb3J0LnJldmVyc2UgPSByZXZlcnNlID09PSB0cnVlO1xuXG4gICAgICBpZiAobmcuaXNGdW5jdGlvbihwcmVkaWNhdGUpKSB7XG4gICAgICAgIHRhYmxlU3RhdGUuc29ydC5mdW5jdGlvbk5hbWUgPSBwcmVkaWNhdGUubmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSB0YWJsZVN0YXRlLnNvcnQuZnVuY3Rpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICB0YWJsZVN0YXRlLnBhZ2luYXRpb24uc3RhcnQgPSAwO1xuICAgICAgcmV0dXJuIHRoaXMucGlwZSgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBzZWFyY2ggbWF0Y2hpbmcgcm93c1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCAtIHRoZSBpbnB1dCBzdHJpbmdcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW3ByZWRpY2F0ZV0gLSB0aGUgcHJvcGVydHkgbmFtZSBhZ2FpbnN0IHlvdSB3YW50IHRvIGNoZWNrIHRoZSBtYXRjaCwgb3RoZXJ3aXNlIGl0IHdpbGwgc2VhcmNoIG9uIGFsbCBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgdGhpcy5zZWFyY2ggPSBmdW5jdGlvbiBzZWFyY2goaW5wdXQsIHByZWRpY2F0ZSkge1xuICAgICAgdmFyIHByZWRpY2F0ZU9iamVjdCA9IHRhYmxlU3RhdGUuc2VhcmNoLnByZWRpY2F0ZU9iamVjdCB8fCB7fTtcbiAgICAgIHZhciBwcm9wID0gcHJlZGljYXRlID8gcHJlZGljYXRlIDogJyQnO1xuXG4gICAgICBpbnB1dCA9IG5nLmlzU3RyaW5nKGlucHV0KSA/IGlucHV0LnRyaW0oKSA6IGlucHV0O1xuICAgICAgcHJlZGljYXRlT2JqZWN0W3Byb3BdID0gaW5wdXQ7XG4gICAgICAvLyB0byBhdm9pZCB0byBmaWx0ZXIgb3V0IG51bGwgdmFsdWVcbiAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgZGVsZXRlIHByZWRpY2F0ZU9iamVjdFtwcm9wXTtcbiAgICAgIH1cbiAgICAgIHRhYmxlU3RhdGUuc2VhcmNoLnByZWRpY2F0ZU9iamVjdCA9IHByZWRpY2F0ZU9iamVjdDtcbiAgICAgIHRhYmxlU3RhdGUucGFnaW5hdGlvbi5zdGFydCA9IDA7XG4gICAgICByZXR1cm4gdGhpcy5waXBlKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHRoaXMgd2lsbCBjaGFpbiB0aGUgb3BlcmF0aW9ucyBvZiBzb3J0aW5nIGFuZCBmaWx0ZXJpbmcgYmFzZWQgb24gdGhlIGN1cnJlbnQgdGFibGUgc3RhdGUgKHNvcnQgb3B0aW9ucywgZmlsdGVyaW5nLCBlY3QpXG4gICAgICovXG4gICAgdGhpcy5waXBlID0gZnVuY3Rpb24gcGlwZSgpIHtcbiAgICAgIHZhciBwYWdpbmF0aW9uID0gdGFibGVTdGF0ZS5wYWdpbmF0aW9uO1xuICAgICAgdmFyIGZpbHRlcmVkID0gdGFibGVTdGF0ZS5zZWFyY2gucHJlZGljYXRlT2JqZWN0ID8gZmlsdGVyKHNhZmVDb3B5LCB0YWJsZVN0YXRlLnNlYXJjaC5wcmVkaWNhdGVPYmplY3QpIDogc2FmZUNvcHk7XG4gICAgICBpZiAodGFibGVTdGF0ZS5zb3J0LnByZWRpY2F0ZSkge1xuICAgICAgICBmaWx0ZXJlZCA9IG9yZGVyQnkoZmlsdGVyZWQsIHRhYmxlU3RhdGUuc29ydC5wcmVkaWNhdGUsIHRhYmxlU3RhdGUuc29ydC5yZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIGlmIChwYWdpbmF0aW9uLm51bWJlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBhZ2luYXRpb24ubnVtYmVyT2ZQYWdlcyA9IGZpbHRlcmVkLmxlbmd0aCA+IDAgPyBNYXRoLmNlaWwoZmlsdGVyZWQubGVuZ3RoIC8gcGFnaW5hdGlvbi5udW1iZXIpIDogMTtcbiAgICAgICAgcGFnaW5hdGlvbi5zdGFydCA9IHBhZ2luYXRpb24uc3RhcnQgPj0gZmlsdGVyZWQubGVuZ3RoID8gKHBhZ2luYXRpb24ubnVtYmVyT2ZQYWdlcyAtIDEpICogcGFnaW5hdGlvbi5udW1iZXIgOiBwYWdpbmF0aW9uLnN0YXJ0O1xuICAgICAgICBmaWx0ZXJlZCA9IGZpbHRlcmVkLnNsaWNlKHBhZ2luYXRpb24uc3RhcnQsIHBhZ2luYXRpb24uc3RhcnQgKyBwYXJzZUludChwYWdpbmF0aW9uLm51bWJlcikpO1xuICAgICAgfVxuICAgICAgZGlzcGxheVNldHRlcigkc2NvcGUsIGZpbHRlcmVkKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogc2VsZWN0IGEgZGF0YVJvdyAoaXQgd2lsbCBhZGQgdGhlIGF0dHJpYnV0ZSBpc1NlbGVjdGVkIHRvIHRoZSByb3cgb2JqZWN0KVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByb3cgLSB0aGUgcm93IHRvIHNlbGVjdFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbbW9kZV0gLSBcInNpbmdsZVwiIG9yIFwibXVsdGlwbGVcIiAobXVsdGlwbGUgYnkgZGVmYXVsdClcbiAgICAgKi9cbiAgICB0aGlzLnNlbGVjdCA9IGZ1bmN0aW9uIHNlbGVjdChyb3csIG1vZGUpIHtcbiAgICAgIHZhciByb3dzID0gc2FmZUNvcHk7XG4gICAgICB2YXIgaW5kZXggPSByb3dzLmluZGV4T2Yocm93KTtcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgaWYgKG1vZGUgPT09ICdzaW5nbGUnKSB7XG4gICAgICAgICAgcm93LmlzU2VsZWN0ZWQgPSByb3cuaXNTZWxlY3RlZCAhPT0gdHJ1ZTtcbiAgICAgICAgICBpZiAobGFzdFNlbGVjdGVkKSB7XG4gICAgICAgICAgICBsYXN0U2VsZWN0ZWQuaXNTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsYXN0U2VsZWN0ZWQgPSByb3cuaXNTZWxlY3RlZCA9PT0gdHJ1ZSA/IHJvdyA6IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByb3dzW2luZGV4XS5pc1NlbGVjdGVkID0gIXJvd3NbaW5kZXhdLmlzU2VsZWN0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogdGFrZSBhIHNsaWNlIG9mIHRoZSBjdXJyZW50IHNvcnRlZC9maWx0ZXJlZCBjb2xsZWN0aW9uIChwYWdpbmF0aW9uKVxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0IC0gc3RhcnQgaW5kZXggb2YgdGhlIHNsaWNlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bWJlciAtIHRoZSBudW1iZXIgb2YgaXRlbSBpbiB0aGUgc2xpY2VcbiAgICAgKi9cbiAgICB0aGlzLnNsaWNlID0gZnVuY3Rpb24gc3BsaWNlKHN0YXJ0LCBudW1iZXIpIHtcbiAgICAgIHRhYmxlU3RhdGUucGFnaW5hdGlvbi5zdGFydCA9IHN0YXJ0O1xuICAgICAgdGFibGVTdGF0ZS5wYWdpbmF0aW9uLm51bWJlciA9IG51bWJlcjtcbiAgICAgIHJldHVybiB0aGlzLnBpcGUoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSB0YWJsZVxuICAgICAqIEByZXR1cm5zIHt7c29ydDoge30sIHNlYXJjaDoge30sIHBhZ2luYXRpb246IHtzdGFydDogbnVtYmVyfX19XG4gICAgICovXG4gICAgdGhpcy50YWJsZVN0YXRlID0gZnVuY3Rpb24gZ2V0VGFibGVTdGF0ZSgpIHtcbiAgICAgIHJldHVybiB0YWJsZVN0YXRlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVc2UgYSBkaWZmZXJlbnQgZmlsdGVyIGZ1bmN0aW9uIHRoYW4gdGhlIGFuZ3VsYXIgRmlsdGVyRmlsdGVyXG4gICAgICogQHBhcmFtIGZpbHRlck5hbWUgdGhlIG5hbWUgdW5kZXIgd2hpY2ggdGhlIGN1c3RvbSBmaWx0ZXIgaXMgcmVnaXN0ZXJlZFxuICAgICAqL1xuICAgIHRoaXMuc2V0RmlsdGVyRnVuY3Rpb24gPSBmdW5jdGlvbiBzZXRGaWx0ZXJGdW5jdGlvbihmaWx0ZXJOYW1lKSB7XG4gICAgICBmaWx0ZXIgPSAkZmlsdGVyKGZpbHRlck5hbWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlVzZXIgYSBkaWZmZXJlbnQgZnVuY3Rpb24gdGhhbiB0aGUgYW5ndWxhciBvcmRlckJ5XG4gICAgICogQHBhcmFtIHNvcnRGdW5jdGlvbk5hbWUgdGhlIG5hbWUgdW5kZXIgd2hpY2ggdGhlIGN1c3RvbSBvcmRlciBmdW5jdGlvbiBpcyByZWdpc3RlcmVkXG4gICAgICovXG4gICAgdGhpcy5zZXRTb3J0RnVuY3Rpb24gPSBmdW5jdGlvbiBzZXRTb3J0RnVuY3Rpb24oc29ydEZ1bmN0aW9uTmFtZSkge1xuICAgICAgb3JkZXJCeSA9ICRmaWx0ZXIoc29ydEZ1bmN0aW9uTmFtZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVzdWFsbHkgd2hlbiB0aGUgc2FmZSBjb3B5IGlzIHVwZGF0ZWQgdGhlIHBpcGUgZnVuY3Rpb24gaXMgY2FsbGVkLlxuICAgICAqIENhbGxpbmcgdGhpcyBtZXRob2Qgd2lsbCBwcmV2ZW50IGl0LCB3aGljaCBpcyBzb21ldGhpbmcgcmVxdWlyZWQgd2hlbiB1c2luZyBhIGN1c3RvbSBwaXBlIGZ1bmN0aW9uXG4gICAgICovXG4gICAgdGhpcy5wcmV2ZW50UGlwZU9uV2F0Y2ggPSBmdW5jdGlvbiBwcmV2ZW50UGlwZSgpIHtcbiAgICAgIHBpcGVBZnRlclNhZmVDb3B5ID0gZmFsc2U7XG4gICAgfTtcbiAgfV0pXG4gIC5kaXJlY3RpdmUoJ3N0VGFibGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICBjb250cm9sbGVyOiAnc3RUYWJsZUNvbnRyb2xsZXInLFxuICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyLCBjdHJsKSB7XG5cbiAgICAgICAgaWYgKGF0dHIuc3RTZXRGaWx0ZXIpIHtcbiAgICAgICAgICBjdHJsLnNldEZpbHRlckZ1bmN0aW9uKGF0dHIuc3RTZXRGaWx0ZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGF0dHIuc3RTZXRTb3J0KSB7XG4gICAgICAgICAgY3RybC5zZXRTb3J0RnVuY3Rpb24oYXR0ci5zdFNldFNvcnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4iLCJuZy5tb2R1bGUoJ3NtYXJ0LXRhYmxlJylcbiAgICAuZGlyZWN0aXZlKCdzdFNlYXJjaCcsIFsnJHRpbWVvdXQnLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlcXVpcmU6ICdec3RUYWJsZScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIHByZWRpY2F0ZTogJz0/c3RTZWFyY2gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyLCBjdHJsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhYmxlQ3RybCA9IGN0cmw7XG4gICAgICAgICAgICAgICAgdmFyIHByb21pc2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIHZhciB0aHJvdHRsZSA9IGF0dHIuc3REZWxheSB8fCA0MDA7XG5cbiAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goJ3ByZWRpY2F0ZScsIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlICE9PSBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3RybC50YWJsZVN0YXRlKCkuc2VhcmNoID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJsZUN0cmwuc2VhcmNoKGVsZW1lbnRbMF0udmFsdWUgfHwgJycsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy90YWJsZSBzdGF0ZSAtPiB2aWV3XG4gICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN0cmwudGFibGVTdGF0ZSgpLnNlYXJjaDtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcmVkaWNhdGVFeHByZXNzaW9uID0gc2NvcGUucHJlZGljYXRlIHx8ICckJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlLnByZWRpY2F0ZU9iamVjdCAmJiBuZXdWYWx1ZS5wcmVkaWNhdGVPYmplY3RbcHJlZGljYXRlRXhwcmVzc2lvbl0gIT09IGVsZW1lbnRbMF0udmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRbMF0udmFsdWUgPSBuZXdWYWx1ZS5wcmVkaWNhdGVPYmplY3RbcHJlZGljYXRlRXhwcmVzc2lvbl0gfHwgJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIC8vIHZpZXcgLT4gdGFibGUgc3RhdGVcbiAgICAgICAgICAgICAgICBlbGVtZW50LmJpbmQoJ2lucHV0JywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICBldnQgPSBldnQub3JpZ2luYWxFdmVudCB8fCBldnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dC5jYW5jZWwocHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlQ3RybC5zZWFyY2goZXZ0LnRhcmdldC52YWx1ZSwgc2NvcGUucHJlZGljYXRlIHx8ICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9LCB0aHJvdHRsZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pO1xuIiwibmcubW9kdWxlKCdzbWFydC10YWJsZScpXG4gIC5kaXJlY3RpdmUoJ3N0U2VsZWN0Um93JywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgcmVxdWlyZTogJ15zdFRhYmxlJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHJvdzogJz1zdFNlbGVjdFJvdydcbiAgICAgIH0sXG4gICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIsIGN0cmwpIHtcbiAgICAgICAgdmFyIG1vZGUgPSBhdHRyLnN0U2VsZWN0TW9kZSB8fCAnc2luZ2xlJztcbiAgICAgICAgZWxlbWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY3RybC5zZWxlY3Qoc2NvcGUucm93LCBtb2RlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2NvcGUuJHdhdGNoKCdyb3cuaXNTZWxlY3RlZCcsIGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnc3Qtc2VsZWN0ZWQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnc3Qtc2VsZWN0ZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuIiwibmcubW9kdWxlKCdzbWFydC10YWJsZScpXG4gIC5kaXJlY3RpdmUoJ3N0U29ydCcsIFsnJHBhcnNlJywgZnVuY3Rpb24gKCRwYXJzZSkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgcmVxdWlyZTogJ15zdFRhYmxlJyxcbiAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0ciwgY3RybCkge1xuXG4gICAgICAgIHZhciBwcmVkaWNhdGUgPSBhdHRyLnN0U29ydDtcbiAgICAgICAgdmFyIGdldHRlciA9ICRwYXJzZShwcmVkaWNhdGUpO1xuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICB2YXIgY2xhc3NBc2NlbnQgPSBhdHRyLnN0Q2xhc3NBc2NlbnQgfHwgJ3N0LXNvcnQtYXNjZW50JztcbiAgICAgICAgdmFyIGNsYXNzRGVzY2VudCA9IGF0dHIuc3RDbGFzc0Rlc2NlbnQgfHwgJ3N0LXNvcnQtZGVzY2VudCc7XG4gICAgICAgIHZhciBzdGF0ZUNsYXNzZXMgPSBbY2xhc3NBc2NlbnQsIGNsYXNzRGVzY2VudF07XG4gICAgICAgIHZhciBzb3J0RGVmYXVsdDtcblxuICAgICAgICBpZiAoYXR0ci5zdFNvcnREZWZhdWx0KSB7XG4gICAgICAgICAgc29ydERlZmF1bHQgPSBzY29wZS4kZXZhbChhdHRyLnN0U29ydERlZmF1bHQpICE9PSB1bmRlZmluZWQgPyAgc2NvcGUuJGV2YWwoYXR0ci5zdFNvcnREZWZhdWx0KSA6IGF0dHIuc3RTb3J0RGVmYXVsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vdmlldyAtLT4gdGFibGUgc3RhdGVcbiAgICAgICAgZnVuY3Rpb24gc29ydCgpIHtcbiAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgIHByZWRpY2F0ZSA9IG5nLmlzRnVuY3Rpb24oZ2V0dGVyKHNjb3BlKSkgPyBnZXR0ZXIoc2NvcGUpIDogYXR0ci5zdFNvcnQ7XG4gICAgICAgICAgaWYgKGluZGV4ICUgMyA9PT0gMCAmJiBhdHRyLnN0U2tpcE5hdHVyYWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy9tYW51YWwgcmVzZXRcbiAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgIGN0cmwudGFibGVTdGF0ZSgpLnNvcnQgPSB7fTtcbiAgICAgICAgICAgIGN0cmwudGFibGVTdGF0ZSgpLnBhZ2luYXRpb24uc3RhcnQgPSAwO1xuICAgICAgICAgICAgY3RybC5waXBlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN0cmwuc29ydEJ5KHByZWRpY2F0ZSwgaW5kZXggJSAyID09PSAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50LmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24gc29ydENsaWNrKCkge1xuICAgICAgICAgIGlmIChwcmVkaWNhdGUpIHtcbiAgICAgICAgICAgIHNjb3BlLiRhcHBseShzb3J0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzb3J0RGVmYXVsdCkge1xuICAgICAgICAgIGluZGV4ID0gYXR0ci5zdFNvcnREZWZhdWx0ID09PSAncmV2ZXJzZScgPyAxIDogMDtcbiAgICAgICAgICBzb3J0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL3RhYmxlIHN0YXRlIC0tPiB2aWV3XG4gICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGN0cmwudGFibGVTdGF0ZSgpLnNvcnQ7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgIGlmIChuZXdWYWx1ZS5wcmVkaWNhdGUgIT09IHByZWRpY2F0ZSkge1xuICAgICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICAgICAgZWxlbWVudFxuICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoY2xhc3NBc2NlbnQpXG4gICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhjbGFzc0Rlc2NlbnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbmRleCA9IG5ld1ZhbHVlLnJldmVyc2UgPT09IHRydWUgPyAyIDogMTtcbiAgICAgICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKHN0YXRlQ2xhc3Nlc1tpbmRleCAlIDJdKVxuICAgICAgICAgICAgICAuYWRkQ2xhc3Moc3RhdGVDbGFzc2VzW2luZGV4IC0gMV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfV0pO1xuIiwibmcubW9kdWxlKCdzbWFydC10YWJsZScpXG4gIC5kaXJlY3RpdmUoJ3N0UGFnaW5hdGlvbicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICByZXF1aXJlOiAnXnN0VGFibGUnLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgc3RJdGVtc0J5UGFnZTogJz0/JyxcbiAgICAgICAgc3REaXNwbGF5ZWRQYWdlczogJz0/JyxcbiAgICAgICAgc3RQYWdlQ2hhbmdlOiAnJidcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZVVybDogZnVuY3Rpb24gKGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIGlmIChhdHRycy5zdFRlbXBsYXRlKSB7XG4gICAgICAgICAgcmV0dXJuIGF0dHJzLnN0VGVtcGxhdGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICd0ZW1wbGF0ZS9zbWFydC10YWJsZS9wYWdpbmF0aW9uLmh0bWwnO1xuICAgICAgfSxcbiAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcblxuICAgICAgICBzY29wZS5zdEl0ZW1zQnlQYWdlID0gc2NvcGUuc3RJdGVtc0J5UGFnZSA/ICsoc2NvcGUuc3RJdGVtc0J5UGFnZSkgOiAxMDtcbiAgICAgICAgc2NvcGUuc3REaXNwbGF5ZWRQYWdlcyA9IHNjb3BlLnN0RGlzcGxheWVkUGFnZXMgPyArKHNjb3BlLnN0RGlzcGxheWVkUGFnZXMpIDogNTtcblxuICAgICAgICBzY29wZS5jdXJyZW50UGFnZSA9IDE7XG4gICAgICAgIHNjb3BlLnBhZ2VzID0gW107XG5cbiAgICAgICAgZnVuY3Rpb24gcmVkcmF3KCkge1xuICAgICAgICAgIHZhciBwYWdpbmF0aW9uU3RhdGUgPSBjdHJsLnRhYmxlU3RhdGUoKS5wYWdpbmF0aW9uO1xuICAgICAgICAgIHZhciBzdGFydCA9IDE7XG4gICAgICAgICAgdmFyIGVuZDtcbiAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICB2YXIgcHJldlBhZ2UgPSBzY29wZS5jdXJyZW50UGFnZTtcbiAgICAgICAgICBzY29wZS5jdXJyZW50UGFnZSA9IE1hdGguZmxvb3IocGFnaW5hdGlvblN0YXRlLnN0YXJ0IC8gcGFnaW5hdGlvblN0YXRlLm51bWJlcikgKyAxO1xuXG4gICAgICAgICAgc3RhcnQgPSBNYXRoLm1heChzdGFydCwgc2NvcGUuY3VycmVudFBhZ2UgLSBNYXRoLmFicyhNYXRoLmZsb29yKHNjb3BlLnN0RGlzcGxheWVkUGFnZXMgLyAyKSkpO1xuICAgICAgICAgIGVuZCA9IHN0YXJ0ICsgc2NvcGUuc3REaXNwbGF5ZWRQYWdlcztcblxuICAgICAgICAgIGlmIChlbmQgPiBwYWdpbmF0aW9uU3RhdGUubnVtYmVyT2ZQYWdlcykge1xuICAgICAgICAgICAgZW5kID0gcGFnaW5hdGlvblN0YXRlLm51bWJlck9mUGFnZXMgKyAxO1xuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLm1heCgxLCBlbmQgLSBzY29wZS5zdERpc3BsYXllZFBhZ2VzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzY29wZS5wYWdlcyA9IFtdO1xuICAgICAgICAgIHNjb3BlLm51bVBhZ2VzID0gcGFnaW5hdGlvblN0YXRlLm51bWJlck9mUGFnZXM7XG5cbiAgICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICBzY29wZS5wYWdlcy5wdXNoKGkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwcmV2UGFnZSE9PXNjb3BlLmN1cnJlbnRQYWdlKSB7XG4gICAgICAgICAgICBzY29wZS5zdFBhZ2VDaGFuZ2Uoe25ld1BhZ2U6IHNjb3BlLmN1cnJlbnRQYWdlfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy90YWJsZSBzdGF0ZSAtLT4gdmlld1xuICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjdHJsLnRhYmxlU3RhdGUoKS5wYWdpbmF0aW9uO1xuICAgICAgICB9LCByZWRyYXcsIHRydWUpO1xuXG4gICAgICAgIC8vc2NvcGUgLS0+IHRhYmxlIHN0YXRlICAoLS0+IHZpZXcpXG4gICAgICAgIHNjb3BlLiR3YXRjaCgnc3RJdGVtc0J5UGFnZScsIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICBpZiAobmV3VmFsdWUgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICBzY29wZS5zZWxlY3RQYWdlKDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2NvcGUuJHdhdGNoKCdzdERpc3BsYXllZFBhZ2VzJywgcmVkcmF3KTtcblxuICAgICAgICAvL3ZpZXcgLT4gdGFibGUgc3RhdGVcbiAgICAgICAgc2NvcGUuc2VsZWN0UGFnZSA9IGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgICAgaWYgKHBhZ2UgPiAwICYmIHBhZ2UgPD0gc2NvcGUubnVtUGFnZXMpIHtcbiAgICAgICAgICAgIGN0cmwuc2xpY2UoKHBhZ2UgLSAxKSAqIHNjb3BlLnN0SXRlbXNCeVBhZ2UsIHNjb3BlLnN0SXRlbXNCeVBhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZighY3RybC50YWJsZVN0YXRlKCkucGFnaW5hdGlvbi5udW1iZXIpe1xuICAgICAgICAgIGN0cmwuc2xpY2UoMCwgc2NvcGUuc3RJdGVtc0J5UGFnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbiIsIm5nLm1vZHVsZSgnc21hcnQtdGFibGUnKVxuICAuZGlyZWN0aXZlKCdzdFBpcGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlcXVpcmU6ICdzdFRhYmxlJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHN0UGlwZTogJz0nXG4gICAgICB9LFxuICAgICAgbGluazoge1xuXG4gICAgICAgIHByZTogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xuICAgICAgICAgIGlmIChuZy5pc0Z1bmN0aW9uKHNjb3BlLnN0UGlwZSkpIHtcbiAgICAgICAgICAgIGN0cmwucHJldmVudFBpcGVPbldhdGNoKCk7XG4gICAgICAgICAgICBjdHJsLnBpcGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzY29wZS5zdFBpcGUoY3RybC50YWJsZVN0YXRlKCksIGN0cmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwb3N0OiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XG4gICAgICAgICAgY3RybC5waXBlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbiIsIn0pKGFuZ3VsYXIpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==