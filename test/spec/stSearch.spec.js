describe('stSearch Directive', function () {

    var controllerMock = {
        search: angular.noop
    };

    var rootScope;
    var scope;
    var element;


    beforeEach(module('smart-table', function ($controllerProvider) {
        $controllerProvider.register('stTableController', function () {
            return controllerMock;
        });
    }));

    beforeEach(inject(function ($compile, $rootScope) {

        rootScope = $rootScope;
        scope = $rootScope.$new();
        scope.rowCollection = [];

        var template = '<table st-table="rowCollection">' +
            '<thead>' +
            '<tr><th><input type="text" st-search="name" /></th>' +
            '<th><input type="text" st-search="" /></th>' +
            '<th>age</th>' +
            '</tr>' +
            '</table>';

        element = $compile(template)(scope);
    }));

    it('should call the controller with the predicate', function () {
        spyOn(controllerMock, 'search').andCallThrough();
        var ths = element.find('th');

        var input = angular.element(ths[0].children[0]);
        input[0].value = 'blah';
        input.triggerHandler('input');
        expect(controllerMock.search).toHaveBeenCalledWith('blah', 'name');
    });

    it('should call the controller with falsy value', function () {
        spyOn(controllerMock, 'search').andCallThrough();
        var ths = element.find('th');

        var input = angular.element(ths[1].children[0]);
        input[0].value = 'blah';
        input.triggerHandler('input');
        expect(controllerMock.search.calls[0].args[0]).toEqual('blah');
        expect(!controllerMock.search.calls[0].args[1]).toBe(true);
    });
});
