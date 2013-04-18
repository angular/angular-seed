'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
    controller("TaskCtrl", ['$scope', function ($scope){

    $scope.tasks = [
        {title: "create github repo", status: "Completed"},
        {title: "fillout readme.md", status: "Not Started"},
        {title: "create treeGrid directive with minimal data", status: "In Progress"}
    ]
}]);
