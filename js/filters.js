'use strict';

/* Filters */

angular.module('pkb.filters', [])
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
.filter('isEntity', function ($window) {
      return function (uri) {
          return uri.indexOf("http://purl.obolibrary.org/obo/UBERON_") > -1;
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
.filter('linkToStudy', function ($window) {
    return function (uri) {
        return "#/study/" + $window.encodeURIComponent(uri);
    };
})
.filter('linkToStudyTaxaDownload', function ($window) {
    return function (uri) {
        return "http://kb.phenoscape.org/api/study/taxa?limit=0&iri=" + $window.encodeURIComponent(uri);
    };
})
.filter('linkToStudyPhenotypesDownload', function ($window) {
    return function (uri) {
        return "http://kb.phenoscape.org/api/study/phenotypes?limit=0&iri=" + $window.encodeURIComponent(uri);
    };
})
.filter('linkToStudyNexmlDownload', function ($window) {
    return function (uri) {
        return "http://kb.phenoscape.org/api/study/matrix?iri=" + $window.encodeURIComponent(uri);
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
.filter('linkToTaxonPhenotypeProfile', function ($window, OMN) {
      return function (params) {
          var urlParams = ["tab=phenotypes"];
          if (params.entity) {
              urlParams.push("phenotypes.entity=" + $window.encodeURIComponent(params.entity['@id']));
          }
          if (params.quality) {
              urlParams.push("phenotypes.quality=" + $window.encodeURIComponent(params.quality['@id']));
          }
          return "#/taxon/" + $window.encodeURIComponent(params.taxon['@id']) + "?" + urlParams.join("&");
      };
})
.filter('linkToTaxonPresencePhenotypeProfile', function ($window) {
        return function (params) {
            var urlParams = ["tab=phenotypes",
            "phenotypes.quality_type=entailing-presence",
            "phenotypes.entity=" + $window.encodeURIComponent(params.entity['@id'])];
            return "#/taxon/" + $window.encodeURIComponent(params.taxon['@id']) + "?" + urlParams.join("&");
        };
})
.filter('linkToTaxonAbsencePhenotypeProfile', function ($window) {
        return function (params) {
            var urlParams = ["tab=phenotypes",
            "phenotypes.quality_type=entailing-absence",
            "phenotypes.entity=" + $window.encodeURIComponent(params.entity['@id'])];
            return "#/taxon/" + $window.encodeURIComponent(params.taxon['@id']) + "?" + urlParams.join("&");
        };
})
.filter('linkToTaxonPhenotypeProfileDownload', function ($window, OMN) {
    return function (params) {
        var url = "http://kb.phenoscape.org/api/taxon/phenotypes?";
        var urlParams = ["limit=0"];
        if (params.entity) {
            urlParams.push("entity=" + $window.encodeURIComponent(OMN.angled(params.entity['@id'])));
        }
        if (params.quality) {
            urlParams.push("quality=" + $window.encodeURIComponent(OMN.angled(params.quality['@id'])));
        }
        if (params.taxon) {
            urlParams.push("taxon=" + $window.encodeURIComponent(params.taxon['@id']));
        }
        return url + urlParams.join("&");
    };
})
.filter('linkToTaxaWithPhenotypeDownload', function ($window, OMN) {
    return function (params) {
        var url = "http://kb.phenoscape.org/api/taxon/with_phenotype?";
        var urlParams = ["limit=0"];
        if (params.entity) {
            urlParams.push("entity=" + $window.encodeURIComponent(OMN.angled(params.entity['@id'])));
        }
        if (params.quality) {
            urlParams.push("quality=" + $window.encodeURIComponent(OMN.angled(params.quality['@id'])));
        }
        if (params.in_taxon) {
            urlParams.push("in_taxon=" + $window.encodeURIComponent(params.in_taxon['@id']));
        }
        return url + urlParams.join("&");
    };
})
.filter('modSourceLabel', function () {
    return function (uri) {
        if (uri.indexOf("http://www.informatics.jax.org/reference/summary?id=") > -1) {
            return uri.replace("http://www.informatics.jax.org/reference/summary?id=", "MGI:");
        } else if (uri.indexOf("http://zfin.org/") > -1) {
            return uri.replace("http://zfin.org/", "ZFIN:");
        } else if (uri.indexOf("http://www.xenbase.org/common/ViewImageActionNonAdmin.do?imageId=") > -1) {
            return uri.replace("http://www.xenbase.org/common/ViewImageActionNonAdmin.do?imageId=", "Xenbase:");
        } else {
            return uri;
        }
    };
})
.filter('geneIDToImage', function () {
    return function (uri) {
        if (uri.indexOf("http://www.informatics.jax.org") > -1) {
            return "http://phylopic.org/assets/images/submissions/6b2b98f6-f879-445f-9ac2-2c2563157025.64.png";
        } else if (uri.indexOf("http://zfin.org/") > -1) {
            return "http://phylopic.org/assets/images/submissions/199829d3-183a-4eb3-a35a-a8705d28cb56.64.png";
        } else if (uri.indexOf("http://www.xenbase.org/") > -1) {
            return "http://phylopic.org/assets/images/submissions/cd0f49a1-4adf-448e-859c-b703a73b9481.64.png";
        } else if (uri.indexOf("http://www.ncbi.nlm.nih.gov") > -1) {
            return "http://phylopic.org/assets/images/submissions/a9f4ebd5-53d7-4de9-9e66-85ff6c2d513e.64.png";
        } else {
            return "";
        }
    };
})
.filter('prefixedURI', function () {
      return function (text) {
          var prefixes = {
              "http://purl.obolibrary.org/obo/UBERON_": "UBERON:",
              "http://purl.obolibrary.org/obo/VTO_": "VTO:",
              "http://zfin.org/": "ZFIN:",
              "http://www.informatics.jax.org/marker/MGI:": "MGI:",
              "http://xenbase.org/": "Xenbase:",
              "http://www.ncbi.nlm.nih.gov/gene/": "NCBI:gene:",
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
