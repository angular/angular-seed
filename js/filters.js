'use strict';

/* Filters */

angular.module('pkb.filters', [])
.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
}])
.filter('encodeURI', function ($window) {
      return $window.encodeURIComponent;
})
.filter('angled', function () {
      return function (uri) {
          return "<" + uri + ">";
      };
})
.filter('linkToEntity', function ($window) {
      return function (uri) {
          return "#/entity/" + $window.encodeURIComponent(uri);
      };
})
.filter('linkToTaxon', function ($window) {
      return function (uri) {
          return "#/taxon/" + $window.encodeURIComponent(uri);
      };
})
.filter('linkToTaxonVariationProfile', function ($window) {
      return function (uri) {
          return "#/taxon/" + $window.encodeURIComponent(uri) + "?tab=variation";
      };
})
.filter('prefixedURI', function () {
      return function (text) {
          var prefixes = {
              "http://purl.obolibrary.org/obo/UBERON_": "UBERON:",
              "http://purl.obolibrary.org/obo/VTO_": "VTO:",
              "http://purl.obolibrary.org/obo/": "obo:",
              "http://purl.org/phenoscape/uuid/": "uuid:"
          }
          var match = _.find(_.keys(prefixes), function (key) {
              return (text.indexOf(key) === 0);
          });
          if (match) {
              var prefix = prefixes[match];
              return text.replace(match, prefix);
          } else {
              return text;
          }
      };
});
