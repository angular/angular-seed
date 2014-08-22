describe('stSearch Directive', function () {

    var controllerMock = {
        search: angular.noop,
        tableState: function () {
            return tableState;
        }
    };

    var rootScope;
    var scope;
    var element;
    var tableState = {
        search: {},
        sort: {},
        pagination: {sort: 0}
    };


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
            '<tr><th><input type="text" st-search="\'name\'" /></th>' +
            '<th><input type="text" st-search="" /></th>' +
            '<th>age</th>' +
            '</tr>' +
            '</table>';

        element = $compile(template)(scope);
    }));

    describe('string predicate', function () {
        it('should call the controller with the predicate', inject(function ($timeout) {
            spyOn(controllerMock, 'search').andCallThrough();
            var ths = element.find('th');

            var input = angular.element(ths[0].children[0]);
            input[0].value = 'blah';
            input.triggerHandler('input');
            expect(controllerMock.search).not.toHaveBeenCalled();
            $timeout.flush();
            expect(controllerMock.search).toHaveBeenCalledWith('blah', 'name');
        }));

        it('should call the controller with falsy value', inject(function ($timeout) {
            spyOn(controllerMock, 'search').andCallThrough();
            var ths = element.find('th');

            var input = angular.element(ths[1].children[0]);
            input[0].value = 'blah';
            input.triggerHandler('input');
            expect(controllerMock.search).not.toHaveBeenCalled();
            $timeout.flush();
            expect(controllerMock.search.calls[0].args[0]).toEqual('blah');
            expect(!controllerMock.search.calls[0].args[1]).toBe(true);
        }));
    });

    it('should support binding on search predicate', inject(function ($compile, $timeout) {
        scope.searchPredicate = 'name';
        var template = '<table st-table="rowCollection">' +
            '<thead>' +
            '<tr><th><input type="text" st-search="searchPredicate" /></th>' +
            '<th><input type="text" st-search="" /></th>' +
            '<th>age</th>' +
            '</tr>' +
            '</table>';

        element = $compile(template)(scope);
        spyOn(controllerMock, 'search').andCallThrough();
        var ths = element.find('th');

        var input = angular.element(ths[0].children[0]);
        input[0].value = 'blah';
        input.triggerHandler('input');
        expect(controllerMock.search).not.toHaveBeenCalled();
        $timeout.flush();
        expect(controllerMock.search).toHaveBeenCalledWith('blah', 'name');


        scope.searchPredicate = 'lastname';
        scope.$apply();
        expect(controllerMock.search).toHaveBeenCalledWith('blah', 'lastname');

        input[0].value = 'another blah';
        input.triggerHandler('input');
        $timeout.flush();
        expect(controllerMock.search).toHaveBeenCalledWith('another blah', 'lastname');

    }));
});
