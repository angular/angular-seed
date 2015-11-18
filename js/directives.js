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
.directive('similarityView', function () {
    return {
        restrict: 'E',
        controller: 'SimilarityViewController',
        templateUrl: 'partials/similarity_view.html',
        scope: {
            gene: '='
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
                var links = _.map(annotations, function (annotation) {
                    var components = annotation.split(",")
                    var label = components[0];
                    var termID = components[1];
                   return '<p><a class="annotation-link" target="_blank" href="http://purl.obolibrary.org/obo/' + termID.replace(':', '_') + '">' + label + '</a><span class="annotation-termid">' + termID + '</span</p>';
                });
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
            linkFilter: '@'
        }
    }
});
