'use strict';

angular.module('SmartTable.Utilities', [])

    .factory('ArrayUtility', function () {

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

