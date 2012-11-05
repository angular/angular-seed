'use strict';

describe('filter', function() {
    var filter, items;

    beforeEach(module('taggedList.filter'));

    beforeEach(inject(function (byTagFilter) {
        filter = byTagFilter;
        items = [
            new Item('item1', []),
            new Item('item2', ['tag1']),
            new Item('item3', ['tag2']),
            new Item('item4', ['tag1', 'tag2']),
            new Item('item5', ['tag3'])
        ];
    }));

    describe('byTag', function() {

        it('should return all items if no tag is selected', function() {
            expect(filter(items, null).length).toBe(5);
        });

        it('should return items that match the selected tag', function() {
            expect(filter(items, 'tag1').length).toBe(2);
            expect(filter(items, 'tag2').length).toBe(2);
            expect(filter(items, 'tag3').length).toBe(1);
        });
    });
});
