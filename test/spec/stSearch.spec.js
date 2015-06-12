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

    var stConfig;
    beforeEach(inject(function (_stConfig_) {
      stConfig = _stConfig_;
    }));

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
                '<th><input st-search="name" /></th>' +
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

        it('should throttle searching to 400ms by default', inject(function ($timeout) {
            var ths = element.find('th');

            var input = angular.element(ths[1].children[0]);
            input[0].value = 're';
            input.triggerHandler('input');

            $timeout.flush(399);
            trs = element.find('tr.test-filtered');
            expect(trs.length).toBe(5);

            $timeout.flush(1);
            trs = element.find('tr.test-filtered');
            expect(trs.length).toBe(4);
        }));

        it('should throttle searching by stConfig.search.delay', inject(function ($timeout, $rootScope, $compile) {
            var oldDelay = stConfig.search.delay;
            stConfig.search.delay = 845;

            // Since we must set the stCofig before compiling, we must recompile after configuring a delay
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
            var ths = element.find('th');

            var input = angular.element(ths[1].children[0]);
            input[0].value = 're';
            input.triggerHandler('input');

            $timeout.flush(844);
            trs = element.find('tr.test-filtered');
            expect(trs.length).toBe(5);

            $timeout.flush(1);
            trs = element.find('tr.test-filtered');
            expect(trs.length).toBe(4);

            stConfig.search.delay = oldDelay;
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
                '<th><input st-search="{{searchPredicate}}" /></th>' +
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

    describe('deep object predicate', function () {

        beforeEach(inject(function ($compile, $rootScope) {

            rootScope = $rootScope;
            scope = $rootScope.$new();
            scope.rowCollection = [
                {name: {lastname: 'Renard', firstname: 'Laurent'}, age: 66, description:'really silly description'},
                {name: {lastname: 'Francoise', firstname: 'Frere'}, age: 99, description:'really silly description'},
                {name: {lastname: 'Renard', firstname: 'Olivier'}, age: 33, description:'really silly description'},
                {name: {lastname: 'Leponge', firstname: 'Bob'}, age: 22, description:'really silly description'},
                {name: {lastname: 'Faivre', firstname: 'Blandine'}, age: 44, description:'really silly description'},
                {name: null, age: 33, description:'really silly description'}
            ];

            var template = '<table st-table="rowCollection">' +
                '<thead>' +
                '<tr>' +
                '<th><input st-search="name.lastname" /></th>' +
                '<th><input st-search="name.$" /></th>' +
                '<th>age</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr class="test-filtered" ng-repeat="row in rowCollection">' +
                '<td>{{row.name.lastname}}</td>' +
                '<td>{{row.name.firstname}}</td>' +
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
            expect(trs.length).toBe(6);
            $timeout.flush();
            trs = element.find('tr.test-filtered');
            expect(trs.length).toBe(3);
            expect(trToModel(trs)).toEqual([
                {name: 'Renard', firstname: 'Laurent', age: 66},
                {name: 'Renard', firstname: 'Olivier', age: 33},
                {name: 'Faivre', firstname: 'Blandine', age: 44}
            ]);
        }));

        it('should search globally within the name object', inject(function ($timeout) {
            var ths = element.find('th');

            var input = angular.element(ths[1].children[0]);
            input[0].value = 're';
            input.triggerHandler('input');
            $timeout.flush();
            var trs = element.find('tr.test-filtered');
            expect(trs.length).toBe(4);
            expect(trToModel(trs)).toEqual([
                {name: 'Renard', firstname: 'Laurent', age: 66},
                {name: 'Francoise', firstname: 'Frere', age: 99},
                {name: 'Renard', firstname: 'Olivier', age: 33},
                {name: 'Faivre', firstname: 'Blandine', age: 44}
            ]);
        }));

        it('should be able to reset deep paths', inject(function ($timeout) {
            var ths = element.find('th');

            var input = angular.element(ths[0].children[0]);
            input[0].value = 're';
            input.triggerHandler('input');
            $timeout.flush();
            input[0].value = '';
            input.triggerHandler('input');
            $timeout.flush();
            trs = element.find('tr.test-filtered');
            expect(trs.length).toBe(6);
        }));
    });
});
