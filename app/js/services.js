'use strict';

/* Services */

var communityServices = angular.module('communityServices', ['ngResource']);

communityServices.factory('Community', ['$resource',
  function($resource){
    return $resource('data/communities.json', {}, 
    {
      query: {method:'GET', params:{communityId:'communities'}, isArray:true}
    });
  }]);