(function () {

    var app = angular.module("airnodaApp", ["ngRoute"]);

    app.config(function ($routeProvider, $locationProvider) {
        
        $locationProvider.html5Mode(true).hashPrefix('!');
        
        $routeProvider
            .when("/about", {
                templateUrl: "components/about/About.html",
                controller: "AboutController",
                controllerAs: "aboutCtrl"
            })
            .when("/contact", {
                templateUrl: "components/contact/ContactMe.html",
                controller: "ContactController",
                controllerAs: "contactCtrl"
            })
            .otherwise({
                redirectTo: "/about"
            });
        
    });

}());