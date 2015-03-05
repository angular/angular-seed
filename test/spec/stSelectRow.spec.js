describe('stSelectRow Directive', function () {

    var rootScope;
    var scope;
    var element;

    function hasClass(element, classname) {
        return Array.prototype.indexOf.call(element.classList, classname) !== -1
    }

    beforeEach(module('smart-table'));

    var stConfig;
    beforeEach(inject(function (_stConfig_) {
      stConfig = _stConfig_;
    }));

    // We need to do this here because we must compile the directive *after* configuring stConfig
    it('should select more than one row when globally configured', inject(function ($rootScope, $compile) {
        var oldMode = stConfig.select.mode;
        stConfig.select.mode = 'multiple';


        rootScope = $rootScope;
        scope = $rootScope.$new();
        rootScope.rowCollection = [
            {name: 'Renard', firstname: 'Laurent', age: 66},
            {name: 'Francoise', firstname: 'Frere', age: 99},
            {name: 'Renard', firstname: 'Olivier', age: 33},
            {name: 'Leponge', firstname: 'Bob', age: 22},
            {name: 'Faivre', firstname: 'Blandine', age: 44}
        ];

        var template = '<table st-table="rowCollection">' +
            '<tbody>' +
            '<tr st-select-row="row" ng-repeat="row in rowCollection"></tr>' +
            '</tbody>' +
            '</table>';

        element = $compile(template)(scope);

        scope.$apply();


        var trs = element.find('tr');
        expect(trs.length).toBe(5);
        angular.element(trs[3]).triggerHandler('click');
        expect(scope.rowCollection[3].isSelected).toBe(true);
        angular.element(trs[1]).triggerHandler('click');
        expect(scope.rowCollection[1].isSelected).toBe(true);
        expect(scope.rowCollection[3].isSelected).toBe(true);

        stConfig.select.mode = oldMode;
    }));

    describe('single mode', function () {
        beforeEach(inject(function ($compile, $rootScope) {

            rootScope = $rootScope;
            scope = $rootScope.$new();
            rootScope.rowCollection = [
                {name: 'Renard', firstname: 'Laurent', age: 66},
                {name: 'Francoise', firstname: 'Frere', age: 99},
                {name: 'Renard', firstname: 'Olivier', age: 33},
                {name: 'Leponge', firstname: 'Bob', age: 22},
                {name: 'Faivre', firstname: 'Blandine', age: 44}
            ];

            var template = '<table st-table="rowCollection">' +
                '<tbody>' +
                '<tr st-select-row="row" ng-repeat="row in rowCollection"></tr>' +
                '</tbody>' +
                '</table>';

            element = $compile(template)(scope);

            scope.$apply();
        }));

        it('should select one row', function () {
            var trs = element.find('tr');
            expect(trs.length).toBe(5);
            angular.element(trs[3]).triggerHandler('click');
            expect(scope.rowCollection[3].isSelected).toBe(true);
        });

        it('should select one row only by default', function () {
            var trs = element.find('tr');
            expect(trs.length).toBe(5);
            angular.element(trs[3]).triggerHandler('click');
            expect(scope.rowCollection[3].isSelected).toBe(true);
            angular.element(trs[1]).triggerHandler('click');
            expect(scope.rowCollection[1].isSelected).toBe(true);
            expect(scope.rowCollection[3].isSelected).toBe(false);
        });

        it('should update the class name when isSelected property change', function () {

            var tr = element.find('tr');
            expect(hasClass(tr[2], 'st-selected')).toBe(false);
            scope.rowCollection[2].isSelected = true;
            scope.$apply();
            expect(hasClass(tr[2], 'st-selected')).toBe(true);

            scope.rowCollection[2].isSelected = false;
            scope.$apply();
            expect(hasClass(tr[2], 'st-selected')).toBe(false);
        });

        it('should update the customized class name when isSelected property change', function () {
            var oldClass = stConfig.select.selectedClass;
            stConfig.select.selectedClass = 'custom-selected'

            var tr = element.find('tr');
            expect(hasClass(tr[2], 'custom-selected')).toBe(false);
            scope.rowCollection[2].isSelected = true;
            scope.$apply();
            expect(hasClass(tr[2], 'custom-selected')).toBe(true);

            scope.rowCollection[2].isSelected = false;
            scope.$apply();
            expect(hasClass(tr[2], 'custom-selected')).toBe(false);

            stConfig.select.selectedClass = oldClass;
        });
    });

    describe('multiple mode', function () {
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
                '<tbody>' +
                '<tr st-select-mode="multiple" st-select-row="row" ng-repeat="row in rowCollection"></tr>' +
                '</tbody>' +
                '</table>';

            element = $compile(template)(scope);

            scope.$apply();
        }));

        it('should select multiple row', function () {
            var trs = element.find('tr');
            expect(trs.length).toBe(5);
            angular.element(trs[3]).triggerHandler('click');
            expect(scope.rowCollection[3].isSelected).toBe(true);
            angular.element(trs[1]).triggerHandler('click');
            expect(scope.rowCollection[3].isSelected).toBe(true);
            expect(scope.rowCollection[1].isSelected).toBe(true);
        });
    });


});
