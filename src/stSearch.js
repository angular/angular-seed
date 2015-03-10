ng.module('smart-table')
  .directive('stSearch', ['stConfig', '$timeout', function (stConfig, $timeout) {
    return {
      require: '^stTable',
      scope: {
        predicate: '=?stSearch'
      },
      link: function (scope, element, attr, ctrl) {
        var tableCtrl = ctrl;
        var promise = null;
        var throttle = attr.stDelay || stConfig.search.delay;

        scope.$watch('predicate', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            ctrl.tableState().search = {};
            tableCtrl.search(element[0].value || '', newValue);
          }
        });

        //table state -> view
        scope.$watch(function () {
          return ctrl.tableState().search;
        }, function (newValue, oldValue) {
          var predicateExpression = scope.predicate || '$';
          if (newValue.predicateObject && newValue.predicateObject[predicateExpression] !== element[0].value) {
            element[0].value = newValue.predicateObject[predicateExpression] || '';
          }
        }, true);

        // view -> table state
        element.bind('input', function (evt) {
          evt = evt.originalEvent || evt;
          if (promise !== null) {
            $timeout.cancel(promise);
          }
          promise = $timeout(function () {
            tableCtrl.search(evt.target.value, scope.predicate || '');
            promise = null;
          }, throttle);
        });
      }
    };
  }]);
