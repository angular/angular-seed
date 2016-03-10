'use strict';

/* Directives */


angular.module('pkb.directives', [])
.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
}])
.directive('commonGroup', function () {
    return {
        require: 'ngModel',
        restrict: 'E',
        controller: 'CommonGroupController',
        templateUrl: 'partials/common_group.html',
        scope: {
            taxon: '='
        }
    }
})
.directive('taxonName', function () {
    return {
        require: 'ngModel',
        restrict: 'E',
        controller: 'TaxonNameController',
        templateUrl: 'partials/taxon_name.html',
        scope: {
            iri: '='
        }
    }
})
.directive('termName', function () {
    return {
        require: 'ngModel',
        restrict: 'E',
        controller: 'TermNameController',
        templateUrl: 'partials/term_name.html',
        scope: {
            iri: '='
        }
    }
})
.directive('characterDescriptionAnnotation', function () {
    return {
        require: 'ngModel',
        restrict: 'E',
        controller: 'CharacterDescriptionAnnotationController',
        templateUrl: 'partials/character_description_annotation.html',
        scope: {
            iri: '='
        }
    }
})
.directive('countedPhenotypesForTaxon', function () {
    return {
        require: 'ngModel',
        restrict: 'E',
        controller: 'CountedPhenotypesForTaxonController',
        templateUrl: 'partials/count.html',
        scope: {
            taxon: '=',
            entity: '=',
            quality: '='
        }
    }
})
.directive('countedPresenceOrAbsenceForTaxon', function () {
    return {
        require: 'ngModel',
        restrict: 'E',
        controller: 'CountedPresenceOrAbsenceForTaxonController',
        templateUrl: 'partials/count.html',
        scope: {
            taxon: '=',
            entity: '=',
            kind: '@'
        }
    }
})
.directive('termSearchList', function () {
    return {
        require: 'ngModel',
        restrict: 'E',
        templateUrl: 'partials/term_search_list.html',
        scope: {
            terms: '=',
            query: '=',
            placeholder: '@'
        }
    }
})
.directive('queryPanel', function () {
    return {
        restrict: 'E',
        controller: 'QueryPanelController',
        templateUrl: 'partials/query_panel.html',
        scope: {
            parameters: '=',
            applyQuery: '=',
            configuration: '@',
            options: '='
        }
    }
})
.directive('geneSimilarityView', function () {
    return {
        restrict: 'E',
        controller: 'SimilarityViewController',
        templateUrl: 'partials/similarity_view.html',
        scope: {
            subject: '=',
            corpusGraph: '@',
            queryGraph: '@'
        }
    }
})
.directive('taxonSimilarityView', function () {
    return {
        restrict: 'E',
        controller: 'SimilarityViewController',
        templateUrl: 'partials/taxon_similarity_view.html',
        scope: {
            subject: '=',
            corpusGraph: '@',
            queryGraph: '@'
        }
    }
})
.directive('annotatedText', function ($compile, $sce) {
    var link = function(scope, element, attrs) {
        var render = function() {
            scope.popups = [];
            var html = jQuery('<div>' + scope.content + '</div>');
            html.find('.sciCrunchAnnotation').each(function (i, el) {
                var annotations = jQuery(el).data('scigraph').split('|');
                var prefixes = [];
                var links = _.map(annotations, function (annotation) {
                    var components = annotation.split(",")
                    var label = components[0];
                    var termID = components[1];
                    var prefix = termID.split(":")[0];
                    prefixes.push(prefix);
                   return '<p><a class="annotation-link annotation-prefix-' + prefix + '" target="_blank" href="http://purl.obolibrary.org/obo/' + termID.replace(':', '_') + '">' + label + '</a><span class="annotation-termid">' + termID + '</span</p>';
                });
                var uniquePrefixes = _.uniq(prefixes);
                if (uniquePrefixes.length == 1) {
                    jQuery(el).addClass('annotation-prefix-' + uniquePrefixes[0]);
                } else {
                    jQuery(el).addClass('annotation-prefix-multiple');
                }
                scope.popups.push($sce.trustAsHtml(links.join(' ')));
                jQuery(el).attr('uib-popover-html', 'popups[' + i + ']');
                jQuery(el).attr('popover-trigger', 'focus');
                jQuery(el).attr('tabindex', '0');
                $compile(el)(scope);
            });
            element.html(html);
        };
        scope.$watch('content', function(newValue, oldValue) {
          render();
        });
        render();
      };
    return {
        restrict: 'E',
        link: link,
        scope: {
            content: '='
        }
    }
})
.directive('classification', function () {
    return {
        restrict: 'E',
        controller: 'ClassificationController',
        templateUrl: 'partials/classification.html',
        scope: {
            iri: '=',
            definedBy: '@',
            linkFilter: '@'
        }
    }
})
.directive('taxonClassification', function () {
    return {
        restrict: 'E',
        controller: 'ClassificationController',
        templateUrl: 'partials/taxon_classification.html',
        scope: {
            iri: '=',
            definedBy: '@',
            linkFilter: '@'
        }
    }
});
