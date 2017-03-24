(function () {

    var app = angular.module("airnodaApp");


    var AboutController = function ($scope, $location) {
        let AboutCTRL = this;
        AboutCTRL.love = "Roan Marcelo";
        
        AboutCTRL.testClick = function(){
            $location.path("/contact/");
        };
    };

    app.controller("AboutController", AboutController);

}());