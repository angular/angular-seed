'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.controller('ApplicationController', function ($scope,$cookieStore,
                                               USER_ROLES,
                                               AuthService) {
  $scope.currentUser = $cookieStore.get('user');
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;

  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
    $cookieStore.put('user',user);
  };
})
        .controller('HomeCtrl', ['$scope', function($scope) {

    }]).controller('EditorCtrl', ['$scope', function($scope) {
        var iFrame = document.getElementById("graph");
        $scope.create = function() {

        }
        $scope.open = function() {
            alert("open");
        }
        $scope.addNode = function() {
             iFrame.contentWindow.addNode();
        }
        $scope.addLink = function() {
            iFrame.contentWindow.addLink();
        }
        $scope.dell = function() {
            iFrame.contentWindow.delete_node_link();
        }
         $scope.clearSpace = function() {
            iFrame.contentWindow.clearSpace();
        }
        $scope.save = function() {
            iFrame.contentWindow.save();
        }

        $scope.send = function() {
            console.log("send");


        }

        $scope.getHeight = function() {
            return window.innerHeight - 100;
        }

    }])
        .controller('NavBarCtrl', ['$scope', '$location', function($scope, $location) {
        $scope.isActive = function(viewLocation) {
            var active = (viewLocation === $location.path());
            return active;
        };
    }])
    .controller('TasksCtrl', ['$scope', '$location', function($scope, $location) {

    }])
    .controller('MonitorCtrl', ['$scope', '$location', function($scope, $location) {

    }])
    .controller('RegistrationCtrl',  function($scope,md5, RegistrationService) {
        $scope.user = {
            name:'',
            email:'',
            login: '',
            password: ''
        };
        $scope.registration = function (user) {
            user.password=md5.createHash(user.password);
            RegistrationService.registration(user).then(function (user) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $scope.setCurrentUser(user);
            }, function () {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                alert("Login or password are incorrect");
            });
        };
    })
    .controller('LoginController', function ($scope, $rootScope,md5, AUTH_EVENTS, AuthService) {
        $scope.credentials = {
            login: '',
            password: ''
        };
        $scope.login = function (credentials) {
            credentials.password=md5.createHash(credentials.password);
            AuthService.login(credentials).then(function (user) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $scope.setCurrentUser(user);
            }, function () {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                alert("Login or password are incorrect");
            });
        };
    });

