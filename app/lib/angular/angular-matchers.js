/**
 (c) Ferron Hanse 2012
 https://github.com/ferronrsmith/anuglarjs-jasmine-matchers
 Released under the MIT license
 **/


/*jslint nomen : true*/
/*jslint bitwise : true*/
/*global describe, beforeEach, inject, module, angular, document, it, expect, $, jasmine, toJson */
beforeEach(function () {
    "use strict";

    function cssMatcher(presentClasses, absentClasses) {
        return function () {
            var element = angular.element(this.actual), present = true, absent = false;

            angular.forEach(presentClasses.split(' '), function (className) {
                present = present && element.hasClass(className);
            });

            angular.forEach(absentClasses.split(' '), function (className) {
                absent = absent || element.hasClass(className);
            });

            this.message = function () {
                return "Expected to have " + presentClasses +
                    (absentClasses ? (" and not have " + absentClasses + " ") : "") +
                    " but had " + element[0].className + ".";
            };
            return present && !absent;
        };
    }

    function indexOf(array, obj) {
        var i;
        for (i = 0; i < array.length; i += 1) {
            if (obj === array[i]) {
                return i;
            }
        }
        return -1;
    }

    function hasProperty(actualValue, expectedValue) {
        if (expectedValue === undefined) {
            return actualValue !== undefined;
        }
        return actualValue === expectedValue;
    }

    function typeOf(actual, type) {
        return Object.prototype.toString.call(actual) === "[object " + type + "]";
    }

    function endsWith(haystack, needle) {
        return haystack.substr(-needle.length) === needle;
    }

    function startsWith(haystack, needle) {
        return haystack.substr(0, needle.length) === needle;
    }

    function objToArray(obj) {
        var arr = [], prop;
        for (prop in obj) {
            // $$hashKey is auto added by angular to all collection
            if (obj.hasOwnProperty(prop) && prop !== '$$hashKey') {
                arr.push(obj[prop]);
            }
        }
        return arr;
    }

    function objListToArray(obj) {
        var res = [];
        $.each(obj, function (key, value) {
            res = res.concat(objToArray(value));
        });
        return res;
    }

    // a check that allows the matchers to work with angular-scenario
    // NB: Not all matchers work with angualar-scenario and i have not done extensive testing on this
    if(this.addMatchers === undefined) {
        this.addMatchers = function(properties) {
            if (angular.scenario.matcher !== undefined && angular.isObject(properties)) {
                angular.forEach(properties, function (value, key) {
                    angular.scenario.matcher(key, value);
                });
            }
        }
    }

    this.addMatchers({
        toBeInvalid: cssMatcher('ng-invalid', 'ng-valid'),
        toBeValid: cssMatcher('ng-valid', 'ng-invalid'),
        toBeDirty: cssMatcher('ng-dirty', 'ng-pristine'),
        toBePristine: cssMatcher('ng-pristine', 'ng-dirty'),

        toEqual: function (expected) {
            if (this.actual && this.actual.$$log) {
                if (typeof expected === 'string') {
                    this.actual = this.actual.toString();
                } else {
                    this.actual = this.actual.toArray();
                }
            }
            return jasmine.Matchers.prototype.toEqual.call(this, expected);
        },

        toEqualData: function (expected) {
            return angular.equals(this.actual, expected);
        },

        toEqualError: function (message) {
            this.message = function () {
                var expected;
                if (this.actual.message && this.actual.name === 'Error') {
                    expected = angular.toJson(this.actual.message);
                } else {
                    expected = angular.toJson(this.actual);
                }
                return "Expected " + expected + " to be an Error with message " + angular.toJson(message);
            };
            return this.actual.name === 'Error' && this.actual.message === message;
        },

        toMatchError: function (messageRegexp) {
            this.message = function () {
                var expected;
                if (this.actual.message && this.actual.name === 'Error') {
                    expected = angular.toJson(this.actual.message);
                } else {
                    expected = angular.toJson(this.actual);
                }
                return "Expected " + expected + " to match an Error with message " + angular.toJson(messageRegexp);
            };
            return this.actual.name === 'Error' && messageRegexp.test(this.actual.message);
        },

        toHaveBeenCalledOnce: function () {
            if (arguments.length > 0) {
                throw new Error('toHaveBeenCalledOnce does not take arguments, use toHaveBeenCalledWith');
            }

            if (!jasmine.isSpy(this.actual)) {
                throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
            }

            this.message = function () {
                var msg = 'Expected spy ' + this.actual.identity + ' to have been called once, but was ',
                    count = this.actual.callCount;
                return [
                    count === 0 ? msg + 'never called.' : msg + 'called ' + count + ' times.',
                    msg.replace('to have', 'not to have') + 'called once.'
                ];
            };

            return this.actual.callCount === 1;
        },

        toHaveBeenCalledOnceWith: function () {
            var expectedArgs = jasmine.util.argsToArray(arguments);

            if (!jasmine.isSpy(this.actual)) {
                throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
            }

            this.message = function () {
                var result;
                if (this.actual.callCount !== 1) {
                    if (this.actual.callCount === 0) {
                        result = [
                            'Expected spy ' + this.actual.identity + ' to have been called with ' +
                                jasmine.pp(expectedArgs) + ' but it was never called.',
                            'Expected spy ' + this.actual.identity + ' not to have been called with ' +
                                jasmine.pp(expectedArgs) + ' but it was.'
                        ];
                    } else {
                        result = [
                            'Expected spy ' + this.actual.identity + ' to have been called with ' +
                                jasmine.pp(expectedArgs) + ' but it was never called.',
                            'Expected spy ' + this.actual.identity + ' not to have been called with ' +
                                jasmine.pp(expectedArgs) + ' but it was.'
                        ];
                    }
                } else {
                    result = [
                        'Expected spy ' + this.actual.identity + ' to have been called with ' +
                            jasmine.pp(expectedArgs) + ' but was called with ' + jasmine.pp(this.actual.argsForCall),
                        'Expected spy ' + this.actual.identity + ' not to have been called with ' +
                            jasmine.pp(expectedArgs) + ' but was called with ' + jasmine.pp(this.actual.argsForCall)
                    ];
                }
                return result;
            };

            return this.actual.callCount === 1 && this.env.contains_(this.actual.argsForCall, expectedArgs);
        },

        toBeOneOf: function () {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be one of '" + angular.mock.dump(arguments) + "'.";
            };
            return indexOf(arguments, this.actual) !== -1;
        },

        toHaveClass: function (clazz) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to have class '" + clazz + "'.";
            };
            return this.actual.hasClass ? this.actual.hasClass(clazz) : angular.element(this.actual).hasClass(clazz);
        },

        toHaveCss: function (css) {
            var prop; // css prop
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to have css '" + angular.mock.dump(css) + "'.";
            };
            for (prop in css) {
                if (css.hasOwnProperty(prop)) {
                    if (this.actual.css(prop) !== css[prop]) {
                        return false;
                    }
                }
            }
            return true;
        },

        toMatchRegex : function (regex) {

            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to mactch '" + regex;
            };

            var reg;
            if (typeOf(regex, "String")) {
                reg = new RegExp(regex);
            } else if (typeOf(regex, "RegExp")) {
                reg = regex;
            }
            return reg.test(this.actual);
        },
        toBeVisible: function () {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be visible '";
            };
            return this.actual.is(':visible');
        },

        toBeHidden: function () {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be hidden '";
            };
            return this.actual.is(':hidden');
        },

        toBeSelected: function () {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be selected '";
            };
            return this.actual.is(':selected');
        },

        toBeChecked: function () {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be checked '";
            };
            return this.actual.is(':checked');
        },

        toBeSameDate: function (date) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be equal to '" + angular.mock.dump(date);
            };

            var actualDate = this.actual;
            return actualDate.getDate() === date.getDate() &&
                actualDate.getFullYear() === date.getFullYear() &&
                actualDate.getMonth() === date.getMonth() &&
                actualDate.getHours() === date.getHours() &&
                actualDate.getMinutes() === date.getMinutes() &&
                actualDate.getSeconds() === date.getSeconds();
        },

        toBeEmpty: function () {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be empty '";
            };
            return this.actual.is(':empty');
        },

        toBeEmptyString: function () {
            this.message = function () {
                return "Expected string '" + angular.mock.dump(this.actual) + "' to be empty '";
            };
            return typeOf(this.actual, 'String') && $.trim(this.actual).length === 0;
        },

        toExist: function () {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be exists '";
            };
            return $(document).find(this.actual).length;
        },

        toHaveAttr: function (attributeName, expectedAttributeValue) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to have attribute '" + attributeName + "' with value "  + expectedAttributeValue + ".";
            };
            return hasProperty(this.actual.attr(attributeName), expectedAttributeValue);
        },

        toHaveProp: function (propertyName, expectedPropertyValue) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to have property '" + expectedPropertyValue + "'.";
            };
            return hasProperty(this.actual.prop(propertyName), expectedPropertyValue);
        },

        toHaveId: function (id) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to have id '" + id + "'.";
            };
            return this.actual.attr('id') === id;
        },

        toBeDisabled: function (selector) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be disabled '" + angular.mock.dump(selector) + "'.";
            };
            return this.actual.is(':disabled');
        },

        toBeFocused: function (selector) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be focused '" + angular.mock.dump(selector) + "'.";
            };
            return this.actual.is(':focus');
        },

        toHaveText: function (text) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to have text '" + text + "'.";
            };
            var trimmedText = $.trim(this.actual.text()), result;
            if (text && $.isFunction(text.test)) {
                result = text.test(trimmedText);
            } else {
                result = trimmedText === text;
            }
            return result;
        },

        toHaveValue: function (value) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to have value '" + value + "'.";
            };
            return this.actual.val() === value;
        },

        toHaveData: function (key, expectedValue) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to have data '" + expectedValue + "'.";
            };
            return hasProperty(this.actual.data(key), expectedValue);
        },

        /**
         * Does not return true if subject is null
         * @return {Boolean}
         */
        toBeObject: function () {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be an [Object]";
            };
            return typeOf(this.actual, 'Object');
        },


        /**
         * @return {Boolean}
         */
        toBeArray: function () {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be an [Array]";
            };
            return typeOf(this.actual, 'Array');
        },

        /**
         * @return {Boolean}
         */
        toBeDate: function () {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be a [Date]";
            };
            return typeOf(this.actual, 'Date');
        },

        /**
         * @return {Boolean}
         */
        toBeBefore: function (date) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be before" + angular.mock.dump(date);
            };
            return typeOf(this.actual, 'Date') && this.actual.getTime() < date.getTime();
        },

        /**
         * @return {Boolean}
         */
        toBeAfter: function (date) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be after" + angular.mock.dump(date);
            };
            return typeOf(this.actual, 'Date') && this.actual.getTime() > date.getTime();
        },

        /**
         * Asserts subject is an Array with a defined number of members
         * @param  {Number} size
         * @return {Boolean}
         */
        toBeArrayOfSize: function (size) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be an [Array] of size " + size;
            };
            return typeOf(this.actual, 'Array') && this.actual.length === size;
        },

        /**
         * @return {Boolean}
         */
        toBeString: function () {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be a [String]";
            };
            return typeOf(this.actual, 'String');
        },

        /**
         * @return {Boolean}
         */
        toBeBoolean: function () {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be Boolean";
            };
            return typeOf(this.actual, 'Boolean');
        },


        /**
         * @return {Boolean}
         */
        toBeNonEmptyString: function () {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be a non empty string ";
            };
            return typeOf(this.actual, 'String') && $.trim(this.actual).length > 0;
        },

        /**
         * @return {Boolean}
         */
        toBeNumber: function () {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be a [Number]";
            };
            return !isNaN(parseFloat(this.actual)) && !typeOf(this.actual, 'String');
        },

        toBeNaN : function () {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be a [NaN]";
            };
            return isNaN(this.actual);
        },

        /**
         * @return {Boolean}
         */
        toBeFunction: function () {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to be a [Function]";
            };
            return typeOf(this.actual, 'Function');
        },

        toHaveLength: function (length) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to have a length of " + length;
            };
            return this.actual.length === length;
        },

        toStartWith: function (value) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to start with " + value;
            };
            return startsWith(this.actual, value);
        },

        toEndWith: function (value) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to end with " + value;
            };
            return endsWith(this.actual, value);
        },

        toContainOnce: function (value) {
            this.message = function () {
                return "Expected '" + angular.mock.dump(this.actual) + "' to contain only one " + value;
            };
            var actual = this.actual, containsOnce = false, firstFoundAt;
            if (actual) {
                firstFoundAt = actual.indexOf(value);
                containsOnce = firstFoundAt !== -1 && firstFoundAt === actual.lastIndexOf(value);
            }
            return containsOnce;
        },

        /**
         * @return {boolean}
         */
        ToBeUniqueArray : function () {
            var arr = this.actual, i, j, len = this.actual.length, o = {};
            for (i = 0; i < len; i += 1) {
                for (j += 1; j < len; j += 1) {
                    if (arr[i] !== arr[j]) {
                        return false;
                    }
                }
            }

            this.message = function () {
                return "Array values is not unique";
            };

            return true;
        },

        toHaveMatchingAtrr : function (attr, obj) {
            var arr = objListToArray(obj),
                attrs = [],
                result = true,
                temp = this.actual,
                iter = 0,
                len = this.actual.length;

            // can't compare arrays of different lengths
            if (this.actual.length !== arr.length) {
                return false;
            }

            for (iter = 0; iter < len; iter += 1) {
                result &= temp.eq(iter).attr(attr) === arr[iter];
            }

            this.message = function () {
                var message;
                if (this.actual.length === arr.length) {
                    message = "Expected '" + angular.mock.dump(this.actual) + "' elements to have attributes " + angular.mock.dump(arr) + " " + angular.mock.dump(arr);
                } else {
                    message = "Can't compare obj properties of length " + arr.length + " with element collection of length " + this.actual.length;
                }
                return message;
            };

            return result;
        }

    });
});