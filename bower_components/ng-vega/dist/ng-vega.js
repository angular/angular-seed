// Define module using Universal Module Definition pattern
// https://github.com/umdjs/umd/blob/master/returnExports.js

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // Support AMD. Register as an anonymous module.
    define(['angular', 'vega'], factory);
  }
  else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('angular'), require('vega'));
  }
  else {
    // Just define it in angular and done
    factory(root.angular, root.vg);
  }
}(this, function (angular, vg) {
  //---------------------------------------------------
  // BEGIN code for this module
  //---------------------------------------------------

  function debounce(func, wait) {
    var timeout;

    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      // return caller for chaining
      return context;
    };
  }

  return angular.module('ngVega', [])
    .directive('vega', function() {
      return {
        restrict: 'AE',
        scope: {
          spec: '=',
          data: '=vegaData',
          renderer: '=vegaRenderer'
        },
        link: function(scope, elements, attrs) {
          var element = elements[0];
          var view;
          var processedData;

          function parse(){
            vg.parse.spec(scope.spec, function(chart) {
              view = chart({
                el: element,
                data: processedData,
                renderer: scope.renderer || 'svg'
              }).update();
            });
          }

          var debouncedParse = debounce(parse, 50);

          scope.$watch('spec', debouncedParse, true);

          scope.$watch('data', function(data){
            processedData = {};

            if(angular.isDefined(data)){
              Object.keys(data).forEach(function(key){
                var value = data[key];
                processedData[key] = angular.isFunction(value) ? value : function(dat){
                  dat.remove(function(d){return true;})
                    .insert(value);
                };
              });
            }

            if(view){
              view.data(processedData).update();
            }
            else{
              debouncedParse();
            }
          }, true);

          scope.$watch('renderer', function(renderer){
            if(view){
              view.renderer(renderer).update();
            }
            else{
              debouncedParse();
            }
          });
        }
      };
    });

  //---------------------------------------------------
  // END code for this module
  //---------------------------------------------------
}));