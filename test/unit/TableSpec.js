describe('Table module', function () {

    var
        scope,
        Column,
        DefaultConfig,
        filter,
        ctrl,
        defaultDisplayedCollection = [
            {prop: 'defaultValue'}
        ],
        ctrlMock = {
            pipe: function () {
                return defaultDisplayedCollection;
            }
        };

    beforeEach(module('smartTable.table', function ($provide) {
        $provide.constant('DefaultTableConfiguration', {defaultValue: 'defaultValue', value: 'defaultValue'});
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

        it('should init the config', function () {

            expect(angular.isArray(scope.columns)).toBe(true);
            expect(angular.isArray(scope.displayedCollection)).toBe(true);
            expect(angular.isArray(scope.dataCollection)).toBe(true);

            ctrl.setGlobalConfig({value: 'overwritten'});
            expect(scope.defaultValue).toEqual('defaultValue');
            expect(scope.value).toEqual('overwritten');
        });

        it('should set and override the config', function () {
            ctrl.setGlobalConfig({value: 'overwritten'});
            expect(scope.defaultValue).toEqual('defaultValue');
            expect(scope.value).toEqual('overwritten');
        });

        describe('change page', function () {

            beforeEach(function () {
                var changePage = ctrl.changePage;
                ctrl = ctrlMock;
                ctrl.changePage = changePage;
            });

            it('should change the page and refresh the displayed items', function () {
                spyOn(ctrlMock, 'pipe').andCallThrough();
                scope.currentPage = 1;
                ctrl.changePage({page: 2});
                expect(scope.currentPage).toEqual(2);
                expect(ctrlMock.pipe).toHaveBeenCalledWith(scope.dataCollection);
                expect(scope.displayedCollection).toBe(defaultDisplayedCollection);
            });

            it('should not change the page if provided page parameter is not correct', function () {
                scope.currentPage = 3;
                spyOn(ctrlMock, 'pipe').andCallThrough();
                ctrl.changePage('whatever');
                expect(scope.currentPage).toEqual(3);
                expect(ctrlMock.pipe).not.toHaveBeenCalled();
            });

            it('should emit an event', inject(function ($rootScope) {
                scope.currentPage = 3;
                var eventHandler = {
                    listener: function (event, args) {
                        expect(args.oldValue).toEqual(3);
                        expect(args.newValue).toEqual(1);
                    }
                };
                spyOn(eventHandler, 'listener');
                $rootScope.$on('changePage', eventHandler.listener);
                ctrl.changePage({page: 1});
                expect(eventHandler.listener).toHaveBeenCalled();
            }));
        });

        describe('Column API', function () {

            beforeEach(function () {
                scope.columns = [new Column({id: 0}), new Column({id: 1})];
            });

            it('should add column at proper index or put it at the end', function () {

                expect(scope.columns.length).toEqual(2);
                //insert at a given index
                ctrl.insertColumn({id: 3}, 1);
                expect(scope.columns.length).toBe(3);
                expect(scope.columns[1].id).toBe(3);
            });

            it('should add Column at the end', function () {
                expect(scope.columns.length).toEqual(2);

                ctrl.insertColumn({id: 666}, -1);
                expect(scope.columns.length).toBe(3);
                expect(scope.columns[2].id).toBe(666);
                ctrl.insertColumn({id: 99}, 99);
                expect(scope.columns.length).toBe(4);
                expect(scope.columns[3].id).toBe(99);
            });

            it('should remove column at proper index or do nothing', function () {

                expect(scope.columns.length).toEqual(2);

                ctrl.removeColumn(0);
                expect(scope.columns.length).toBe(1);
                expect(scope.columns[0].id).toBe(1);

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

            describe('clear columns', function () {

                beforeEach(function () {
                    //insert few columns
                    scope.columns = [];

                    ctrl.insertColumn({id: 0});
                    ctrl.insertColumn({id: 1});
                    ctrl.insertColumn({id: 2});
                    ctrl.insertColumn({id: 3});
                    ctrl.insertColumn({id: 4});
                });

                it('should remove all columns', function () {
                    expect(scope.columns.length).toBe(5);
                    ctrl.clearColumns();
                    expect(scope.columns.length).toBe(0);
                });

                it('should have columns when adding after clear', function () {
                    ctrl.clearColumns();
                    ctrl.insertColumn({id: 7});
                    ctrl.insertColumn({id: 8});
                    ctrl.insertColumn({id: 9});
                    expect(scope.columns[0].id).toBe(7);
                    expect(scope.columns[1].id).toBe(8);
                    expect(scope.columns[2].id).toBe(9);
                });

            });
        });

        describe('Row API', function () {
            var refArray = [
                {id: 0},
                {id: 1},
                {id: 2}
            ];
            beforeEach(function () {
                scope.displayedCollection = scope.dataCollection = [
                    {id: 0},
                    {id: 1},
                    {id: 2}
                ];
            });

            describe('Select dataRows', function () {

                describe('in single selection Mode', function () {

                    beforeEach(function () {
                        scope.selectionMode = 'single';
                        scope.displayedCollection = scope.dataCollection = [
                            {id: 0, secondProperty: true, thirdProperty: 1},
                            {id: 1, secondProperty: true, thirdProperty: 2},
                            {id: 2, secondProperty: true, thirdProperty: 1}
                        ];
                    });

                    it('should only set isSelected=true to only one item at the time', function () {
                        ctrl.toggleSelection(scope.displayedCollection[0]);
                        expect(scope.dataCollection[0].isSelected).toBe(true);
                        expect(scope.dataCollection[1].isSelected).not.toBe(true);
                        expect(scope.dataCollection[2].isSelected).not.toBe(true);

                        ctrl.toggleSelection(scope.displayedCollection[1]);
                        expect(scope.dataCollection[0].isSelected).not.toBe(true);
                        expect(scope.dataCollection[1].isSelected).toBe(true);
                        expect(scope.dataCollection[2].isSelected).not.toBe(true);
                    });

                    it('should emit event when being selected', inject(function ($rootScope) {
                        var eventHanlder = {
                            listener: function (event, args) {
                                expect(args.item).toEqual(scope.displayedCollection[0]);
                                expect(args.item.isSelected).toBe(true);
                            }
                        };
                        spyOn(eventHanlder, 'listener').andCallThrough();
                        $rootScope.$on('selectionChange', eventHanlder.listener);
                        ctrl.toggleSelection(scope.displayedCollection[0]);
                        expect(eventHanlder.listener).toHaveBeenCalled();
                    }));

                    it('should emit event when being unselected', inject(function ($rootScope) {
                        ctrl.toggleSelection(scope.displayedCollection[0]);
                        expect(scope.displayedCollection[0].isSelected).toBe(true);

                        var callCounter = 0;
                        var eventHanlder = {
                            listener: function (event, args) {

                                //first time call : unselect the previously selected
                                if (callCounter === 0) {
                                    expect(args.item).toEqual(scope.displayedCollection[0]);
                                    expect(args.item.isSelected).toBe(false);
                                    callCounter++;
                                } else {
                                    expect(args.item).toEqual(scope.displayedCollection[1]);
                                    expect(args.item.isSelected).toBe(true);
                                }
                            }
                        };
                        spyOn(eventHanlder, 'listener').andCallThrough();
                        $rootScope.$on('selectionChange', eventHanlder.listener);
                        ctrl.toggleSelection(scope.displayedCollection[1]);
                        expect(eventHanlder.listener.callCount).toBe(2);
                    }));

                    it('should unselect', function () {
                        ctrl.toggleSelection(scope.displayedCollection[0]);
                        expect(scope.dataCollection[0].isSelected).toBe(true);
                        ctrl.toggleSelection(scope.displayedCollection[0]);
                        expect(scope.dataCollection[0].isSelected).not.toBe(true);
                    });

                    it('should not select any row when calling toggleSelectAll', function () {
                        ctrl.toggleSelectionAll(true);
                        expect(scope.dataCollection[0].isSelected).not.toBe(true);
                        expect(scope.dataCollection[1].isSelected).not.toBe(true);
                        expect(scope.dataCollection[2].isSelected).not.toBe(true);
                    });
                });

                describe('selection in selection mode multiple', function () {

                    beforeEach(function () {
                        scope.selectionMode = 'multiple';

                        scope.displayedCollection = scope.dataCollection = [
                            {id: 0, secondProperty: true, thirdProperty: 1},
                            {id: 1, secondProperty: true, thirdProperty: 2},
                            {id: 2, secondProperty: true, thirdProperty: 1}
                        ];
                    });

                    it('should set isSelected=true to any row', function () {
                        ctrl.toggleSelection(scope.displayedCollection[0]);
                        expect(scope.dataCollection[0].isSelected).toBe(true);
                        expect(scope.dataCollection[1].isSelected).not.toBe(true);
                        expect(scope.dataCollection[2].isSelected).not.toBe(true);

                        ctrl.toggleSelection(scope.displayedCollection[1]);
                        expect(scope.dataCollection[0].isSelected).toBe(true);
                        expect(scope.dataCollection[1].isSelected).toBe(true);
                        expect(scope.dataCollection[2].isSelected).not.toBe(true);
                    });

                    it('should unselect any row', function () {
                        ctrl.toggleSelection(scope.displayedCollection[0]);
                        expect(scope.dataCollection[0].isSelected).toBe(true);
                        expect(scope.dataCollection[1].isSelected).not.toBe(true);
                        expect(scope.dataCollection[2].isSelected).not.toBe(true);

                        ctrl.toggleSelection(scope.displayedCollection[0]);
                        expect(scope.dataCollection[0].isSelected).not.toBe(true);
                        expect(scope.dataCollection[1].isSelected).not.toBe(true);
                        expect(scope.dataCollection[2].isSelected).not.toBe(true);
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

                    it('should always emit an event', inject(function ($rootScope) {
                        var eventHanlder = {
                            listener: function (event, args) {
                                expect(args.item).toEqual(scope.displayedCollection[0]);
                                expect(args.item.isSelected).toEqual(scope.displayedCollection[0].isSelected);
                            }
                        };
                        spyOn(eventHanlder, 'listener').andCallThrough();
                        $rootScope.$on('selectionChange', eventHanlder.listener);
                        ctrl.toggleSelection(scope.displayedCollection[0]);
                        expect(eventHanlder.listener).toHaveBeenCalled();
                        ctrl.toggleSelection(scope.displayedCollection[0]);
                        expect(eventHanlder.listener).toHaveBeenCalled();
                    }));
                });
            });

            it('should delete a row from displayed collection and from data collection', function () {

                ctrl.removeDataRow(0);
                expect(scope.displayedCollection.length).toBe(2);
                expect(scope.dataCollection.length).toBe(2);
                expect(scope.displayedCollection).toEqual([
                    {id: 1},
                    {id: 2}
                ]);
                expect(scope.dataCollection).toEqual([
                    {id: 1},
                    {id: 2}
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
                expect(scope.displayedCollection).toEqual(refArray);

                ctrl.moveDataRow(1, 4);
                expect(scope.displayedCollection.length).toBe(3);
                expect(scope.displayedCollection).toEqual(refArray);

                ctrl.moveDataRow(-666, 'whatever');
                expect(scope.displayedCollection.length).toBe(3);
                expect(scope.displayedCollection).toEqual(refArray);
            });
        });

        describe('sort data rows', function () {

            var refArray = [
                {id: 0, secondProperty: true, thirdProperty: 2},
                {id: 1, secondProperty: true, thirdProperty: 3},
                {id: 2, secondProperty: true, thirdProperty: 1}
            ];

            beforeEach(function () {
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
                expect(scope.displayedCollection).toEqual(refArray);
            });

            //not really unit test but more relevant here...
            it('should sort by "map", first ascending then descending finally back to natural order', function () {

                ctrl.sortBy(scope.columns[2]);
                expect(scope.displayedCollection).toEqual([
                    {id: 2, secondProperty: true, thirdProperty: 1},
                    {id: 0, secondProperty: true, thirdProperty: 2},
                    {id: 1, secondProperty: true, thirdProperty: 3}
                ]);

                //switch to another column sortable
                //by id
                ctrl.sortBy(scope.columns[0]);
                expect(scope.displayedCollection).toEqual([
                    {id: 0, secondProperty: true, thirdProperty: 2},
                    {id: 1, secondProperty: true, thirdProperty: 3},
                    {id: 2, secondProperty: true, thirdProperty: 1}
                ]);

                //back to thirdProperty
                ctrl.sortBy(scope.columns[2]);
                expect(scope.displayedCollection).toEqual([
                    {id: 2, secondProperty: true, thirdProperty: 1},
                    {id: 0, secondProperty: true, thirdProperty: 2},
                    {id: 1, secondProperty: true, thirdProperty: 3}
                ]);

                //descent
                ctrl.sortBy(scope.columns[2]);
                expect(scope.displayedCollection).toEqual([
                    {id: 1, secondProperty: true, thirdProperty: 3},
                    {id: 0, secondProperty: true, thirdProperty: 2},
                    {id: 2, secondProperty: true, thirdProperty: 1}
                ]);

                //natural order
                ctrl.sortBy(scope.columns[2]);
                expect(scope.displayedCollection).toEqual(refArray);
            });
        });

        describe('search data rows', function () {

            beforeEach(function () {
                scope.itemsByPage = 10;
                scope.displayedCollection = scope.dataCollection = [
                    {id: 0, secondProperty: true, thirdProperty: 2},
                    {id: 1, secondProperty: true, thirdProperty: 3},
                    {id: 2, secondProperty: true, thirdProperty: 1}
                ];
                ctrl.insertColumn({map: 'id', isSortable: true});
                ctrl.insertColumn({map: 'secondProperty', isSortable: false});
                ctrl.insertColumn({map: 'thirdProperty', isSortable: true});
            });

            it('should not filter items with a null property by default', function () {
                scope.dataCollection.push({id: 4, secondProperty: true, thirdProperty: null});
                ctrl.search('');
                expect(scope.displayedCollection.length).toBe(4);
                expect(scope.displayedCollection).toEqual([
                    {id: 0, secondProperty: true, thirdProperty: 2},
                    {id: 1, secondProperty: true, thirdProperty: 3},
                    {id: 2, secondProperty: true, thirdProperty: 1},
                    {id: 4, secondProperty: true, thirdProperty: null}
                ]);
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
            });
        });

        describe('update data row', function () {
            beforeEach(function () {
                scope.displayedCollection = scope.dataCollection = [
                    {id: 0, secondProperty: true, thirdProperty: 2, more: {another: 'test'}},
                    {id: 1, secondProperty: true, thirdProperty: 3, more: {another: 'test'}},
                    {id: 2, secondProperty: true, thirdProperty: 1, more: {another: 'test'}}
                ];
            });

            it('should update the proper data row with the proper value', function () {
                ctrl.updateDataRow(scope.displayedCollection[0], 'id', 34);
                expect(scope.displayedCollection).toEqual([
                    {id: 34, secondProperty: true, thirdProperty: 2, more: {another: 'test'}},
                    {id: 1, secondProperty: true, thirdProperty: 3, more: {another: 'test'}},
                    {id: 2, secondProperty: true, thirdProperty: 1, more: {another: 'test'}}
                ]);

                expect(scope.dataCollection).toEqual([
                    {id: 34, secondProperty: true, thirdProperty: 2, more: {another: 'test'}},
                    {id: 1, secondProperty: true, thirdProperty: 3, more: {another: 'test'}},
                    {id: 2, secondProperty: true, thirdProperty: 1, more: {another: 'test'}}
                ]);
            });

            it('should not update any data Row', function () {
                ctrl.updateDataRow({id: 1, secondProperty: true, thirdProperty: 2}, 'id', 34);
                expect(scope.displayedCollection).toEqual([
                    {id: 0, secondProperty: true, thirdProperty: 2, more: {another: 'test'}},
                    {id: 1, secondProperty: true, thirdProperty: 3, more: {another: 'test'}},
                    {id: 2, secondProperty: true, thirdProperty: 1, more: {another: 'test'}}
                ]);

                expect(scope.dataCollection).toEqual([
                    {id: 0, secondProperty: true, thirdProperty: 2, more: {another: 'test'}},
                    {id: 1, secondProperty: true, thirdProperty: 3, more: {another: 'test'}},
                    {id: 2, secondProperty: true, thirdProperty: 1, more: {another: 'test'}}
                ]);
            });

            it('should "create" a new property on the proper dataRow ', function () {
                ctrl.updateDataRow(scope.displayedCollection[0], 'newProp', 'value');
                expect(scope.displayedCollection).toEqual([
                    {id: 0, secondProperty: true, thirdProperty: 2, more: {another: 'test'}, newProp: 'value'},
                    {id: 1, secondProperty: true, thirdProperty: 3, more: {another: 'test'}},
                    {id: 2, secondProperty: true, thirdProperty: 1, more: {another: 'test'}}
                ]);

                expect(scope.dataCollection).toEqual([
                    {id: 0, secondProperty: true, thirdProperty: 2, more: {another: 'test'}, newProp: 'value'},
                    {id: 1, secondProperty: true, thirdProperty: 3, more: {another: 'test'}},
                    {id: 2, secondProperty: true, thirdProperty: 1, more: {another: 'test'}}
                ]);
            });

            it('should work on multilevel object', function () {
                ctrl.updateDataRow(scope.displayedCollection[0], 'more.another', 'validateTest');
                expect(scope.displayedCollection).toEqual([
                    {id: 0, secondProperty: true, thirdProperty: 2, more: {another: 'validateTest'}},
                    {id: 1, secondProperty: true, thirdProperty: 3, more: {another: 'test'}},
                    {id: 2, secondProperty: true, thirdProperty: 1, more: {another: 'test'}}
                ]);

                expect(scope.dataCollection).toEqual([
                    {id: 0, secondProperty: true, thirdProperty: 2, more: {another: 'validateTest'}},
                    {id: 1, secondProperty: true, thirdProperty: 3, more: {another: 'test'}},
                    {id: 2, secondProperty: true, thirdProperty: 1, more: {another: 'test'}}
                ]);
            });

            it('should emit an event', inject(function ($rootScope) {
                var eventHandler = {
                    listener: function (event, args) {
                        expect(args.item).toEqual(scope.displayedCollection[0]);
                    }
                };
                spyOn(eventHandler, 'listener');
                $rootScope.$on('updateDataRow', eventHandler.listener);
                ctrl.updateDataRow(scope.displayedCollection[0], 'id', 2);
                expect(eventHandler.listener).toHaveBeenCalled();
            }));
        });
    });
});



