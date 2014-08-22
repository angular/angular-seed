'use strict';

/* Providers */

angular.module('myApp.providers', [])
  .provider('Information', function () {
    function Information (about) {
      this._about = about;

      this.about = function (about) {
        if (about) this._about = about;

        return this._about;
      };
    };

    var aboutInformation = '';
    this.setupInformation = function (about) {
      aboutInformation = about;
    };

    this.$get = function () {
      return new Information(aboutInformation);
    };
  });