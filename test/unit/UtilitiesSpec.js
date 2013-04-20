'use strict';


describe('utilityModule Module', function () {

    var array,
        selectionMode,
        selectFactory;

    beforeEach(module('SmartTable.Utilities', function () {

    }));


    describe('Array utilities', function () {

        beforeEach(function () {
            array = [
                {id: 0},
                {id: 1},
                {id: 2}
            ];
        });

        it('should add item at proper index or put it at the end', inject(function (ArrayUtility) {

            var toInsert = {};
            //insert at index
            ArrayUtility.insertAt(array, 1, toInsert);
            expect(array.length).toBe(4);
            expect(array[1]).toBe(toInsert);

            //at the end
            ArrayUtility.insertAt(array, -4, toInsert);
            expect(array.length).toBe(5);
            expect(array[4]).toBe(toInsert);

            ArrayUtility.insertAt(array, 666, toInsert);
            expect(array.length).toBe(6);
            expect(array[5]).toBe(toInsert);

            ArrayUtility.insertAt(array, 'sfdsf', toInsert);
            expect(array.length).toBe(7);
            expect(array[6]).toBe(toInsert);
        }));

        it('should remove item at proper index or do nothing', inject(function (ArrayUtility) {

            var removedElement = ArrayUtility.removeAt(array, 1);
            expect(array.length).toBe(2);
            expect(removedElement).toEqual({id: 1});

            ArrayUtility.removeAt(array, -1);
            expect(array.length).toBe(2);

            ArrayUtility.removeAt(array, 666);
            expect(array.length).toBe(2);

            ArrayUtility.removeAt(array, '2323');
            expect(array.length).toBe(2);
        }));


        it('should move an item from a lower index to an higher one', inject(function (ArrayUtility) {
            ArrayUtility.moveAt(array, 0, 2);
            expect(array.length).toBe(3);
            expect(array[0].id).toBe(1);
            expect(array[2].id).toBe(0);
        }));
        it('should move an item from a higher index to an lower one', inject(function (ArrayUtility) {
            ArrayUtility.moveAt(array, 2, 1);
            expect(array.length).toBe(3);
            expect(array[1].id).toBe(2);
            expect(array[2].id).toBe(1);
        }));

        it('should not move any item', inject(function (ArrayUtility) {
            ArrayUtility.moveAt(array, -1, 2);
            expect(array).toEqual([
                {id: 0},
                {id: 1},
                {id: 2}
            ]);
            ArrayUtility.moveAt(array, 1, 666);
            expect(array).toEqual([
                {id: 0},
                {id: 1},
                {id: 2}
            ]);
        }));

    });
});