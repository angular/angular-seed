describe('stSort Directive', function () {

    var rootScope;
    var scope;
    var element;
    var tableState;

    function hasClass(element, classname) {
        return Array.prototype.indexOf.call(element.classList, classname) !== -1
    }

    function trToModel(trs) {
        return Array.prototype.map.call(trs, function (ele) {
            return {
                name: ele.cells[0].innerHTML,
                firstname: ele.cells[1].innerHTML,
                age: +(ele.cells[2].innerHTML)
            };
        });
    }

    //expose table state for tests
    beforeEach(module('smart-table', function ($compileProvider) {
        $compileProvider.directive('dummy', function () {
            return {
                restrict: 'A',
                require: 'stTable',
                link: function (scope, element, attr, ctrl) {
                    tableState = ctrl.tableState();
                }
            };
        });
    }));

    beforeEach(inject(function ($compile, $rootScope) {

        rootScope = $rootScope;
        scope = $rootScope.$new();
        scope.rowCollection = [
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Francoise', firstname: 'Frere', age: 99},
            {name: 'Renard', firstname: 'Olivier', age: 33},
            {name: 'Leponge', firstname: 'Bob', age: 22},
            {name: 'Faivre', firstname: 'Blandine', age: 44}
        ];
        scope.getters = {
            age: function (row) {
                return row.name.length;
            }
        };

        var template = '<table dummy="" st-table="rowCollection">' +
            '<thead>' +
            '<tr><th st-sort="name">name</th>' +
            '<th st-sort="firstname">firstname</th>' +
            '<th st-sort="getters.age">age</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '<tr class="test-row" ng-repeat="row in rowCollection">' +
            '<td>{{row.name}}</td>' +
            '<td>{{row.firstname}}</td>' +
            '<td>{{row.age}}</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>';

        element = $compile(template)(scope);
        scope.$apply();
    }));

    it('should sort by clicked header', function () {
        var ths = element.find('th');
        var actual;
        angular.element(ths[1]).triggerHandler('click');
        actual = trToModel(element.find('tr.test-row'));
        expect(hasClass(ths[1], 'st-sort-ascent')).toBe(true);
        expect(hasClass(ths[1], 'st-sort-descent')).toBe(false);
        expect(actual).toEqual([
            {name: 'Faivre', firstname: 'Blandine', age: 44},
            {name: 'Leponge', firstname: 'Bob', age: 22},
            {name: 'Francoise', firstname: 'Frere', age: 99},
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Renard', firstname: 'Olivier', age: 33}
        ]);

    });

    it('should revert on the second click', function () {
        var ths = element.find('th');
        var actual;
        angular.element(ths[1]).triggerHandler('click');
        angular.element(ths[1]).triggerHandler('click');
        actual = trToModel(element.find('tr.test-row'));
        expect(hasClass(ths[1], 'st-sort-ascent')).toBe(false);
        expect(hasClass(ths[1], 'st-sort-descent')).toBe(true);
        expect(actual).toEqual([
            {name: 'Renard', firstname: 'Olivier', age: 33},
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Francoise', firstname: 'Frere', age: 99},
            {name: 'Leponge', firstname: 'Bob', age: 22},
            {name: 'Faivre', firstname: 'Blandine', age: 44}
        ]);

    });

    it('should reset the sort state on the third call', function () {
        var ths = element.find('th');
        var actual;
        angular.element(ths[1]).triggerHandler('click');
        angular.element(ths[1]).triggerHandler('click');
        tableState.sort = {
            predicate: 'firstname',
            reverse: true
        };
        tableState.pagination.start = 40;
        angular.element(ths[1]).triggerHandler('click');
        actual = trToModel(element.find('tr.test-row'));
        expect(hasClass(ths[1], 'st-sort-ascent')).toBe(false);
        expect(hasClass(ths[1], 'st-sort-descent')).toBe(false);
        expect(actual).toEqual([
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Francoise', firstname: 'Frere', age: 99},
            {name: 'Renard', firstname: 'Olivier', age: 33},
            {name: 'Leponge', firstname: 'Bob', age: 22},
            {name: 'Faivre', firstname: 'Blandine', age: 44}
        ]);
        expect(tableState.sort).toEqual({});
        expect(tableState.pagination.start).toEqual(0);

    });

    it('should support getter function as predicate', function () {
        var ths = element.find('th');
        var actual;
        angular.element(ths[2]).triggerHandler('click');
        actual = trToModel(element.find('tr.test-row'));
        expect(actual).toEqual([
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Renard', firstname: 'Olivier', age: 33},
            {name: 'Faivre', firstname: 'Blandine', age: 44},
            {name: 'Leponge', firstname: 'Bob', age: 22},
            {name: 'Francoise', firstname: 'Frere', age: 99}
        ]);

    });

    it('should reset its class if table state has changed', function () {
        var ths = element.find('th');
        angular.element(ths[1]).triggerHandler('click');
        expect(hasClass(ths[1], 'st-sort-ascent')).toBe(true);

        tableState.sort = {
            predicate: 'lastname'
        };

        scope.$apply();
        expect(hasClass(ths[1], 'st-sort-ascent')).toBe(false);
        expect(hasClass(ths[1], 'st-sort-descent')).toBe(false);

    });

    it('should sort by default a column', inject(function ($compile) {
        var template = '<table dummy="" st-table="rowCollection">' +
            '<thead>' +
            '<tr><th st-sort="name">name</th>' +
            '<th st-sort-default st-sort="firstname">firstname</th>' +
            '<th st-sort="getters.age">age</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '<tr class="test-row" ng-repeat="row in rowCollection">' +
            '<td>{{row.name}}</td>' +
            '<td>{{row.firstname}}</td>' +
            '<td>{{row.age}}</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>';

        element = $compile(template)(scope);

        scope.$apply();

        var ths = element.find('th');
        var actual = trToModel(element.find('tr.test-row'));
        expect(hasClass(ths[1], 'st-sort-ascent')).toBe(true);
        expect(hasClass(ths[1], 'st-sort-descent')).toBe(false);
        expect(actual).toEqual([
            {name: 'Faivre', firstname: 'Blandine', age: 44},
            {name: 'Leponge', firstname: 'Bob', age: 22},
            {name: 'Francoise', firstname: 'Frere', age: 99},
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Renard', firstname: 'Olivier', age: 33}
        ]);
    }));

    it('should sort by default a column in reverse mode', inject(function ($compile) {
        var template = '<table dummy="" st-table="rowCollection">' +
            '<thead>' +
            '<tr><th st-sort="name">name</th>' +
            '<th st-sort-default="reverse" st-sort="firstname">firstname</th>' +
            '<th st-sort="getters.age">age</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '<tr class="test-row" ng-repeat="row in rowCollection">' +
            '<td>{{row.name}}</td>' +
            '<td>{{row.firstname}}</td>' +
            '<td>{{row.age}}</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>';

        element = $compile(template)(scope);

        scope.$apply();

        var ths = element.find('th');
        var actual = trToModel(element.find('tr.test-row'));
        expect(hasClass(ths[1], 'st-sort-ascent')).toBe(false);
        expect(hasClass(ths[1], 'st-sort-descent')).toBe(true);
        expect(actual).toEqual([
            {name: 'Renard', firstname: 'Olivier', age: 33},
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Francoise', firstname: 'Frere', age: 99},
            {name: 'Leponge', firstname: 'Bob', age: 22},
            {name: 'Faivre', firstname: 'Blandine', age: 44}
        ]);
    }));

    it('should skip natural order', inject(function ($compile) {
        var template = '<table dummy="" st-table="rowCollection">' +
            '<thead>' +
            '<tr><th>name</th>' +
            '<th st-skip-natural="true" st-sort="firstname">firstname</th>' +
            '<th>age</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '<tr class="test-row" ng-repeat="row in rowCollection">' +
            '<td>{{row.name}}</td>' +
            '<td>{{row.firstname}}</td>' +
            '<td>{{row.age}}</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>';

        element = $compile(template)(scope);

        scope.$apply();

        var ths = element.find('th');
        var th1 = angular.element(ths[1]);
        th1.triggerHandler('click');
        th1.triggerHandler('click');
        th1.triggerHandler('click');
        scope.$apply();
        var actual = trToModel(element.find('tr.test-row'));
        expect(hasClass(ths[1], 'st-sort-ascent')).toBe(true);
        expect(hasClass(ths[1], 'st-sort-descent')).toBe(false);
        expect(actual).toEqual([
            {name: 'Faivre', firstname: 'Blandine', age: 44},
            {name: 'Leponge', firstname: 'Bob', age: 22},
            {name: 'Francoise', firstname: 'Frere', age: 99},
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Renard', firstname: 'Olivier', age: 33}
        ]);
    }));

});