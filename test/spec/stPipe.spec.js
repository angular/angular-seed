describe('stPipe directive', function () {
    var scope;

    beforeEach(module('smart-table'));

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope;
        scope.rowCollection = [];
        scope.customPipe = function customPipe() {

        }
    }));

    it('should use the custom pipe function with the current table state as argument', inject(function ($compile) {
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

        expect(scope.customPipe).toHaveBeenCalledWith({
            sort: { predicate: 'name', reverse: false }, search: {  }, pagination: { start: 0 }
        });
    }));
});