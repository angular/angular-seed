'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
    controller("TaskCtrl", ['$scope', function ($scope){

    $scope.columns = [
        {displayName : 'Title'},
        {displayName: 'Status'}
    ];


    $scope.tasks = [
        {title: "create github repo", status: "Completed"},
        {title: "fillout readme.md", status: "Not Started"},
        {title: "create treeGrid directive with minimal data", status: "In Progress"}
    ]

    $scope.buildTasks = function(count){
        var tasks = [];

        for(var i = 0; i < count; i++){
            var task = {
                title: "task " + i,
                status: "status " + i,
                health: "health code " + i,
                isCompleted: false,
                whatMomThinksAboutIt: "when are you giving me a grand child? " + i,
                whatDadThinksAboutIt: "can i take it fishing? " + i,
                custom1: "custom field 1:  " + i,
                custom2: "custom field 2:  " + i,
                custom3: "custom field 3:  " + i,
                custom4: "custom field 4:  " + i,
                custom5: "custom field 5:  " + i,
                custom6: "custom field 6:  " + i,
                custom7: "custom field 7:  " + i,
                custom8: "custom field 8:  " + i,
                custom9: "custom field 9:  " + i,
                custom10: "custom field 10:  " + i,
                custom11: "custom field 11:  " + i,
                custom12: "custom field 12:  " + i,
                custom13: "custom field 13:  " + i,
                custom14: "custom field 14:  " + i,
                custom15: "custom field 15:  " + i,
                custom16: "custom field 16:  " + i,
                custom17: "custom field 17:  " + i,
                custom18: "custom field 18:  " + i,
                custom19: "custom field 19:  " + i,
                custom20: "custom field 20:  " + i,
                custom21: "custom field 21:  " + i,
                custom22: "custom field 22:  " + i,
                custom23: "custom field 23:  " + i,
                descr: "some description of this task that everyone will want to read. soooooooooooooooooooooo interesting " + i
            }

            tasks.push(task);
        }

        return tasks;
    }

    $scope.lotsOTasks = $scope.buildTasks(100);
}]);
