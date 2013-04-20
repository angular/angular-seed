'use strict';

/* Filters */

angular.module('SmartTable.filters', []).
    constant('DefaultFilters', ['currency', 'date', 'json', 'lowercase', 'number', 'uppercase']).
    filter('format', ['$filter', 'DefaultFilters', function (filter, defaultfilters) {
        return function (value, formatFunction, filterName, filterParameter) {

            var returnFunction;

            if (formatFunction && angular.isFunction(formatFunction)) {
                returnFunction = formatFunction;
            } else {
                returnFunction = defaultfilters.indexOf(filterName) !== -1 ? filter(filterName) : function (value) {
                    return value
                };
            }
            return returnFunction(value, filterParameter);
        }
    }]);
