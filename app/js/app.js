var F1FeederApp = angular.module('F1FeederApp', [
  'F1FeederApp.services',
  'F1FeederApp.controllers',
  'ngRoute'
]);

//Routes
F1FeederApp.config(['$routeProvider', function($routeProvider, $templateCache) {
  $routeProvider.
    when("/drivers", {
        templateUrl: "partials/drivers.html", controller: "driversController"
    }).
	when("/drivers/:id", {
        templateUrl: "partials/driver.html", controller: "driverController"
    }).
    otherwise({
        redirectTo: '/drivers'
    });
    // use the HTML5 History API
    // $locationProvider.html5Mode(true);
}]);

//F1FeederApp.run(function($templateCache) {
//    $templateCache.put('/drivers', '');
//});