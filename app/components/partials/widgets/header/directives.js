'use strict';

angular.module('headerDirective', [])
    .directive('header', function($rootScope){
      return {
        restrict: 'E',
        templateUrl: 'components/partials/widgets/header/header.html'
      }
    });