describe('stSort Directive', function () {

    var tableState;
    var controllerMock = {
        sortBy: function (predicate, reverse) {
            tableState.sort = {
                predicate: predicate,
                reverse: reverse === true
            }
        },
        tableState: function () {
            return tableState;
        },
        pipe: angular.noop
    };

    var rootScope;
    var scope;
    var element;

    function hasClass(element, classname) {
        return Array.prototype.indexOf.call(element.classList, classname) !== -1
    }

    beforeEach(module('smart-table', function ($controllerProvider) {
        $controllerProvider.register('stTableController', function () {
            return controllerMock;
        });
    }));

    beforeEach(inject(function ($compile, $rootScope) {

        tableState = {
            search: {},
            sort: {},
            pagination: {}
        };
        rootScope = $rootScope;
        scope = $rootScope.$new();
        scope.rowCollection = [];
        scope.getters = {
            age: function (row) {
                return 7;
            }
        };

        var template = '<table st-table="rowCollection">' +
            '<thead>' +
            '<tr><th st-sort="name">firstname</th>' +
            '<th st-sort="lastname">lastname</th>' +
            '<th st-sort="getters.age">age</th>' +
            '</tr>' +
            '</table>';

        element = $compile(template)(scope);
    }));

    it('should pass the predicate to the sortBy function', function () {
        spyOn(controllerMock, 'sortBy').andCallThrough();
        var ths = element.find('th');
        angular.element(ths[0]).triggerHandler('click');
        expect(controllerMock.sortBy).toHaveBeenCalledWith('name', false);
        expect(hasClass(ths[0], 'st-sort-ascent')).toBe(true);
        expect(hasClass(ths[0], 'st-sort-descent')).toBe(false);
    });

    it('should pass the predicate to the sortBy function and revert it on a second click', function () {
        spyOn(controllerMock, 'sortBy').andCallThrough();
        var ths = element.find('th');
        angular.element(ths[0]).triggerHandler('click');
        angular.element(ths[0]).triggerHandler('click');
        expect(controllerMock.sortBy.calls[1].args).toEqual(['name', true]);
        expect(controllerMock.sortBy.calls.length).toBe(2);
        expect(hasClass(ths[0], 'st-sort-ascent')).toBe(false);
        expect(hasClass(ths[0], 'st-sort-descent')).toBe(true);
    });

    it('should reset the sort state on the third call', function () {
        spyOn(controllerMock, 'sortBy').andCallThrough();
        spyOn(controllerMock, 'pipe').andCallThrough();
        var ths = element.find('th');
        angular.element(ths[0]).triggerHandler('click');
        angular.element(ths[0]).triggerHandler('click');
        tableState.sort = {
            predicate: 'name',
            reverse: true
        };
        tableState.pagination.start = 40;
        angular.element(ths[0]).triggerHandler('click');
        expect(tableState.sort).toEqual({});
        expect(tableState.pagination.start).toEqual(0);

        expect(controllerMock.sortBy.calls.length).toBe(2);
        expect(controllerMock.pipe).toHaveBeenCalled();
    });

    it('should support getter function as predicate', function () {
        spyOn(controllerMock, 'sortBy').andCallThrough();
        var ths = element.find('th');
        angular.element(ths[2]).triggerHandler('click');
        expect(controllerMock.sortBy).toHaveBeenCalledWith(scope.getters.age, false);
    });

    it('should reset its class if table state has changed', function () {
        spyOn(controllerMock, 'sortBy').andCallThrough();
        var ths = element.find('th');
        angular.element(ths[0]).triggerHandler('click');
        expect(controllerMock.sortBy).toHaveBeenCalledWith('name', false);
        expect(hasClass(ths[0], 'st-sort-ascent')).toBe(true);

        tableState.sort = {
            predicate: 'lastname'
        };

        scope.$apply();
        expect(hasClass(ths[0], 'st-sort-ascent')).toBe(false);
        expect(hasClass(ths[0], 'st-sort-descent')).toBe(false);

    });

    it('should sort by default a column', inject(function ($compile) {
        spyOn(controllerMock, 'sortBy').andCallThrough();
        var template = '<table st-table="rowCollection">' +
            '<thead>' +
            '<tr><th st-sort="name">firstname</th>' +
            '<th st-sort-default st-sort="lastname">lastname</th>' +
            '<th st-sort="getters.age">age</th>' +
            '</tr>' +
            '</table>';

        element = $compile(template)(scope);

        scope.$apply();

        var ths = element.find('th');
        expect(controllerMock.sortBy).toHaveBeenCalledWith('lastname', false);
        expect(hasClass(ths[1], 'st-sort-ascent')).toBe(true);
        expect(hasClass(ths[1], 'st-sort-descent')).toBe(false);
    }));

    it('should sort by default a column in reverse mode', inject(function ($compile) {
        spyOn(controllerMock, 'sortBy').andCallThrough();
        var template = '<table st-table="rowCollection">' +
            '<thead>' +
            '<tr><th st-sort="name">firstname</th>' +
            '<th st-sort-default="reverse" st-sort="lastname">lastname</th>' +
            '<th st-sort="getters.age">age</th>' +
            '</tr>' +
            '</table>';

        element = $compile(template)(scope);

        scope.$apply();

        var ths = element.find('th');
        expect(controllerMock.sortBy).toHaveBeenCalledWith('lastname', true);
        expect(hasClass(ths[1], 'st-sort-ascent')).toBe(false);
        expect(hasClass(ths[1], 'st-sort-descent')).toBe(true);
    }));

});