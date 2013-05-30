describe('utilityModule Module', function () {

    var array;

    beforeEach(module('smartTable.utilities', function () {

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

        describe('sort array', function () {
            var
                predicate,
                reverse;

            beforeEach(function () {
                predicate = '';
                reverse = '';
                array = [
                    {id: 0, name: 'laurent'},
                    {id: 2, name: 'blandine'},
                    {id: 1, name: 'francoise'}
                ];
            });


            it('should return the array as it was if now algorithm is provided', inject(function (ArrayUtility) {
                expect(ArrayUtility.sort(array, 'whaterver', predicate, reverse)).toEqual(array);
            }));

            it('should sort array with provided algorithm', inject(function ($filter, ArrayUtility) {
                expect(ArrayUtility.sort(array, $filter('orderBy'), predicate, reverse)).toEqual($filter('orderBy')(array, predicate, false));
                expect(ArrayUtility.sort(array), $filter('orderBy'), predicate, reverse).toEqual(array); //(no predicate has been provided

                predicate = 'id';
                expect(ArrayUtility.sort(array, $filter('orderBy'), predicate, reverse)).toEqual($filter('orderBy')(array, 'id', false));
                expect(ArrayUtility.sort(array, $filter('orderBy'), predicate, reverse)).toEqual([
                    {id: 0, name: 'laurent'},
                    {id: 1, name: 'francoise'},
                    {id: 2, name: 'blandine'}
                ]);

                var sortMock = {
                    sortAlgo: function (array, predicate, reverse) {
                        return array;
                    }
                };
                predicate = 'id';
                reverse = true;
                spyOn(sortMock, 'sortAlgo');
                ArrayUtility.sort(array, sortMock.sortAlgo, predicate, reverse);
                expect(sortMock.sortAlgo).toHaveBeenCalledWith(array, 'id', true);

            }));

            it('should sort with reverse =true only if it is explicit set', inject(function ($filter, ArrayUtility) {
                predicate = 'id';
                expect(ArrayUtility.sort(array, $filter('orderBy'), predicate, reverse)).toEqual($filter('orderBy')(array, 'id', false));
                expect(ArrayUtility.sort(array, $filter('orderBy'), predicate, reverse)).toEqual([
                    {id: 0, name: 'laurent'},
                    {id: 1, name: 'francoise'},
                    {id: 2, name: 'blandine'}
                ]);
                reverse = 'whatever';
                expect(ArrayUtility.sort(array, $filter('orderBy'), predicate, reverse)).toEqual($filter('orderBy')(array, 'id', false));
                expect(ArrayUtility.sort(array, $filter('orderBy'), predicate, reverse)).toEqual([
                    {id: 0, name: 'laurent'},
                    {id: 1, name: 'francoise'},
                    {id: 2, name: 'blandine'}
                ]);
                reverse = true;
                expect(ArrayUtility.sort(array, $filter('orderBy'), predicate, reverse)).toEqual($filter('orderBy')(array, 'id', true));
                expect(ArrayUtility.sort(array, $filter('orderBy'), predicate, reverse)).toEqual([
                    {id: 2, name: 'blandine'},
                    {id: 1, name: 'francoise'},
                    {id: 0, name: 'laurent'}
                ]);
            }));
        });
        describe('filter utility', function () {
            var predicate;
            beforeEach(function () {
                predicate = '';
                array = [
                    {id: 0, name: 'laurent'},
                    {id: 2, name: 'blandine'},
                    {id: 1, name: 'francoise'}
                ];
            });

            it('should use provided algorithm or return input array', inject(function ($filter, ArrayUtility) {
                expect(ArrayUtility.filter(array, 'whatever', predicate)).toEqual(array);
                var filterMock = {
                    filterAlgo: function (array, predicate) {
                        return [array[0]];
                    }
                };
                spyOn(filterMock, 'filterAlgo').andCallThrough();
                predicate = 'whatever';
                var returnedArray = ArrayUtility.filter(array, filterMock.filterAlgo, predicate);
                expect(filterMock.filterAlgo).toHaveBeenCalledWith(array, 'whatever');
                expect(returnedArray.length).toBe(1);
                expect(returnedArray).toEqual([
                    {id: 0, name: 'laurent'}
                ]);
            }));
        });

        describe('from/To', function () {
            beforeEach(function () {
                array = [
                    {id: 0},
                    {id: 1},
                    {id: 2},
                    {id: 3},
                    {id: 4}
                ];
            });

            it('should return a part of the array', inject(function (ArrayUtility) {
                var part = ArrayUtility.fromTo(array, 1, 3);
                expect(part.length).toBe(3);
                expect(part[0].id).toBe(1);
                expect(part[1].id).toBe(2);
                expect(part[2].id).toBe(3);

                part = ArrayUtility.fromTo(array, 3, 4);
                expect(part.length).toBe(2);
                expect(part[0].id).toBe(3);
                expect(part[1].id).toBe(4);

                part = ArrayUtility.fromTo(array, -2, 2);
                expect(part.length).toBe(2);
                expect(part[0].id).toBe(0);
                expect(part[1].id).toBe(1);

                part = ArrayUtility.fromTo(array, 1, -1);
                expect(part.length).toBe(0);
            }));
        });

    });
});