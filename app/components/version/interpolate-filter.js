(function() {

  'use strict';

  angular
	  .module('myApp.version.interpolate-filter', [

	  ])
	  .filter('interpolate', Interpolate);

	Interpolate.$inject = ['version'];

	function Interpolate(version) {
		return function(text) {
			return String(text).replace(/\%VERSION\%/mg, version);
		};
	}

})();
