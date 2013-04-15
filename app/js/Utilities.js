'use strict';

var utilityModule = angular.module('SmartTable.Utilities', []);

utilityModule.factory('SelectUtility', ['$filter', function (filter) {
    /**
     * 'select'/'unselect' a entry in an array by setting isSelected on the datarow Model (TODO check if it would be better not to 'pollute' the dataModel itself
     * and use a wrapper/decorator for all the stuff related to the table features). Select one/multiple rows depending on the selectionMode
     * @param array the data array where we can select/unselect values
     * @param selectionMode 'single', 'multiple' or equivalent to 'none'
     * @param index of the item to select in the array
     * @param select true if select, false if unselect
     */
    var selectDataRow = function (array, selectionMode, index, select) {

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
    };
    return selectDataRow;
}]);

//a set of function to peform on arrays
utilityModule.factory('ArrayUtility', function () {

    /**
     * remove the item at index from arrayRef and return the removed item
     * @param arrayRef
     * @param index
     * @returns {*}
     */
    var removeAt = function (arrayRef, index) {
        if (index >= 0 && index < arrayRef.length) {
            return arrayRef.splice(index, 1)[0];
        }
    };

    /**
     * insert item in arrayRef at index or a the end if index is wrong
     * @param arrayRef
     * @param index
     * @param item
     */
    var insertAt = function (arrayRef, index, item) {
        if (index >= 0 && index < arrayRef.length) {
            arrayRef.splice(index, 0, item);
        } else {
            arrayRef.push(item);
        }
    };

    /**
     * move the item at oldIndex to newIndex in arrayRef
     * @param arrayRef
     * @param oldIndex
     * @param newIndex
     */
    var moveAt = function (arrayRef, oldIndex, newIndex) {
        var elementToMove;
        if (oldIndex >= 0 && oldIndex < arrayRef.length && newIndex >= 0 && newIndex < arrayRef.length) {
            elementToMove = arrayRef.splice(oldIndex, 1)[0];
            arrayRef.splice(newIndex, 0, elementToMove);
        }
    };

    return {
        removeAt: removeAt,
        insertAt: insertAt,
        moveAt: moveAt
    };
});

