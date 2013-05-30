describe('Column Module', function () {
    beforeEach(module('smartTable.column', function ($provide) {
        $provide.constant('DefaultColumnConfiguration', {defaultValue: 'default', value: 'defaultValue'});
        $provide.provider('Column', ColumnProvider);
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
    });
});
