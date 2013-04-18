'use strict';

/* Directives */
var directiveModule = angular.module('myApp.directives', []);

directiveModule.directive("treeGrid", function(){

    return {
        restrict:'E',
        replace:true,
        scope: {
            items:"="
        },
        templateUrl:'tree-grid.html',
        link: function(scope, element, attrs){
           console.log(scope.items)
        }
    }
});

directiveModule.directive('treeGridRow', function(){
    return {
        restrict:'E',
        scope:{
            item:"="
        },
        templateUrl:'tree-grid-row.html'
    };
});

directiveModule.directive('treeGridCell', function(){
    return {
        restrict:'E',
        scope:{
            field:"="
        },
        templateUrl:'tree-grid-cell.html'
    };
});