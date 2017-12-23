'use strict';

angular.module('myApp.user', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'user/user.html',
            controller: 'UserCtrl'
        });
    }])

    .controller('UserCtrl', ['$http', '$scope', function ($http, $scope) {
        $http.get('http://localhost:8080/drivers/available').then(function (result) {
            $scope.center = [19.1112551, 72.9064666];
            if(!result.data || !result.data.length){
                $scope.failed = true;
            }else {
                $scope.cars = result.data;
            }
        });

        $scope.setPosition = function (e) {
            $scope.center = [e.latLng.lat(),e.latLng.lng()];
        };

        $scope.go = function () {
            $http.post(
                'http://localhost:8080/orders/',
                {
                    position: {
                        latitude: $scope.center[0],
                        longitude: $scope.center[1]
                    },
                    customerName: $scope.name
                }
            ).then(function (result) {
                if (result.data.driver) {
                    $scope.selectedCar = result.data.driver;
                    $scope.booked = true;
                } else {
                    $scope.failed = true;
                }

            }, function () {
                $scope.failed = true;
            });
        }

    }]);