'use strict';

/* jasmine specs for controllers go here */

//TODO clean column tests
describe('Table module', function () {

    var
        scope,
        ctrl;

    beforeEach(module('SmartTable.Table', function ($provide) {
        $provide.constant('DefaultTableConfiguration', {defaultValue: 'default', value: 'defaultValue'});
    }));

    describe('Table Controller', function () {
        beforeEach(inject(function ($controller, $rootScope, $filter, $injector) {
            scope = $rootScope.$new();
            //'$scope', 'Column', 'DefaultTableConfig', '$filter'
            ctrl = $controller('TableCtrl', {$scope: scope, Column: $injector.get('Column'), DefaultTableConfig: $injector.get('DefaultTableConfiguration'), $filter: $filter
            })
        }));

        it('should initialise the scope', function () {
            expect(angular.isArray(scope.columns)).toBe(true);
            expect(scope.columns.length).toBe(0);
        });

        it('should add column at proper index or put it at the end', function () {
            //insert few column
            ctrl.insertColumn({});
            expect(scope.columns.length).toBe(1);
            ctrl.insertColumn({});
            expect(scope.columns.length).toBe(2);
            //insert at a given index
            ctrl.insertColumn({id: 1}, 1);
            expect(scope.columns.length).toBe(3);
            expect(scope.columns[1].getConfigValue('id')).toBe(1);

            //wrong index -> insert at the end
            ctrl.insertColumn({id: 666}, -1);
            expect(scope.columns.length).toBe(4);
            expect(scope.columns[3].getConfigValue('id')).toBe(666);
            ctrl.insertColumn({id: 99}, 99);
            expect(scope.columns.length).toBe(5);
            expect(scope.columns[4].getConfigValue('id')).toBe(99);
        });

        it('should remove column at proper index or do nothing', function () {
            //insert few column
            ctrl.insertColumn({id: 1});
            expect(scope.columns.length).toBe(1);
            ctrl.insertColumn({id: 2});
            expect(scope.columns.length).toBe(2);

            ctrl.removeColumn(0);
            expect(scope.columns.length).toBe(1);
            expect(scope.columns[0].id).toBe(2);

            ctrl.removeColumn(666);
            expect(scope.columns.length).toBe(1);
            ctrl.removeColumn(-1);
            expect(scope.columns.length).toBe(1);
        });

        describe('move column', function () {
            beforeEach(function () {
                //insert few columns
                scope.columns = [];

                ctrl.insertColumn({id: 0});
                ctrl.insertColumn({id: 1});
                ctrl.insertColumn({id: 2});
                ctrl.insertColumn({id: 3});
                ctrl.insertColumn({id: 4});
            });

            it('should move a column from a lower index to an higher one', function () {

                expect(scope.columns.length).toBe(5);

                ctrl.moveColumn(0, 3);
                expect(scope.columns[0].id).toBe(1);
                expect(scope.columns[3].id).toBe(0);
            });

            it('should move a column from a higher index to a lower one', function () {
                ctrl.moveColumn(4, 1);
                expect(scope.columns[4].id).toBe(3);
                expect(scope.columns[1].id).toBe(4)
            });

            it('should not move any column', function () {
                ctrl.moveColumn(-1, 3);
                expect(scope.columns[3].id).toBe(3);
                ctrl.moveColumn(3, 666);
                expect(scope.columns[3].id).toBe(3);
            });
        });

//        describe('selection/unselection in selectionMode=single', function () {
//
//            var input=[{},{}];
//            var myFunction= function (array) {
//                array.splice(0,1);
//            };
//            it('should do somestuff with array', function () {
//                expect(input.length).toBe(2);
//                myFunction(input);
//                expect(input.length).toBe(1);
//            });
//        });
    });
});



