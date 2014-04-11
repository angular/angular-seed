/*table module */

(function (angular) {
    "use strict";
    angular.module('smartTable.table', ['smartTable.column', 'smartTable.utilities', 'smartTable.directives', 'smartTable.filters', 'ui.bootstrap.pagination.smartTable'])
        .constant('DefaultTableConfiguration', {
            selectionMode: 'none',
            isGlobalSearchActivated: false,
            displaySelectionCheckbox: false,
            isPaginationEnabled: true,
            itemsByPage: 10,
            maxSize: 5,

            //just to remind available option
            sortAlgorithm: '',
            filterAlgorithm: ''
        })
        .controller('TableCtrl', ['$scope', 'Column', '$filter', '$parse', 'ArrayUtility', 'DefaultTableConfiguration', function (scope, Column, filter, parse, arrayUtility, defaultConfig) {

            scope.columns = [];
            scope.dataCollection = scope.dataCollection || [];
            scope.displayedCollection = []; //init empty array so that if pagination is enabled, it does not spoil performances
            scope.numberOfPages = calculateNumberOfPages(scope.dataCollection);
            scope.currentPage = 1;
            scope.holder = {isAllSelected: false};

            var predicate = {},
                lastColumnSort;

            function isAllSelected() {
                var i,
                    l = scope.displayedCollection.length;
                for (i = 0; i < l; i++) {
                    if (scope.displayedCollection[i].isSelected !== true) {
                        return false;
                    }
                }
                return true;
            }

            function calculateNumberOfPages(array) {

                if (!angular.isArray(array) || array.length === 0 || scope.itemsByPage < 1) {
                    return 1;
                }
                return Math.ceil(array.length / scope.itemsByPage);
            }

            function sortDataRow(array, column) {
                var sortAlgo = (scope.sortAlgorithm && angular.isFunction(scope.sortAlgorithm)) === true ? scope.sortAlgorithm : filter('orderBy');
                if (column && !(column.reverse === undefined)) {
                    return arrayUtility.sort(array, sortAlgo, column.sortPredicate, column.reverse);
                } else {
                    return array;
                }
            }

            function selectDataRow(array, selectionMode, index, select) {

                var dataRow, oldValue;

                if ((!angular.isArray(array)) || (selectionMode !== 'multiple' && selectionMode !== 'single')) {
                    return;
                }

                if (index >= 0 && index < array.length) {
                    dataRow = array[index];
                    if (selectionMode === 'single') {
                        //unselect all the others
                        for (var i = 0, l = array.length; i < l; i++) {
                            oldValue = array[i].isSelected;
                            array[i].isSelected = false;
                            if (oldValue === true) {
                                scope.$emit('selectionChange', {item: array[i]});
                            }
                        }
                    }
                    dataRow.isSelected = select;
                    scope.holder.isAllSelected = isAllSelected();
                    scope.$emit('selectionChange', {item: dataRow});
                }
            }

            /**
             * set the config (config parameters will be available through scope
             * @param config
             */
            this.setGlobalConfig = function (config) {
                angular.extend(scope, defaultConfig, config);
            };

            /**
             * change the current page displayed
             * @param page
             */
            this.changePage = function (page) {
                var oldPage = scope.currentPage;
                if (angular.isNumber(page.page)) {
                    scope.currentPage = page.page;
                    scope.displayedCollection = this.pipe(scope.dataCollection);
                    scope.holder.isAllSelected = isAllSelected();
                    scope.$emit('changePage', {oldValue: oldPage, newValue: scope.currentPage});
                }
            };

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
                            lastColumnSort.reverse = undefined;
                        }
                        column.sortPredicate = column.sortPredicate || column.map;

                        if (column.reverse === undefined) {
                            column.reverse = false;
                        }
                        else if (column.reverse === false) {
                            column.reverse = true;
                        }
                        else {
                            column.reverse = undefined;
                        }

                        lastColumnSort = column;
                    }
                }

                scope.displayedCollection = this.pipe(scope.dataCollection);
            };

            /**
             * set the filter predicate used for searching
             * @param input
             * @param column
             */
            this.search = function (input, column) {

                //update column and global predicate
                if (column && scope.columns.indexOf(column) !== -1) {
                    predicate[column.map] = input;
                } else {
                    predicate = {$: input};
                }
                scope.displayedCollection = this.pipe(scope.dataCollection);
            };

            /**
             * combine sort, search and limitTo operations on an array,
             * @param array
             * @returns Array, an array result of the operations on input array
             */
            this.pipe = function (array) {
                var filterAlgo = (scope.filterAlgorithm && angular.isFunction(scope.filterAlgorithm)) === true ? scope.filterAlgorithm : filter('filter'),
                    output;
                //filter and sort are commutative
                output = sortDataRow(arrayUtility.filter(array, filterAlgo, predicate), lastColumnSort);
                scope.numberOfPages = calculateNumberOfPages(output);
                return scope.isPaginationEnabled ? arrayUtility.fromTo(output, (scope.currentPage - 1) * scope.itemsByPage, scope.itemsByPage) : output;
            };

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

            /**
             * remove all columns
             */
            this.clearColumns = function () {
                scope.columns.length = 0;
            };

            /*///////////
             ROW API
             */

            /**
             * select or unselect the item of the displayedCollection with the selection mode set in the scope
             * @param dataRow
             */
            this.toggleSelection = function (dataRow) {
                var index = scope.dataCollection.indexOf(dataRow);
                if (index !== -1) {
                    selectDataRow(scope.dataCollection, scope.selectionMode, index, dataRow.isSelected !== true);
                }
            };

            /**
             * select/unselect all the currently displayed rows
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

            /**
             * update the model, it can be a non existing yet property
             * @param dataRow the dataRow to update
             * @param propertyName the property on the dataRow ojbect to update
             * @param newValue the value to set
             */
            this.updateDataRow = function (dataRow, propertyName, newValue) {
                var index = scope.displayedCollection.indexOf(dataRow),
                    getter = parse(propertyName),
                    setter = getter.assign,
                    oldValue;
                if (index !== -1) {
                    oldValue = getter(scope.displayedCollection[index]);
                    if (oldValue !== newValue) {
                        setter(scope.displayedCollection[index], newValue);
                        scope.$emit('updateDataRow', {item: scope.displayedCollection[index]});
                    }
                }
            };
        }]);
})(angular);


