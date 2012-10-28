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

        scope.newItem = 'new item';
        scope.addItem();
        expect(scope.items.length).toBe(1);
        expect(scope.newItem).toBe('');
    });

    it('should not add empty item', function() {
        expect(scope.items.length).toBe(0);

        scope.newItem = null;
        scope.addItem();
        expect(scope.items.length).toBe(0);

        scope.newItem = '';
        scope.addItem();
        expect(scope.items.length).toBe(0);

        scope.newItem = '  ';
        scope.addItem();
        expect(scope.items.length).toBe(0);
    });
});