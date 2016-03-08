'use strict';

angular.module('destinationCardDirectives', [])
    .directive('destinationCardList', function($rootScope){
      return {
        restrict: 'E',
        templateUrl: 'components/partials/widgets/destination-card/destination-card.html'
      }
    });