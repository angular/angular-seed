'use strict';
/**
*/
angular.module('swd.inspector-gadget', []);

angular.module('swd.inspector-gadget')
  .service('intPopover', function() {
    this.bootstrap = function(elm, config) {
      elm.popover(config);
      return {
        show: function() {
          elm.popover('show');
        },
        hide: function() {
          elm.popover('hide');
        }
      };
    };

  });


angular.module('swd.inspector-gadget')
  .directive('inspectorGadget', function($compile, $document, intPopover, $timeout) {
      var doc = $document[0];

      var rootNode = function(elm) {
        return angular.element(elm.parentsUntil().slice(-1)[0]);
      };

      // some helpers
      var tagHtml = function(childElm, tag) {
        if (tag) {
          var tagDiv = doc.createElement('div');
          tagDiv.setAttribute('data-inspector-gadget-tag', tag);
          tagDiv.setAttribute('style', 'display: none');
          childElm.appendChild(tagDiv);
        }
        var childHtml = childElm.innerHTML;
        return childHtml;
      };

      var collectPopoverAttrArgs = function(attrs) {
        var bootstrArgs = {};
        angular.forEach(attrs, function(attrValue, attrName) {
          // only allow certain attributes
          if (attrName === 'placement' || attrName === 'animation' ||
              attrName === 'delay' || attrName === 'container' ||
              attrName === 'viewport') {
            bootstrArgs[attrName] = attrValue;
          }
        });
        return bootstrArgs;
      };

      var getPopoverContainer = function(rootNode, popoverId) {
        var elm = rootNode.find('div[data-inspector-gadget-tag="' + popoverId + '"]');
        var popover = elm.parent().parent();
        return popover;
      };

      var uniqueDirective = 1;

      var link = function(scope, element, attrs) {
        var anchoredDiv = element.find('.popover-anchor');
        var root = rootNode(anchoredDiv);

        var myPopoverId = scope._insp.popoverId;
        var titleHtml = scope._insp.titleHtml;
        var contentHtml = scope._insp.contentHtml;

        var popConfig = collectPopoverAttrArgs(attrs);
        var timeout = 500;
        if (attrs.hasOwnProperty('timeout')) {
          timeout = parseInt(attrs.timeout, 10);
        }

        var popControl = null;

        var hidePromise = null;
        
        popConfig.html = true;
        popConfig.title = function() {
          return titleHtml;
        };
        popConfig.content = function() {
          return contentHtml;
        };
        popConfig.trigger = 'manual';

        var rendered;

        var isPopOpen = function(root, myPopoverId) {
          return getPopoverContainer(root, myPopoverId).length > 0;
        };

        var hide = function() {
          popControl.hide();
        };

        anchoredDiv.mouseenter(function() {
          // trigger hover event, open popover, link btn to modal
          $timeout.cancel(hidePromise);
          if (!isPopOpen(root, myPopoverId)) {
            rendered = false;
            popControl.show();
            // TODO remaining problem -- this compiles 
            var popCont = getPopoverContainer(root, myPopoverId);
            popCont.mouseenter(function() {
              $timeout.cancel(hidePromise);
            });
            popCont.mouseleave(function() {
              $timeout.cancel(hidePromise);
              hidePromise = $timeout(function() {
                hide();
              }, timeout);
            });

            $compile(popCont.contents())(scope);
            scope.$apply();
          }
        });
        anchoredDiv.on('shown.bs.popover', function() {
          rendered = true;
        });
        anchoredDiv.mouseleave(function() {
          $timeout.cancel(hidePromise);
          hidePromise = $timeout(function() {
            hide();
          }, timeout);
        });
        popControl = intPopover.bootstrap(anchoredDiv, popConfig);
        
      };
      return {
        restrict: 'E',
        transclude: true,
        //template: '<div ng-transclude></div>',

        compile: function(elem, attrs, transclude) {
          return function(scope, /*out*/lElem /*out lAttrs*/) {
            var childScope = scope.$new();
            transclude(childScope, function(clone, innerScope) {
              innerScope._insp = {};
              var div = angular.element('<div class="popover-anchor"></div>');
              angular.forEach(clone, function(c) {
                if (c.nodeType !== 1 || (c.tagName !== 'INSPECTOR-TITLE' && c.tagName !== 'INSPECTOR-CONTENT')) {
                  div.append(c);
                }
                else if (c.nodeType === 1 && c.tagName === 'INSPECTOR-CONTENT') {
                  innerScope._insp.contentHtml = c.innerHTML;
                }
                else if (c.nodeType === 1 && c.tagName === 'INSPECTOR-TITLE') {
                  var myPopoverId = uniqueDirective++;
                  innerScope._insp.popoverId = myPopoverId;
                  innerScope._insp.titleHtml = tagHtml(c, myPopoverId);
                }
              });
              lElem.append(div);
            });
            link(childScope, angular.element(lElem[0]), attrs);
          };
        },
      };
    });

angular.module('swd.inspector-gadget')
  .directive('inspectorContent', function() {
    return {
      require: '^inspectorGadget',
      restrict: 'E',
      terminal: true, // prevent compilation of my content, for later compilation
      priority: 1000
    };
  });


angular.module('swd.inspector-gadget')
  .directive('inspectorTitle', function() {
    return {
      require: '^inspectorGadget',
      restrict: 'E',
      terminal: true, // prevent compilation of my content, for later compilation
      priority: 1000
    };
  });


