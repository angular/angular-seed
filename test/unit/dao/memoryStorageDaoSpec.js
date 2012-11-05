'use strict';

/* jasmine specs for controllers go here */

describe('MemoryStorageDao', function () {
    describe('ItemDao', function() {

    	var itemDao;
		
		beforeEach(module('taggedList.dao'));

		beforeEach(inject(function (_itemDao_) {
        	itemDao = _itemDao_;
    	}));

		it('should query with no item at first', function() {
			var items = itemDao.query();
			expect(items.length).toBe(0);
		});

		it('should query the same elements when called multiple times', function() {
			var items1 = itemDao.query();
			var items2 = itemDao.query();
			expect(items1.length).toBe(0);
			expect(items2.length).toBe(0);
			expect(items1).toEqual(items2);
		});

		it('should add an item when saving a new item', function(){
			itemDao.save(new Item('new item'));
			expect(itemDao.query().length).toBe(1);
		});

		it('should update an item when saving an existing item', function() {
			itemDao.save(new Item('new item'));
			var items = itemDao.query();
			var item = items[0];
			item.text = 'updated item';
			itemDao.save(item);
			expect(itemDao.query().length).toBe(1);
		});

		it('should remove an item', function() {
			itemDao.save(new Item('new item'));
			var items = itemDao.query();
			itemDao.remove(items[0]);
			expect(itemDao.query().length).toBe(0);
		});
    });
});