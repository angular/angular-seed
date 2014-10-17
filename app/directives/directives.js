/*global angular, paper, setInterval*/
(function () {
    'use strict';

    /* Directives */
    var directives = angular.module('mainModule.directives', []);

    directives.directive('canvasHomepage', ['homepageNavigation', function (Navigation) {
        return function (scope, elm, attrs) {
            var nav = new Navigation(elm[0]);
        };
    }]);
})();
