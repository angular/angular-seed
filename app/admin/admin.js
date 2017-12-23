'use strict';

angular.module('myApp.admin', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/admin', {
            templateUrl: 'admin/admin.html',
            controller: 'AdminCtrl'
        });
    }])

    .controller('AdminCtrl', ['$http', '$scope', function ($http, $scope) {
        $scope.init = function () {
            $http.get('http://localhost:8080/drivers/').then(function (result) {
                $scope.center = [19.1112551, 72.9064666];
                if (!result.data || !result.data.length) {
                    $scope.failed = true;
                } else {
                    $scope.cars = result.data;
                }
            });
        };
        $scope.init();

        $scope.clear = function () {
            $http.delete('http://localhost:8080/orders/').then($scope.init);
        }
    }]);