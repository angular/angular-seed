'use strict';

/* jasmine specs for controllers go here */

describe('TaggedListController', function () {
    var scope, taggedListController;

    beforeEach(module('taggedList', 'mocks.services'));

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        taggedListController = $controller('TaggedListController', {$scope:scope});
    }));

    it('should has a list of item', function () {
        expect(scope.items.length).toBe(4);
    });
});