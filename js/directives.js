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
    };
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
    };
})
.directive('demoChart', function () {
    return {
        restrict: 'E',
        replace: false,
        link: function (scope, element, attrs) {
            var data = {
                'Myxiniformes': [3, 'http://purl.obolibrary.org/obo/VTO_0058701'],
                'Petromyzontiformes': [6, 'http://purl.obolibrary.org/obo/VTO_0058622'],
                'Agnatha': [37, 'http://purl.obolibrary.org/obo/VTO_9032758'],
                'Chondrichthyes': [177, 'http://purl.obolibrary.org/obo/VTO_0000009'],
                'Placodermi': [24, 'http://purl.obolibrary.org/obo/VTO_9012172'],
                'Acanthodii': [31, 'http://purl.obolibrary.org/obo/VTO_9011043'],
                'Actinopterygii':[3741,'http://purl.obolibrary.org/obo/VTO_0033622'],
                'Sarcopterygii':[1078,'http://purl.obolibrary.org/obo/VTO_0001464']
            };
            var phenoBlue = d3.rgb(66, 139, 202);
            var margin = {
                top: 70,
                right: 20,
                bottom: 80,
                left: 60
            },
            width = 960 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;
            
            //function that gets total annotated taxa count
            function get_total(url, callback) {
                var urlBase = 'http://kb.phenoscape.org/api/taxon/annotated_taxa_count?in_taxon=';
                var url = urlBase + url;
                $.getJSON(url, function(json) {
                    var count = json.total;
                    callback(count);
                });
            }
            
            //function for getTaxaInRank using classification
            //@parameter VTO is the url 
            function getTaxaInRank(VTO, callback) {
                var allTaxa = [];
                var urlBase = 'http://kb.phenoscape.org/api/term/classification?iri=' + VTO
                $.getJSON(urlBase, function(json) {
                    for (var i = 0; i < json.superClassOf.length; i++) {
                        var child = json.superClassOf[i]['@id'];
                        allTaxa.push(child);
                    }
                    callback(allTaxa);
                });
            }
            
            //get name of taxa using the VTO URL
            function getName(VTOurl, callback) {
                var url = 'http://kb.phenoscape.org/api/term?iri=' + VTOurl
                $.getJSON(url, function(json) {
                    callback(json.label);
                });
            }

            //@data is an object
            function getMax(data) {
                var max = 0;
                for (var key in data) {
                    if (data[key][0] > max) {
                        max = data[key][0];
                    }
                }
                return max;

            }
            
            function drawGraph(data) {
                var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1)
                .domain(d3.entries(data).map(function(d) {
                    return d.key
                }));

                var y = d3.scale.linear()
                .domain([0, getMax(data)])
                .range([height, 0]);

                var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

                var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10);

                var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return d.key + "<br/>" + "Annontated taxa count: " + d3.values(d)[1][0];
                })

                var svg = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                svg.call(tip);

                //x axis label
                svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", width / 2)
                .attr("y", height + 30)
                //.text("Taxa")

                svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis); //Creates x axis label

                svg.selectAll("text")
                .call(wrap, x.rangeBand())
                .attr("y", 0)
                .attr("x", 50)
                .attr("transform", "rotate(45)")
                .style("text-anchor", "start");

                var yLine = svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -50)
                .attr("dy", ".71em")
                .style("text-anchor", "middle")
                .text("Annotated Taxa Count");

                var bars = svg.selectAll(".bar")
                .data(d3.entries(data))
                .enter().append("rect")
                .attr("fill", phenoBlue)
                .attr("class", "bar")
                .attr("x", function(d) {
                    return x(d.key);
                })
                .attr("width", x.rangeBand())
                .attr("y", function(d) {
                    return y(d3.values(d)[1][0]);
                })
                .attr("height", function(d) {
                    return height - y(d3.values(d)[1][0]);
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)

                //update to get sub anatomies based on click
                .on('click', function(d, i) {
                    var promise = new Promise(function(resolve, reject) {
                        var dataset = [];
                        VTOurl = d3.values(d)[1][1];
                        getTaxaInRank(VTOurl, function(d) {
                            for (var i in d) { //iterate through array of subtaxa
                                get_total(d[i], function(i, total) {
                                    getName(d[i], function(name) {
                                        dataset[name] = [total, d[i]];
                                        if (Object.keys(dataset).length == d.length) {
                                            resolve(dataset); //new data to graph
                                        }
                                    })
                                }.bind(null, i));
                            }
                        })
                        setTimeout(reject.bind(null, data), 10000);
                    });

                    promise.then(function(result) {
                        removeEverything(tip);
                        //console.log(result);
                        drawGraph(result);
                    }, function(err) {
                        alert("No more descending possible")
                        removeEverything(tip);
                        drawGraph(data);
                        console.log("No more descending possible", err);
                    })

                });

            }

            /**
            Removes all elements of graph
            @tip: tooltip object
            **/
            function removeEverything(tip) {
                tip.hide()
                d3.select("svg").remove();
                d3.selectAll("tip").remove();
            }

            function wrap(text, width) {
                text.each(function() {
                    var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                    while (word = words.pop()) {
                        line.push(word);
                        tspan.text(line.join(" "));
                        if (tspan.node().getComputedTextLength() > width) {
                            line.pop();
                            tspan.text(line.join(" "));
                            line = [word];
                            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                        }
                    }
                });
            }

            var insertLinebreaks = function (t, d, width) {
                var el = d3.select(t);
                var p = d3.select(t.parentNode);
                p.append("foreignObject")
                .attr('x', -width/2)
                .attr("width", width)
                .attr("height", 200)
                .append("xhtml:p")
                .attr('style','word-wrap: break-word; text-align:center;')
                .html(d);    

                el.remove();

            };
            drawGraph(data);
        }
    };
});
