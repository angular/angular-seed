'use strict';

describe('filter', function() {
    var filter, items;

    beforeEach(module('taggedList'));

    beforeEach(inject(function (byTagFilter) {
        filter = byTagFilter;
        items = [
            new Item('item1', false, []),
            new Item('item2', false, ['category1']),
            new Item('item3', false, ['category2']),
            new Item('item4', false, ['category1', 'category2']),
            new Item('item5', false, ['category3'])
        ];
    }));

    describe('byTag', function() {

        it('should return all items if no tag is selected', function() {
            expect(filter(items, null).length).toBe(5);
        });

        it('should return items that match the selected tag', function() {
            expect(filter(items, 'category1').length).toBe(2);
            expect(filter(items, 'category2').length).toBe(2);
            expect(filter(items, 'category3').length).toBe(1);
        });
    });
});
