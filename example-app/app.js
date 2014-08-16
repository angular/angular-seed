(function (ng) {
    'use strict';

    ng.module('myApp', ['smart-table'])
        .controller('mainCtrl', ['$scope', '$filter', '$timeout', function mainController($scope, $filter, $timeout) {
            $scope.greetings = 'hello world';

            $scope.rowCollection = [
                {name: 'Renard', firstname: 'v'},
                {name: 'Raymond', firstname: 'blah'},
                {name: 'Bob', firstname: 'sdfa'},
                {name: 'Arthur', firstname: 'ip'},
                {name: 'Bla', firstname: 'zrr'},
                {name: 'Xav', firstname: 'ribo'},
                {name: 'Git', firstname: 'adios'},
                {name: 'Zut', firstname: 'Laurent'}
            ];

            $scope.clickHandler = function () {
                $timeout(function () {
                    $scope.rowCollection=$scope.rowCollection.concat([{name:'dude', firstname:'what'}]);
                }, 1000)
            };

            $scope.edit = function (item) {
                var index = $scope.rowCollection.indexOf(item);
                if (index !== -1) {
                    $scope.rowCollection.splice(index, 1);
                }
            };


            $scope.getters = {
                firstname: function getter(value) {
                    return value.firstname.length;
                }};


        }]);

})(angular);
