/*table module */

//TODO be able to register function on remove/add column and rows or use the scope to emit the events

angular.module('SmartTable.Table', ['SmartTable.Column', 'SmartTable.Utilities', 'SmartTable.directives', 'SmartTable.filters'])
    .constant('DefaultTableConfiguration', {
        selectionMode: 'multiple',
        isGlobalSearchActivated: true,
        displaySelectionCheckbox: true,

        //just to remind available option
        sortAlgorithm: '',
        filterAlgorithm: ''
    })
    .controller('TableCtrl', ['$scope', 'Column', '$filter', 'DefaultTableConfiguration', 'ArrayUtility', function (scope, Column, filter, defaultConfig, arrayUtility) {

        angular.extend(scope, defaultConfig);

        scope.columns = [];
        scope.dataCollection = scope.dataCollection || [];
        scope.displayedCollection = scope.dataCollection;

        var
            filterAlgorithm,
            sortAlgorithm,
            predicate = {},
            lastColumnSort;

        /**
         * set column as the column used to sort the data (if it is already the case, it will change the reverse value)
         * @method sortBy
         * @param column
         */
        this.sortBy = function (column) {
            var index = scope.columns.indexOf(column);
            if (index !== -1) {
                if (column.isSortable === true) {
                    // reset the last column used
                    if (lastColumnSort && lastColumnSort !== column) {
                        lastColumnSort.reverse = false;
                    }

                    column.sortPredicate = column.sortPredicate || column.map;
                    column.reverse = column.reverse !== true;
                    lastColumnSort = column;
                }
            }

            scope.displayedCollection = pipe(scope.dataCollection);
        };

        /**
         * sort an array according to the current column configuration (predicate, reverese)
         * @param array
         * @param column
         * @returns {*}
         */
        function sortDataRow(array, column) {
            var sortAlgo = (sortAlgorithm && angular.isFunction(sortAlgorithm)) === true ? sortAlgorithm : filter('orderBy');
            if (column) {
                return arrayUtility.sort(array, sortAlgo, column.sortPredicate, column.reverse);
            } else {
                return array;
            }
        }

        /**
         * set the filter predicate used for searching
         * @param input
         * @param column
         */
        this.search = function (input, column) {

            //update column and global predicate
            if (column && scope.columns.indexOf(column) !== -1) {
                predicate.$ = '';
                column.filterPredicate = input;
            } else {
                for (var j = 0, l = scope.columns.length; j < l; j++) {
                    scope.columns[j].filterPredicate = '';
                }
                predicate.$ = input;
            }

            for (var j = 0, l = scope.columns.length; j < l; j++) {
                predicate[scope.columns[j].map] = scope.columns[j].filterPredicate;
            }

            scope.displayedCollection = pipe(scope.dataCollection);

        };

        /**
         * combine sort and search operation
         * @param array
         * @returns {*}
         */
        function pipe(array) {
            var filterAlgo = (filterAlgorithm && angular.isFunction(filterAlgorithm)) === true ? filterAlgorithm : filter('filter');
            //filter and sort are commutative
            return sortDataRow(arrayUtility.filter(array, filterAlgo, predicate), lastColumnSort);
        }

        //TODO check if it would be better not to 'pollute' the dataModel itself and use a wrapper/decorator for all the stuff related to the table features like we do for column (then we could emit event)
        /**
         * 'select'/'unselect' an entry in an array by setting isSelected on the datarow Model. Select one/multiple rows depending on the selectionMode
         * @param array the data array where we can select/unselect values
         * @param selectionMode 'single', 'multiple' or equivalent to 'none'
         * @param index of the item to select in the array
         * @param select true if select, false if unselect
         */
        function selectDataRow(array, selectionMode, index, select) {

            var dataRow;

            if ((!angular.isArray(array)) || (selectionMode !== 'multiple' && selectionMode !== 'single')) {
                return;
            }

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
            arrayUtility.insertAt(scope.columns, index, column);
        };

        /**
         * remove the column at columnIndex from scope.columns
         * @param columnIndex index of the column to be removed
         */
        this.removeColumn = function (columnIndex) {
            arrayUtility.removeAt(scope.columns, columnIndex);
        };

        /**
         * move column located at oldIndex to the newIndex in scope.columns
         * @param oldIndex index of the column before it is moved
         * @param newIndex index of the column after the column is moved
         */
        this.moveColumn = function (oldIndex, newIndex) {
            arrayUtility.moveAt(scope.columns, oldIndex, newIndex);
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
         * select/unselect all the currently displayed raw
         * @param value if true select, else unselect
         */
        this.toggleSelectionAll = function (value) {
            var i = 0,
                l = scope.displayedCollection.length;

            if (scope.selectionMode !== 'multiple') {
                return;
            }
            for (; i < l; i++) {
                selectDataRow(scope.displayedCollection, scope.selectionMode, i, value === true);
            }
        };

        /**
         * remove the item at index rowIndex from the displayed collection
         * @param rowIndex
         * @returns {*} item just removed or undefined
         */
        this.removeDataRow = function (rowIndex) {
            var toRemove = arrayUtility.removeAt(scope.displayedCollection, rowIndex);
            arrayUtility.removeAt(scope.dataCollection, scope.dataCollection.indexOf(toRemove));
        };

        /**
         * move an item from oldIndex to newIndex in displayedCollection
         * @param oldIndex
         * @param newIndex
         */
        this.moveDataRow = function (oldIndex, newIndex) {
            arrayUtility.moveAt(scope.displayedCollection, oldIndex, newIndex);
        };
    }]);










