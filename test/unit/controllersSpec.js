'use strict';

/* jasmine specs for controllers go here */

describe('TaggedListController', function () {
    var scope, taggedListController;

    beforeEach(module('taggedList', 'mocks.services'));

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        taggedListController = $controller('TaggedListController', {$scope:scope});
    }));

    it('should save the added item', function() {
        expect(scope.items.length).toBe(0);

        addItem('new item');        
        expect(scope.items.length).toBe(1);
        expect(scope.items[0].text === 'new item');
        expect(scope.newItem).toBe('');
    });

    it('should not add empty item', function() {
        expect(scope.items.length).toBe(0);

        addItem(null);        
        expect(scope.items.length).toBe(0);

        addItem('');        
        expect(scope.items.length).toBe(0);

        addItem('  ');        
        expect(scope.items.length).toBe(0);
    });

    it('should remove item', function() {
        expect(scope.items.length).toBe(0);

        addItem('new item');
        
        scope.removeItem(scope.items[0]);

        expect(scope.items.length).toBe(0);
    });

    it('should create tag with #', function() {
        addItem('new item #tag1');
                
        expect(scope.items[0].text).toBe('new item');
        expect(scope.items[0].tags.length).toBe(1);
        expect(scope.items[0].tags[0]).toBe('tag1');
    });

    it('should create tag with all # element', function() {
        addItem('new item #tag1 #tag2');
        
        expect(scope.items[0].text).toBe('new item');
        expect(scope.items[0].tags.length).toBe(2);
        expect(scope.items[0].tags[0]).toBe('tag1'); 
        expect(scope.items[0].tags[1]).toBe('tag2'); 
    });

    it('should not create multiple tag with the same name', function() {
        addItem('new item #tag1 #tag1');
        
        expect(scope.items[0].text).toBe('new item');
        expect(scope.items[0].tags.length).toBe(1);
        expect(scope.items[0].tags[0]).toBe('tag1');
    });

    it('should create a global tag for newly created tag in item', function() {
        expect(scope.tags.length).toBe(0);
        
        addItem('new item #tag1');
        expect(scope.tags.length).toBe(1);
        expect(scope.tags[0]).toBe('tag1');
    });

    it('should create a global tag for every newly created tag in item', function(){
        addItem('newly item #tag1');
        addItem('other item #tag2');

        expect(scope.tags.length).toBe(2);
        expect(scope.tags[0]).toBe('tag1');
        expect(scope.tags[1]).toBe('tag2');
    });

    it('should not create multiple global tag with the same name', function(){
        addItem('newly item #tag1');
        addItem('other item #tag1');

        expect(scope.tags.length).toBe(1);
        expect(scope.tags[0]).toBe('tag1');        
    });

    it('should list the items by tag', function(){

    });

    it('should list the items for all tags', function(){
    });

    it('should order the item by tag', function(){
    });

    it('', function(){
    });

    function addItem(text) {
        scope.newItem = text;
        scope.addItem();
    }
});