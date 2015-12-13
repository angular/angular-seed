'use strict'

angular.module 'myApp.version.interpolate-filter', []

.filter 'interpolate', [
  'version'
  (version) ->
    (text) ->
      String(text).replace /\%VERSION\%/mg, version
]
