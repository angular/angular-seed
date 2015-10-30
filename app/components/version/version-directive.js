(function() {
  'use strict';

  angular
    .module('myApp.version.version-directive', [

    ])
    .directive('appVersion', AppVersion);

  AppVersion.$inject = ['version'];

  function AppVersion(version) {
    return {
      link: link
    };

    function link(scope, element, attrs) {
      element.text(version);
    }
  }
})();
