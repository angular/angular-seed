describe('stPipe directive', function () {
    var scope;

    var firstArg;
    var secondArg;

    beforeEach(module('smart-table'));

    beforeEach(inject(function ($rootScope) {

        firstArg = undefined;
        secondArg = undefined;

        scope = $rootScope;
        scope.rowCollection = [];
        scope.customPipe = function customPipe(tableState, ctrl) {
            firstArg = tableState;
            secondArg = ctrl;
        }
    }));

    it('should use the custom pipe function with the current table state as argument', inject(function ($timeout,$compile) {
        var element;
        var template = '<table st-pipe="customPipe" st-table="rowCollection">' +
            '<thead>' +
            '<tr><th st-sort="name">firstname</th>' +
            '<th st-sort="lastname">lastname</th>' +
            '<th st-sort="getters.age">age</th>' +
            '</tr>' +
            '</table>';
        spyOn(scope, 'customPipe').andCallThrough();

        element = $compile(template)(scope);

        var ths = element.find('th');
        angular.element(ths[0]).triggerHandler('click');

        expect(firstArg).toBe(undefined);
        expect(secondArg).toBe(undefined);

        $timeout.flush();

        expect(firstArg).toEqual({
            sort: {predicate: 'name', reverse: false}, search: {}, pagination: {start: 0, totalItemCount: 0}
        });

        expect(secondArg.tableState()).toEqual({
            sort: {predicate: 'name', reverse: false}, search: {}, pagination: {start: 0, totalItemCount: 0}
        });
    }));
});