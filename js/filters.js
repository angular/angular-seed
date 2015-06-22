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
.filter('linkToGene', function ($window) {
      return function (uri) {
          return "#/gene/" + $window.encodeURIComponent(uri);
      };
})
.filter('linkToGenePhenotypes', function ($window) {
      return function (uri) {
          return "#/gene/" + $window.encodeURIComponent(uri) + "?tab=phenotypes";
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
.filter('modSourceLabel', function () {
    return function (uri) {
        if (uri.indexOf("http://www.informatics.jax.org/reference/summary?id=") > -1) {
            return uri.replace("http://www.informatics.jax.org/reference/summary?id=", "MGI:")
        } else if (uri.indexOf("http://zfin.org/") > -1) {
            return uri.replace("http://zfin.org/", "ZFIN:")
        } else {
            return uri;
        }
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
