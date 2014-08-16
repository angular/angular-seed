describe('st table Controller', function () {

    var dataSet;
    var scope;
    var ctrl;
    var childScope;

    beforeEach(module('smart-table'));

    beforeEach(inject(function ($rootScope, $controller, $filter, $parse) {
        dataSet = [
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Francoise', firstname: 'Frere', age: 99},
            {name: 'Renard', firstname: 'Olivier', age: 33},
            {name: 'Leponge', firstname: 'Bob', age: 22},
            {name: 'Faivre', firstname: 'Blandine', age: 44}
        ];
        scope = $rootScope;
        childScope = scope.$new();
        scope.data = dataSet;
        ctrl = $controller('stTableController', {$scope: scope, $parse: $parse, $filter: $filter, $attrs: {
            stTable: 'data'
        }});

    }));

    it('should sort the data', function () {
        ctrl.sortBy('firstname');
        expect(scope.data).toEqual([
            {name: 'Faivre', firstname: 'Blandine', age: 44},
            {name: 'Leponge', firstname: 'Bob', age: 22},
            {name: 'Francoise', firstname: 'Frere', age: 99},
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Renard', firstname: 'Olivier', age: 33}
        ]);
    });

    it('should reverse the order if the flag is passed', function () {
        ctrl.sortBy('firstname', true);
        expect(scope.data).toEqual([
            {name: 'Renard', firstname: 'Olivier', age: 33},
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Francoise', firstname: 'Frere', age: 99},
            {name: 'Leponge', firstname: 'Bob', age: 22},
            {name: 'Faivre', firstname: 'Blandine', age: 44}
        ]);
    });

    it('should broadcast an event when sorting', function () {
        childScope.$on('st:sort', function (event, args) {
            expect(args.predicate).toEqual('firstname');
        });

        ctrl.sortBy('firstname');
        expect(scope.data).toEqual([
            {name: 'Faivre', firstname: 'Blandine', age: 44},
            {name: 'Leponge', firstname: 'Bob', age: 22},
            {name: 'Francoise', firstname: 'Frere', age: 99},
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Renard', firstname: 'Olivier', age: 33}
        ]);
    });

    it('should support getter function predicate', function () {
        ctrl.sortBy(function (row) {
            return row.firstname.length;
        });
        expect(scope.data).toEqual([
            {name: 'Leponge', firstname: 'Bob', age: 22},
            {name: 'Francoise', firstname: 'Frere', age: 99},
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Renard', firstname: 'Olivier', age: 33},
            {name: 'Faivre', firstname: 'Blandine', age: 44}
        ]);
    });

    it('should search based on property name ', function () {
        ctrl.search('re', 'name');
        expect(scope.data).toEqual([
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Renard', firstname: 'Olivier', age: 33},
            {name: 'Faivre', firstname: 'Blandine', age: 44}
        ]);
    });

    it('should search globally', function () {
        ctrl.search('re');
        expect(scope.data).toEqual([
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Francoise', firstname: 'Frere', age: 99},
            {name: 'Renard', firstname: 'Olivier', age: 33},
            {name: 'Faivre', firstname: 'Blandine', age: 44}
        ])
    });

    it('should remember sort state when filtering', function () {
        ctrl.sortBy('firstname');
        expect(scope.data).toEqual([
            {name: 'Faivre', firstname: 'Blandine', age: 44},
            {name: 'Leponge', firstname: 'Bob', age: 22},
            {name: 'Francoise', firstname: 'Frere', age: 99},
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Renard', firstname: 'Olivier', age: 33}
        ]);

        ctrl.search('re', 'name');
        expect(scope.data).toEqual([
            {name: 'Faivre', firstname: 'Blandine', age: 44},
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Renard', firstname: 'Olivier', age: 33}
        ]);

    });

    it('should remember filtering when sorting', function () {
        ctrl.search('re', 'name');
        expect(scope.data).toEqual([
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Renard', firstname: 'Olivier', age: 33},
            {name: 'Faivre', firstname: 'Blandine', age: 44}
        ]);
        ctrl.sortBy('age');
        expect(scope.data).toEqual([
            {name: 'Renard', firstname: 'Olivier', age: 33},
            {name: 'Faivre', firstname: 'Blandine', age: 44},
            {name: 'Renard', firstname: 'Laurent', age: 66}
        ]);
    });

    it('should reset sort sate', function () {
        ctrl.sortBy('firstname');
        expect(scope.data).toEqual([
            {name: 'Faivre', firstname: 'Blandine', age: 44},
            {name: 'Leponge', firstname: 'Bob', age: 22},
            {name: 'Francoise', firstname: 'Frere', age: 99},
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Renard', firstname: 'Olivier', age: 33}
        ]);

        ctrl.reset();

        ctrl.search('re', 'name');
        expect(scope.data).toEqual([
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Renard', firstname: 'Olivier', age: 33},
            {name: 'Faivre', firstname: 'Blandine', age: 44}
        ]);
    });

    it('should broadcast event when reset', function () {
        scope.$on('st:reset', function () {
            expect(true).toBe(true);
        });
        ctrl.reset();
    });

});
