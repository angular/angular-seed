'use strict';

/* jasmine specs for controllers go here */


describe('Table module', function () {

    var
        scope,
        Column,
        DefaultConfig,
        filter,
        ctrl;

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

        //TODO clean column tests now that we have moved the 'array logic' to utilitiy (which is tested somewhere else)
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
            var array;
            beforeEach(function () {
                array = [
                    {id: 0, secondProperty: true, thirdProperty: 1},
                    {id: 1, secondProperty: true, thirdProperty: 2},
                    {id: 2, secondProperty: true, thirdProperty: 1}
                ];
                scope.displayedCollection = scope.dataCollection = [
                    {id: 0, secondProperty: true, thirdProperty: 1},
                    {id: 1, secondProperty: true, thirdProperty: 2},
                    {id: 2, secondProperty: true, thirdProperty: 1}
                ];

            });

            describe('Select dataRows', function () {

                describe('in single selection Mode', function () {

                    beforeEach(function () {
                        scope.selectionMode = 'single';
                    });

                    it('should only set isSelected=true to only one item at the time', function () {
                        ctrl.toggleSelection(scope.displayedCollection[0]);
                        expect(scope.displayedCollection[0].isSelected).toBe(true);
                        expect(scope.displayedCollection[1].isSelected).not.toBe(true);
                        expect(scope.displayedCollection[2].isSelected).not.toBe(true);

                        ctrl.toggleSelection(scope.displayedCollection[1]);
                        expect(scope.displayedCollection[0].isSelected).not.toBe(true);
                        expect(scope.displayedCollection[1].isSelected).toBe(true);
                        expect(scope.displayedCollection[2].isSelected).not.toBe(true);
                    });

                    it('should unselect', function () {
                        ctrl.toggleSelection(scope.displayedCollection[0]);
                        expect(scope.displayedCollection[0].isSelected).toBe(true);
                        ctrl.toggleSelection(scope.displayedCollection[0]);
                        expect(scope.displayedCollection[0].isSelected).not.toBe(true);
                    });

                    it('should not select any row when calling toggleSelectAll', function () {
                        ctrl.toggleSelectionAll(true);
                        expect(scope.displayedCollection[0].isSelected).not.toBe(true);
                        expect(scope.displayedCollection[1].isSelected).not.toBe(true);
                        expect(scope.displayedCollection[2].isSelected).not.toBe(true);
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

                    it('should select all the displayed row when calling toggleSelectAll with true', function () {
                        ctrl.toggleSelectionAll(true);
                        expect(scope.displayedCollection[0].isSelected).toBe(true);
                        expect(scope.displayedCollection[1].isSelected).toBe(true);
                        expect(scope.displayedCollection[2].isSelected).toBe(true);

                        scope.displayedCollection[0].isSelected = false;
                        ctrl.toggleSelectionAll(true);
                        expect(scope.displayedCollection[0].isSelected).toBe(true);
                        expect(scope.displayedCollection[1].isSelected).toBe(true);
                        expect(scope.displayedCollection[2].isSelected).toBe(true);
                    });

                    it('should unselect all the displayed row when calling toggleSelectAll with anything but true', function () {
                        scope.displayedCollection[0].isSelected = true;
                        scope.displayedCollection[1].isSelected = true;
                        ctrl.toggleSelectionAll('whatever');
                        expect(scope.displayedCollection[0].isSelected).not.toBe(true);
                        expect(scope.displayedCollection[1].isSelected).not.toBe(true);
                        expect(scope.displayedCollection[2].isSelected).not.toBe(true);

                        scope.displayedCollection[0].isSelected = true;
                        scope.displayedCollection[1].isSelected = true;
                        ctrl.toggleSelectionAll(false);
                        expect(scope.displayedCollection[0].isSelected).not.toBe(true);
                        expect(scope.displayedCollection[1].isSelected).not.toBe(true);
                        expect(scope.displayedCollection[2].isSelected).not.toBe(true);
                    });
                });
            });

            it('should delete a row from displayed collection and from data collection', function () {
                ctrl.removeDataRow(0);
                expect(scope.displayedCollection.length).toBe(2);
                expect(scope.dataCollection.length).toBe(2);
                expect(scope.displayedCollection).toEqual([
                    {id: 1, secondProperty: true, thirdProperty: 2},
                    {id: 2, secondProperty: true, thirdProperty: 1}
                ]);
                expect(scope.dataCollection).toEqual([
                    {id: 1, secondProperty: true, thirdProperty: 2},
                    {id: 2, secondProperty: true, thirdProperty: 1}
                ]);
            });

            it('should not remove any dataRow as the index is wrong', function () {
                ctrl.removeDataRow(-1);
                expect(scope.displayedCollection.length).toBe(3);
                expect(scope.dataCollection.length).toBe(3);
                ctrl.removeDataRow(5);
                expect(scope.displayedCollection.length).toBe(3);
                expect(scope.dataCollection.length).toBe(3);
                ctrl.removeDataRow('whatever');
                expect(scope.displayedCollection.length).toBe(3);
                expect(scope.dataCollection.length).toBe(3);
            });

            it('should move a row from a higher valid index to a lower valid index in the displayed Collection', function () {
                ctrl.moveDataRow(2, 0);
                expect(scope.displayedCollection.length).toBe(3);
                expect(scope.displayedCollection[0].id).toBe(2);
                expect(scope.displayedCollection[2].id).toBe(1);
            });

            it('should move a row from a lower valid index to a higher valid index in the displayed Collection', function () {
                ctrl.moveDataRow(0, 1);
                expect(scope.displayedCollection.length).toBe(3);
                expect(scope.displayedCollection[1].id).toBe(0);
                expect(scope.displayedCollection[0].id).toBe(1);
            });

            it('should not move any row with invalid index', function () {
                ctrl.moveDataRow(-1, 1);
                expect(scope.displayedCollection.length).toBe(3);
                expect(scope.displayedCollection).toEqual(array);

                ctrl.moveDataRow(1, 4);
                expect(scope.displayedCollection.length).toBe(3);
                expect(scope.displayedCollection).toEqual(array);

                ctrl.moveDataRow(-666, 'whatever');
                expect(scope.displayedCollection.length).toBe(3);
                expect(scope.displayedCollection).toEqual(array);
            });
        });

        describe('sort data rows', function () {

            var array;

            beforeEach(function () {
                array = [
                    {id: 0, secondProperty: true, thirdProperty: 2},
                    {id: 1, secondProperty: true, thirdProperty: 3},
                    {id: 2, secondProperty: true, thirdProperty: 1}
                ];
                scope.displayedCollection = scope.dataCollection = [
                    {id: 0, secondProperty: true, thirdProperty: 2},
                    {id: 1, secondProperty: true, thirdProperty: 3},
                    {id: 2, secondProperty: true, thirdProperty: 1}
                ];
                ctrl.insertColumn({map: 'id', isSortable: true});
                ctrl.insertColumn({map: 'secondProperty', isSortable: false});
                ctrl.insertColumn({map: 'thirdProperty', isSortable: true});
            });

            it('should not sort the displayed collection when isSortable is false', function () {
                ctrl.sortBy(scope.columns[1]);
                expect(scope.displayedCollection).toEqual(array);
            });

            it('should sort filter by "map", first acending then descending ', function () {
                //by id
                ctrl.sortBy(scope.columns[0]);
                expect(scope.displayedCollection).toEqual([
                    {id: 2, secondProperty: true, thirdProperty: 1},
                    {id: 1, secondProperty: true, thirdProperty: 3},
                    {id: 0, secondProperty: true, thirdProperty: 2}
                ]);
                //switch to another column sortable
                ctrl.sortBy(scope.columns[2]);
                expect(scope.displayedCollection).toEqual([
                    {id: 1, secondProperty: true, thirdProperty: 3},
                    {id: 0, secondProperty: true, thirdProperty: 2},
                    {id: 2, secondProperty: true, thirdProperty: 1}
                ]);

                //come back to the first one
                ctrl.sortBy(scope.columns[0]);
                expect(scope.displayedCollection).toEqual([
                    {id: 2, secondProperty: true, thirdProperty: 1},
                    {id: 1, secondProperty: true, thirdProperty: 3},
                    {id: 0, secondProperty: true, thirdProperty: 2}
                ]);

                //descent
                ctrl.sortBy(scope.columns[0]);
                expect(scope.displayedCollection).toEqual(array);
            });


        });

        describe('search data rows', function () {
            var array;

            beforeEach(function () {
                array = [
                    {id: 0, secondProperty: true, thirdProperty: 2},
                    {id: 1, secondProperty: true, thirdProperty: 3},
                    {id: 2, secondProperty: true, thirdProperty: 1}
                ];
                scope.displayedCollection = scope.dataCollection = [
                    {id: 0, secondProperty: true, thirdProperty: 2},
                    {id: 1, secondProperty: true, thirdProperty: 3},
                    {id: 2, secondProperty: true, thirdProperty: 1}
                ];
                ctrl.insertColumn({map: 'id', isSortable: true});
                ctrl.insertColumn({map: 'secondProperty', isSortable: false});
                ctrl.insertColumn({map: 'thirdProperty', isSortable: true});
            });

            it('should search globally if we dont specify a proper cololumn', function () {
                ctrl.search('1');
                expect(scope.displayedCollection.length).toBe(2);
                expect(scope.displayedCollection).toEqual([
                    {id: 1, secondProperty: true, thirdProperty: 3},
                    {id: 2, secondProperty: true, thirdProperty: 1}
                ]);
            });

            it('should search for only a given column if we provide proper column', function () {
                ctrl.search('1', scope.columns[0]);
                expect(scope.displayedCollection.length).toBe(1);
                expect(scope.displayedCollection).toEqual([
                    {id: 1, secondProperty: true, thirdProperty: 3}
                ]);
            });

            it('should switch form one mode to another without any problem', function () {
                ctrl.search('1');
                expect(scope.displayedCollection.length).toBe(2);
                expect(scope.displayedCollection).toEqual([
                    {id: 1, secondProperty: true, thirdProperty: 3},
                    {id: 2, secondProperty: true, thirdProperty: 1}
                ]);

                ctrl.search('1', scope.columns[0]);
                expect(scope.displayedCollection.length).toBe(1);
                expect(scope.displayedCollection).toEqual([
                    {id: 1, secondProperty: true, thirdProperty: 3}
                ]);

                ctrl.search('1');
                expect(scope.displayedCollection.length).toBe(2);
                expect(scope.displayedCollection).toEqual([
                    {id: 1, secondProperty: true, thirdProperty: 3},
                    {id: 2, secondProperty: true, thirdProperty: 1}
                ]);
            })
        })
    });
});



