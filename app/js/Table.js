'use strict';

/*table module */

//TODO be able to register function on remove/add column and rows or use the scope to emit the events

angular.module('SmartTable.Table', ['SmartTable.Column', 'SmartTable.Utilities', 'SmartTable.directives', 'SmartTable.filters'])
    .constant('DefaultTableConfiguration', {
        selectionMode: 'single',
        tableTitle: '',
        dataCollection: '',
        columns: '',
        sortFunction: ''
    })
    .controller('TableCtrl', ['$scope', 'Column', '$filter', 'DefaultTableConfiguration', 'ArrayUtility', function (scope, Column, filter, defaultConfig, array) {

        //set default value
        angular.extend(scope, defaultConfig);


        scope.columns = [];
        scope.dataCollection = [];
        scope.displayedCollection = scope.dataCollection;
        scope.tableTitle = '';

        var sortFunction;


        /**
         * 'select'/'unselect' a entry in an array by setting isSelected on the datarow Model (TODO check if it would be better not to 'pollute' the dataModel itself
         * and use a wrapper/decorator for all the stuff related to the table features). Select one/multiple rows depending on the selectionMode
         * @param array the data array where we can select/unselect values
         * @param selectionMode 'single', 'multiple' or equivalent to 'none'
         * @param index of the item to select in the array
         * @param select true if select, false if unselect
         */
        function selectDataRow(array, selectionMode, index, select) {

            if ((!angular.isArray(array)) || (selectionMode !== 'multiple' && selectionMode !== 'single')) {
                return;
            }

            var dataRow;

            if (index >= 0 && index < array.length) {
                dataRow = array[index];
                if (selectionMode === 'single') {
                    //unselect all the others
                    for (var i = 0, l = array.length; i < l; i++) {
                        array[i].isSelected = false;
                    }
                    dataRow.isSelected = select;
                } else if (selectionMode === 'multiple') {
                    dataRow.isSelected = select;
                }
            }
        }


        /*////////////
         Column API
         ///////////*/


        /**
         * insert a new column in scope.collection at index or push at the end if no index
         * @param columnConfig column configuration used to instantiate the new Column
         * @param index where to insert the column (at the end if not specified)
         */
        this.insertColumn = function (columnConfig, index) {
            var column = new Column(columnConfig);
            array.insertAt(scope.columns, index, column);
        };

        /**
         * remove the column at columnIndex from scope.columns
         * @param columnIndex index of the column to be removed
         */
        this.removeColumn = function (columnIndex) {
            array.removeAt(scope.columns, columnIndex);
        };

        /**
         * move column located at oldIndex to the newIndex in scope.columns
         * @param oldIndex index of the column before it is moved
         * @param newIndex index of the column after the column is moved
         */
        this.moveColumn = function (oldIndex, newIndex) {
            array.moveAt(scope.columns, oldIndex, newIndex);
        };

        /**
         * set column as the column used to sort the data (if it is already the case, it will change the reverse value)
         * @param column
         */
        this.sortBy = function (column) {
            var index = scope.columns.indexOf(column);
            if (index !== -1) {
                if (column.isSortable === true) {
                    column.sortPredicate = column.sortPredicate || column.map;
                    column.reverse = column.reverse !== true;
                    //if custom sorting function
                    if (sortFunction) {
                        scope.displayedCollection = sortFunction(scope.displayedCollection, column.sortPredicate, column.reverse);
                    } else {
                        scope.displayedCollection = filter('orderBy')(scope.displayedCollection, column.sortPredicate, column.reverse);
                    }
                }
            }
        };

        /*///////////
         ROW API
         *///////////

        /**
         * select or unselect the item of the displayedCollection with the selection mode set in the scope
         * @param dataRow
         */
        this.toggleSelection = function (dataRow) {
            var index = scope.displayedCollection.indexOf(dataRow);
            if (index !== -1) {
                selectDataRow(scope.displayedCollection, scope.selectionMode, index, dataRow.isSelected !== true);
            }
        };

        /**
         * remove the item at index rowIndex from the displayed collection
         * @param rowIndex
         * @returns {*} item just removed or undefined
         */
        this.removeDataRow = function (rowIndex) {
            array.removeAt(scope.displayedCollection, rowIndex);
        };

        /**
         * move an item from oldIndex to newIndex in displayedCollection
         * @param oldIndex
         * @param newIndex
         */
        this.moveDataRow = function (oldIndex, newIndex) {
            array.moveAt(scope.displayedCollection, oldIndex, newIndex);
        };
    }]);










