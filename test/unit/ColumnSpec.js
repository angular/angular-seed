'use strict';

/* jasmine specs for services go here */

describe('Column Module', function () {
    beforeEach(module('SmartTable.Column', function ($provide) {
        $provide.constant('DefaultColumnConfiguration', {defaultValue: 'default', value: 'defaultValue'});
    }));


    describe('Column factory', function () {
        it('should always return an instance of Column', inject(function (Column) {
            expect(typeof Column()).toBe('object');
            expect(Column() instanceof Column).toBe(true);
            expect(typeof new Column()).toBe('object');
            expect(new Column() instanceof Column).toBe(true);
        }));

        it('should overwrite default parameters if provided in config', inject(function (Column) {
            var column = new Column();
            expect(column.defaultValue).toEqual('default');
            expect(column.value).toEqual('defaultValue');

            column = new Column({value: 'value', otherValue: 'otherValue'});
            expect(column.defaultValue).toEqual('default');
            expect(column.value).toEqual('value');
            expect(column.otherValue).toEqual('otherValue');

        }));

        it('should return an existing config property or throw an exception', inject(function (Column) {
            var column = new Column();
            expect(column.getConfigValue('defaultValue')).toEqual('default');

            try {
                column.getConfigValue('dummy');

                //we should never reach here
                expect(true).toBe(false);
            } catch (e) {
                expect(e.message).toEqual('config property ' + 'dummy' + ' does not exist');
            }
        }));
    });
});
