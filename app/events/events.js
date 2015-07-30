'use strict';

angular.module('hereiam.events', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/events', {
    templateUrl: 'events/events.html',
    controller: 'EventsController'
  });
}])

.controller('EventsController', [function() {

}]);