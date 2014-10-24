describe('stSearch Directive', function () {

    var rootScope;
    var scope;
    var element;

    function trToModel(trs) {
        return Array.prototype.map.call(trs, function (ele) {
            return {
                name: ele.cells[0].innerHTML,
                firstname: ele.cells[1].innerHTML,
                age: +(ele.cells[2].innerHTML)
            };
        });
    }

    beforeEach(module('smart-table'));

    describe('string predicate', function () {

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

            var template = '<table st-table="rowCollection">' +
                '<thead>' +
                '<tr>' +
                '<th><input st-search="\'name\'" /></th>' +
                '<th><input st-search="" /></th>' +
                '<th>age</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr class="test-filtered" ng-repeat="row in rowCollection">' +
                '<td>{{row.name}}</td>' +
                '<td>{{row.firstname}}</td>' +
                '<td>{{row.age}}</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>';

            element = $compile(template)(scope);
            scope.$apply();
        }));

        it('should keep only items which matches', inject(function ($timeout) {
            var ths = element.find('th');
            var trs;

            var input = angular.element(ths[0].children[0]);
            input[0].value = 're';
            input.triggerHandler('input');
            trs = element.find('tr.test-filtered');
            expect(trs.length).toBe(5);
            $timeout.flush();
            trs = element.find('tr.test-filtered');
            expect(trs.length).toBe(3);
            expect(trToModel(trs)).toEqual([
                {name: 'Renard', firstname: 'Laurent', age: 66},
                {name: 'Renard', firstname: 'Olivier', age: 33},
                {name: 'Faivre', firstname: 'Blandine', age: 44}
            ]);
        }));

        it('should search globally', inject(function ($timeout) {
            var ths = element.find('th');

            var input = angular.element(ths[1].children[0]);
            input[0].value = 're';
            input.triggerHandler('input');
            $timeout.flush();
            trs = element.find('tr.test-filtered');
            expect(trs.length).toBe(4);
            expect(trToModel(trs)).toEqual([
                {name: 'Renard', firstname: 'Laurent', age: 66},
                {name: 'Francoise', firstname: 'Frere', age: 99},
                {name: 'Renard', firstname: 'Olivier', age: 33},
                {name: 'Faivre', firstname: 'Blandine', age: 44}
            ]);
        }));
    });

    describe('binding predicate', function () {

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

            var template = '<table st-table="rowCollection">' +
                '<thead>' +
                '<tr>' +
                '<th><input st-search="searchPredicate" /></th>' +
                '<th><input st-search="" /></th>' +
                '<th>age</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr class="test-filtered" ng-repeat="row in rowCollection">' +
                '<td>{{row.name}}</td>' +
                '<td>{{row.firstname}}</td>' +
                '<td>{{row.age}}</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>';

            element = $compile(template)(scope);
            scope.$apply();
        }));


        it('should support binding on search predicate', inject(function ($compile, $timeout) {
            scope.searchPredicate = 'name';
            var ths = element.find('th');
            var trs;

            var input = angular.element(ths[0].children[0]);
            input[0].value = 're';
            input.triggerHandler('input');
            trs = element.find('tr.test-filtered');
            expect(trs.length).toBe(5);
            $timeout.flush();
            trs = element.find('tr.test-filtered');
            expect(trs.length).toBe(3);
            expect(trToModel(trs)).toEqual([
                {name: 'Renard', firstname: 'Laurent', age: 66},
                {name: 'Renard', firstname: 'Olivier', age: 33},
                {name: 'Faivre', firstname: 'Blandine', age: 44}
            ]);

            scope.searchPredicate = 'firstname';
            scope.$apply();
            trs = element.find('tr.test-filtered');
            expect(trs.length).toBe(2);
            expect(trToModel(trs)).toEqual([
                {name: 'Renard', firstname: 'Laurent', age: 66},
                {name: 'Francoise', firstname: 'Frere', age: 99}
            ]);

        }));
    });
});
