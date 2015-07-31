'use strict';

angular.module('hereiam.version', [
  'hereiam.version.interpolate-filter',
  'hereiam.version.version-directive'
])

.value('version', '0.1');
