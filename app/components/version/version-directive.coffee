'use strict'

angular.module 'myApp.version.version-directive', []

.directive 'appVersion', [
  'version'
  (version) ->
    (scope, elm, attrs) ->
      elm.text version
]
