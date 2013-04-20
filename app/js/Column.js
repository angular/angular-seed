'use strict';

/* Column module */

var smartTableColumnModule = angular.module('SmartTable.Column', []).constant('DefaultColumnConfiguration', {
    isSortable: true,
    map: '',
    label: '',
    sortPredicate: '',
    formatFunction: '',
    formatName: '',
    formatParameter: ''
});


function ColumnProvider(DefaultColumnConfiguration) {

    function Column(config) {
        if (!(this instanceof Column)) {
            return new Column(config);
        }
        angular.extend(this, config);
    }

    this.setDefaultOption = function (option) {
        angular.extend(Column.prototype, option);
    };

    Column.prototype.getConfigValue = function (configProperty) {
        if (this[configProperty] !== undefined) {
            return this[configProperty];
        }
        throw new Error('config property ' + configProperty + ' does not exist');
    };


    this.setDefaultOption(DefaultColumnConfiguration);


    this.$get = function () {
        return Column;
    };
}

ColumnProvider.$inject = ['DefaultColumnConfiguration'];
smartTableColumnModule.provider('Column', ColumnProvider);

