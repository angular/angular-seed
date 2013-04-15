'use strict';

/* Column module */

var columnModule = angular.module('SmartTable.Column', []);
columnModule.constant('DefaultColumnConfiguration', {
    isSortable: true,
    map:'',
    label:'',
    sortPredicate:''
});
columnModule.provider('Column', function () {
    var column = function (config) {
        if (!(this instanceof column)) {
            return new column(config);
        }
        angular.extend(this, config);
    };

    this.setDefaultOption = function (option) {
        angular.extend(column.prototype, option);
    };

    column.prototype.getConfigValue = function (configProperty) {
        if (this[configProperty] !== undefined) {
            return this[configProperty];
        }
        throw new Error('config property ' + configProperty + ' does not exist');
    };

    this.$get = ['DefaultColumnConfiguration', function (defaultConfig) {
        this.setDefaultOption(defaultConfig);
        return column;
    }];
});