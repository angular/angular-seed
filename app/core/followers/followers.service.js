'use strict';

angular.
  module('core.followers').
  factory('Followers', ['$resource',
    function($resource) {
      //return $resource('https://api.github.com/users/:githubId/followers', {}, {
      return $resource('http://localhost:3000/github/followers?username=:githubId', {}, {
        query: {
          method: 'GET',
          params: {githubId: 'octocat'},
          isArray: true
        }
      });
    }
  ]);