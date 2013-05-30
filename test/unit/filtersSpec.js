describe('filter', function () {

    beforeEach(module('smartTable.filters'));

    describe('format filter', function () {

        var
            filter,
            format,
            input,
            parameter;

        beforeEach(inject(function ($injector) {
            filter = $injector.get('$filter');
            format = filter('format');
        }));

        afterEach(function () {
            input = '';
            parameter = '';
        });

        it('should define format', function () {
            expect(format).toBeDefined();
        });

        it('should return the input value', function () {
            input = 'input';
            expect(format(input)).toEqual(input);
        });

        it('should behave like date filter', function () {
            input = new Date('2013/04/20');
            expect(format(input, 'date', parameter)).toEqual(filter('date')(input, parameter));
            parameter = 'MMMM';
            expect(format(input, 'date', parameter)).toEqual(filter('date')(input, parameter));
        });

        it('should behave like currency filter', function () {
            input = 2000;
            expect(format(input, 'currency', parameter)).toEqual(filter('currency')(input, parameter));
            parameter = '$';
            expect(format(input, 'currency', parameter)).toEqual(filter('currency')(input), parameter);
        });

        it('should behave like json filter', function () {
            input = {prop: 'value'};
            expect(format(input, 'json')).toEqual(filter('json')(input));
        });

        it('should behave like lowercase filter', function () {
            input = 'SldsrRS';
            expect(format(input, 'lowercase', parameter)).toEqual(filter('lowercase')(input, parameter));
        });

        it('should behave like uppercase filter', function () {
            input = 'SldsrRS';
            expect(format(input, 'uppercase', parameter)).toEqual(filter('uppercase')(input, parameter));
        });

        it('should behave like number filter', function () {
            input = 3434.34343;
            expect(format(input, 'number', parameter)).toEqual(filter('number')(input, parameter));
            parameter = 2;
            expect(format(input, 'number', parameter)).toEqual(filter('number')(input, parameter));
        });

        it('should use the provided function', function () {
            //will return the nth letter for example (dummy impl : no check on parameters etc)
            var customFunction = function (value, parameter) {
                return value[parameter - 1];
            };
            input = 'abcdefghij';
            expect(format(input, customFunction, 2)).toEqual('b');
            expect(format(input, customFunction, 3)).toEqual('c');
        })
    });
});
