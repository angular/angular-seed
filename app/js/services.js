'use strict';

/* Services */

var myServices = angular.module('authenticationApp.services', []);

myServices.service('globalService', ['$rootScope', function($rootScope) {
  return {
    footerShow: function(location) {
      var body = document.body;

      if (location === 'home') {
        $rootScope.footerShow = true;
        return;
      }
      if (body.scrollHeight < body.clientHeight) {
        $rootScope.footerShow = true;
        return;
      }
      if (body.scrollTop + body.clientHeight - body.scrollHeight > -30 ) {
        $rootScope.footerShow = true;
        return;
      }
      $rootScope.footerShow = false;
      return;
    }
  };
}]);