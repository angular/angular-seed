'use strict';

/* Directives */
var directiveModule = angular.module('myApp.directives', []);

directiveModule.directive('ngFocus', ['$parse', function($parse) {
    return function(scope, element, attr) {
        var fn = $parse(attr['ngFocus']);
        element.bind('focus', function(event) {
            scope.$apply(function() {
                fn(scope, {$event:event});
            });
        });
    }
}]);

directiveModule.directive('ngBlur', ['$parse', function($parse) {
    return function(scope, element, attr) {
        var fn = $parse(attr['ngBlur']);
        element.bind('blur', function(event) {
            scope.$apply(function() {
                fn(scope, {$event:event});
            });
        });
    }
}]);

directiveModule.directive("treeGrid", function(){
    return {
        restrict:'E',
        replace:true,
        scope: {
            items:"=",
            columns:"="
        },
        templateUrl:'tree-grid.html',
        link: function(scope, element, attrs){
           console.log(scope.items)
        }
    }
});

directiveModule.directive('treeGridHeaderRow', function(){
    return {
        restrict:'E',
        replace:'true',
        scope:{
            columns:"="
        },
        templateUrl:'tree-grid-header-row.html'
    };

});

directiveModule.directive('treeGridHeaderCell', function(){
    return {
        restrict:'E',
        replace:'true',
        scope:{
            column:"="
        },
        templateUrl:'tree-grid-header-cell.html'
    };
});

directiveModule.directive('treeGridRow', function(){
    return {
        restrict:'E',
        replace:'true',
        scope:{
            item:"="
        },
        templateUrl:'tree-grid-row.html'
    };
});

directiveModule.directive('treeGridCell', function(){

    return {
        restrict:'E',
        replace:'true',
        scope:{
            field:"@"
        },
        templateUrl:'tree-grid-cell.html',

        link: function(scope, element){

            scope.shouldShow = false;

            scope.handleClick = function(event){
                scope.shouldShow = true;
            };

            scope.showInput = function(){
                return scope.shouldShow;
            };

            scope.blurInput = function(e){
               scope.shouldShow = false;
            }

        }
    };
});