'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

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

            var exec = require('child_process').exec, child;

            child = exec('cat *.js bad_file | wc -l',
                function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
            child();
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
    }]);

