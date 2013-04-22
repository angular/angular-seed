'use strict';

/* jasmine specs for controllers go here */


describe('Table module', function () {

    var
        scope,
        Column,
        DefaultConfig,
        filter,
        ctrl;

    var filterMock = {

        filter: function (value) {
            var scope = scope;
            if (value === 'orderBy') {
                return filterMock.orderByFunc;
            }
        },
        orderByFunc: function (array, predicate, reverse) {
        }
    };

    beforeEach(module('SmartTable.Table', function ($provide) {
        $provide.constant('DefaultTableConfiguration', {defaultValue: 'default', value: 'defaultValue'});
    }));

    describe('Table Controller', function () {
        beforeEach(inject(function ($controller, $rootScope, $filter, $injector) {
            scope = $rootScope.$new();
            Column = $injector.get('Column');
            DefaultConfig = $injector.get('DefaultTableConfiguration');
            filter = $filter;
            ctrl = $controller('TableCtrl', {$scope: scope, Column: Column, DefaultTableConfig: DefaultConfig, $filter: filter
            });
        }));

        it('should initialise the scope', function () {
            expect(angular.isArray(scope.columns)).toBe(true);
            expect(scope.columns.length).toBe(0);
            expect(angular.isArray(scope.displayedCollection)).toBe(true);
            expect(angular.isArray(scope.dataCollection)).toBe(true);
        });

        //TODO clean column tests now that we have moved the 'array logic' to utilitiy (which is tested somewhere else
        describe('Column API', function () {
            it('should add column at proper index or put it at the end', function () {
                //insert few column
                ctrl.insertColumn({});
                expect(scope.columns.length).toBe(1);
                ctrl.insertColumn({});
                expect(scope.columns.length).toBe(2);
                //insert at a given index
                ctrl.insertColumn({id: 1}, 1);
                expect(scope.columns.length).toBe(3);
                expect(scope.columns[1].id).toBe(1);

                //wrong index -> insert at the end
                ctrl.insertColumn({id: 666}, -1);
                expect(scope.columns.length).toBe(4);
                expect(scope.columns[3].id).toBe(666);
                ctrl.insertColumn({id: 99}, 99);
                expect(scope.columns.length).toBe(5);
                expect(scope.columns[4].id).toBe(99);
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
        });

        //TODO clean row tests now that we have moved the 'array logic' to utilitiy (which is tested somewhere else
        describe('Row API', function () {

            describe('Select a dataRow', function () {
                var array;
                beforeEach(function () {
                    scope.displayedCollection = scope.dataCollection = array = [
                        {firstProperty: 'firstvalue1', secondProperty: true, thirdProperty: 1},
                        {firstProperty: 'firstvalue1', secondProperty: true, thirdProperty: 2},
                        {firstProperty: 'firstvalue2', secondProperty: true, thirdProperty: 1}
                    ];
                });

                describe('in single selection Mode', function () {

                    beforeEach(function () {
                        scope.selectionMode = 'single';
                    });

                    it('shoulde only set isSelected=true to only one item at the time', function () {
                        ctrl.toggleSelection(array[0]);
                        expect(array[0].isSelected).toBe(true);
                        expect(array[1].isSelected).not.toBe(true);
                        expect(array[2].isSelected).not.toBe(true);

                        ctrl.toggleSelection(array[1]);
                        expect(array[0].isSelected).not.toBe(true);
                        expect(array[1].isSelected).toBe(true);
                        expect(array[2].isSelected).not.toBe(true);
                    });

                    it('should unselect', function () {
                        ctrl.toggleSelection(array[0]);
                        expect(array[0].isSelected).toBe(true);
                        ctrl.toggleSelection(array[0]);
                        expect(array[0].isSelected).not.toBe(true);
                    });
                });

                describe('selection in selection mode multiple', function () {

                    var array;

                    beforeEach(function () {
                        scope.displayedCollection = array = [
                            {firstProperty: 'firstvalue1', secondProperty: true, thirdProperty: 1},
                            {firstProperty: 'firstvalue1', secondProperty: true, thirdProperty: 2},
                            {firstProperty: 'firstvalue2', secondProperty: true, thirdProperty: 1}
                        ];
                        scope.selectionMode = 'multiple';
                    });

                    it('should set isSelected=true to any row', function () {
                        ctrl.toggleSelection(array[0]);
                        expect(array[0].isSelected).toBe(true);
                        expect(array[1].isSelected).not.toBe(true);
                        expect(array[2].isSelected).not.toBe(true);

                        ctrl.toggleSelection(array[1]);
                        expect(array[0].isSelected).toBe(true);
                        expect(array[1].isSelected).toBe(true);
                        expect(array[2].isSelected).not.toBe(true);
                    });

                    it('should unselect any row', function () {
                        ctrl.toggleSelection(array[0]);
                        expect(array[0].isSelected).toBe(true);
                        expect(array[1].isSelected).not.toBe(true);
                        expect(array[2].isSelected).not.toBe(true);

                        ctrl.toggleSelection(array[0]);
                        expect(array[0].isSelected).not.toBe(true);
                        expect(array[1].isSelected).not.toBe(true);
                        expect(array[2].isSelected).not.toBe(true);
                    });
                });

                it('delete a row from displayed collection and from data collection', function () {

                });
            });
        });

        describe('sort data row', function () {

            beforeEach(function () {
                scope.columns = [];
                scope.displayedCollection = [];
                ctrl.insertColumn({map: 'map', isSortable: true});
                ctrl.insertColumn({map: 'map', isSortable: false});
                ctrl.insertColumn({map: 'map', isSortable: true, sortPredicate: 'sortPredicate'});

                filter = filterMock.filter;
                spyOn(filterMock, 'filter').andCallThrough();
                spyOn(filterMock, 'orderByFunc');
            });

            xit('should not call the filter', function () {
                ctrl.sortBy(scope.columns[1]);
                expect(filterMock.filter).not.toHaveBeenCalled();
                expect(filterMock.orderByFunc).not.toHaveBeenCalled();
            });

            xit('should call the filter with map property as predicate', function () {
                ctrl.sortBy(scope.columns[0]);
                expect(filterMock.orderByFunc).toHaveBeenCalledWith(scope.displayedCollection, scope.columns[0].map, true);
            })


        });
    });
});



