/* Filters */
(function (angular) {
    "use strict";
    angular.module('smartTable.filters', []).
        constant('DefaultFilters', ['currency', 'date', 'json', 'lowercase', 'number', 'uppercase']).
        filter('format', ['$filter', 'DefaultFilters', function (filter, defaultfilters) {
            return function (value, formatFunction, filterParameter) {

                var returnFunction;

                if (formatFunction && angular.isFunction(formatFunction)) {
                    returnFunction = formatFunction;
                } else {
                    returnFunction = defaultfilters.indexOf(formatFunction) !== -1 ? filter(formatFunction) : function (value) {
                        return value;
                    };
                }
                return returnFunction(value, filterParameter);
            };
        }]);
})(angular);

