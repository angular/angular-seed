'use strict';


var techTTApp = angular.module('TechTTApp', [
  'ngRoute',
  'communityControllers',
  'communityServices'
]);

techTTApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/communities', {
        templateUrl: 'partials/communities.html',
        controller: 'CommunityListCtrl'
      }).
      when('/community/:communityId', {
        templateUrl: 'partials/community.html',
        controller: 'CommunityDetailCtrl'
      }).
      when('/communities/getinvolved', {
        templateUrl: 'partials/getinvolved.html',
        controller: 'GetInvolvedCtrl'
      }).
      otherwise({
        redirectTo: '/communities'
      });
  }]);
  
  /*{"tt-tech": {
  "communities": [
    {
     "Phones": "",	
      "Twitter": "",	
      "Facebook": "",	
      "Web": "",
      "Instagram": "",
      "Name": "",
      "Areas": [""],
      "Country": "",
      "Town": "",
      "Email": "",
      "AdministratorContact":""
    },
    {
     "Phones": "",	
      "Twitter": "",	
      "Facebook": "",	
      "Web": "",
      "Instagram": "",
      "Name": "",
      "Areas": [""],
      "Country": "",
      "Town": "",
      "Email": "",
      "AdministratorContact":""
    },
    {
     "Phones": "",	
      "Twitter": "",	
      "Facebook": "",	
      "Web": "",
      "Instagram": "",
      "Name": "",
      "Areas": [""],
      "Country": "",
      "Town": "",
      "Email": "",
      "AdministratorContact":""
  }]}}
  */