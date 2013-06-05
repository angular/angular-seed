(function (angular) {
    "use strict";
    angular.module('smartTable.utilities', [])

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
                },

                /**
                 * insert item in arrayRef at index or a the end if index is wrong
                 * @param arrayRef
                 * @param index
                 * @param item
                 */
                insertAt = function (arrayRef, index, item) {
                    if (index >= 0 && index < arrayRef.length) {
                        arrayRef.splice(index, 0, item);
                    } else {
                        arrayRef.push(item);
                    }
                },

                /**
                 * move the item at oldIndex to newIndex in arrayRef
                 * @param arrayRef
                 * @param oldIndex
                 * @param newIndex
                 */
                moveAt = function (arrayRef, oldIndex, newIndex) {
                    var elementToMove;
                    if (oldIndex >= 0 && oldIndex < arrayRef.length && newIndex >= 0 && newIndex < arrayRef.length) {
                        elementToMove = arrayRef.splice(oldIndex, 1)[0];
                        arrayRef.splice(newIndex, 0, elementToMove);
                    }
                },

                /**
                 * sort arrayRef according to sortAlgorithm following predicate and reverse
                 * @param arrayRef
                 * @param sortAlgorithm
                 * @param predicate
                 * @param reverse
                 * @returns {*}
                 */
                sort = function (arrayRef, sortAlgorithm, predicate, reverse) {

                    if (!sortAlgorithm || !angular.isFunction(sortAlgorithm)) {
                        return arrayRef;
                    } else {
                        return sortAlgorithm(arrayRef, predicate, reverse === true);//excpet if reverse is true it will take it as false
                    }
                },

                /**
                 * filter arrayRef according with filterAlgorithm and predicate
                 * @param arrayRef
                 * @param filterAlgorithm
                 * @param predicate
                 * @returns {*}
                 */
                filter = function (arrayRef, filterAlgorithm, predicate) {
                    if (!filterAlgorithm || !angular.isFunction(filterAlgorithm)) {
                        return arrayRef;
                    } else {
                        return filterAlgorithm(arrayRef, predicate);
                    }
                },

                /**
                 * return an array, part of array ref starting at min and the size of length
                 * @param arrayRef
                 * @param min
                 * @param length
                 * @returns {*}
                 */
                fromTo = function (arrayRef, min, length) {

                    var out = [],
                        limit,
                        start;

                    if (!angular.isArray(arrayRef)) {
                        return arrayRef;
                    }

                    start = Math.max(min, 0);
                    start = Math.min(start, (arrayRef.length - 1) > 0 ? arrayRef.length - 1 : 0);

                    length = Math.max(0, length);
                    limit = Math.min(start + length, arrayRef.length);

                    for (var i = start; i < limit; i++) {
                        out.push(arrayRef[i]);
                    }
                    return out;
                };


            return {
                removeAt: removeAt,
                insertAt: insertAt,
                moveAt: moveAt,
                sort: sort,
                filter: filter,
                fromTo: fromTo
            };
        });
})(angular);


