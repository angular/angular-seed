'use strict';

angular.
  module('core.followers').
  factory('Followers', ['$resource',
    function($resource) {
      return $resource('https://api.github.com/users/:githubId/followers', {}, {
        query: {
          method: 'GET',
          params: {githubId: 'octocat'},
          isArray: true
        }
      });
    }
  ]);