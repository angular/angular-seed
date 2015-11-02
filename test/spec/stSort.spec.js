describe('stSort Directive', function () {

  var rootScope;
  var scope;
  var element;
  var tableState;

  function hasClass (element, classname) {
    return Array.prototype.indexOf.call(element.classList, classname) !== -1
  }

  function trToModel (trs) {
    return Array.prototype.map.call(trs, function (ele) {
      return {
        name: ele.cells[0].innerHTML,
        firstname: ele.cells[1].innerHTML,
        age: +(ele.cells[2].innerHTML)
      };
    });
  }

  //expose table state for tests
  beforeEach(module('smart-table', function ($compileProvider) {
    $compileProvider.directive('dummy', function () {
      return {
        restrict: 'A',
        require: 'stTable',
        link: function (scope, element, attr, ctrl) {
          tableState = ctrl.tableState();
        }
      };
    });
  }));

  describe('customized stConfig', function () {

    beforeEach(inject(function ($compile, $rootScope, stConfig) {
      var oldAscentClass = stConfig.sort.ascentClass;
      var oldDescentClass = stConfig.sort.descentClass;
      var oldSkipNatural = stConfig.sort.skipNatural;
      stConfig.sort.ascentClass = 'custom-ascent';
      stConfig.sort.descentClass = 'custom-descent';
      stConfig.sort.skipNatural = true;

      rootScope = $rootScope;
      scope = $rootScope.$new();
      scope.rowCollection = [
        {name: 'Renard', firstname: 'Laurent', age: 66},
        {name: 'Francoise', firstname: 'Frere', age: 99},
        {name: 'Renard', firstname: 'Olivier', age: 33},
        {name: 'Leponge', firstname: 'Bob', age: 22},
        {name: 'Faivre', firstname: 'Blandine', age: 44}
      ];
      scope.getters = {
        age: function ageGetter (row) {
          return row.name.length;
        },
        name: function nameGetter (row) {
          return row.name.length;
        }
      };

      var template = '<table dummy="" st-table="rowCollection">' +
        '<thead>' +
        '<tr><th st-sort="name">name</th>' +
        '<th st-sort="firstname">firstname</th>' +
        '<th st-sort="getters.age">age</th>' +
        '<th st-sort="getters.name">age</th>' +
        '<th st-sort="[\'name\', \'age\']">age</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr class="test-row" ng-repeat="row in rowCollection">' +
        '<td>{{row.name}}</td>' +
        '<td>{{row.firstname}}</td>' +
        '<td>{{row.age}}</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>';

      element = $compile(template)(scope);
      scope.$apply();


      stConfig.sort.ascentClass = oldAscentClass;
      stConfig.sort.descentClass = oldDescentClass;
      stConfig.sort.skipNatural = oldSkipNatural;
    }));

    it('should customize classes for sorting', inject(function ($timeout) {
      var ths = element.find('th');
      angular.element(ths[1]).triggerHandler('click');
      $timeout.flush();
      expect(hasClass(ths[1], 'custom-ascent')).toBe(true);
      expect(hasClass(ths[1], 'custom-descent')).toBe(false);
    }));

    it('should skip natural order', inject(function ($timeout) {
      var ths = element.find('th');
      var th1 = angular.element(ths[1]);
      th1.triggerHandler('click');
      th1.triggerHandler('click');
      th1.triggerHandler('click');
      $timeout.flush();
      var actual = trToModel(element.find('tr.test-row'));
      expect(hasClass(ths[1], 'custom-ascent')).toBe(true);
      expect(hasClass(ths[1], 'custom-descent')).toBe(false);
      expect(actual).toEqual([
        {name: 'Faivre', firstname: 'Blandine', age: 44},
        {name: 'Leponge', firstname: 'Bob', age: 22},
        {name: 'Francoise', firstname: 'Frere', age: 99},
        {name: 'Renard', firstname: 'Laurent', age: 66},
        {name: 'Renard', firstname: 'Olivier', age: 33}
      ]);
    }));

    it('should sort properly with array value', inject(function ($timeout) {
      var ths = element.find('th');
      var th4 = angular.element(ths[4]);
      th4.triggerHandler('click');
      th4.triggerHandler('click');
      $timeout.flush();
      var actual = trToModel(element.find('tr.test-row'));
      expect(actual).toEqual([
        {name: 'Renard', firstname: 'Laurent', age: 66},
        {name: 'Renard', firstname: 'Olivier', age: 33},
        {name: 'Leponge', firstname: 'Bob', age: 22},
        {name: 'Francoise', firstname: 'Frere', age: 99},
        {name: 'Faivre', firstname: 'Blandine', age: 44},
      ]);
    }));

  });

  describe('normal stConfig', function () {

    beforeEach(inject(function ($compile, $rootScope) {

      rootScope = $rootScope;
      scope = $rootScope.$new();
      scope.rowCollection = [
        {name: 'Renard', firstname: 'Laurent', age: 66},
        {name: 'Francoise', firstname: 'Frere', age: 99},
        {name: 'Renard', firstname: 'Olivier', age: 33},
        {name: 'Leponge', firstname: 'Bob', age: 22},
        {name: 'Faivre', firstname: 'Blandine', age: 44}
      ];
      scope.getters = {
        age: function ageGetter (row) {
          return row.name.length;
        },
        name: function nameGetter (row) {
          return row.name.length;
        }
      };

      var template = '<table dummy="" st-table="rowCollection">' +
        '<thead>' +
        '<tr><th st-sort="name">name</th>' +
        '<th st-sort="firstname">firstname</th>' +
        '<th st-sort="getters.age">age</th>' +
        '<th st-sort="getters.name">age</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr class="test-row" ng-repeat="row in rowCollection">' +
        '<td>{{row.name}}</td>' +
        '<td>{{row.firstname}}</td>' +
        '<td>{{row.age}}</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>';

      element = $compile(template)(scope);
      scope.$apply();
    }));

    it('should sort by clicked header', inject(function ($timeout) {
      var ths = element.find('th');
      var actual;
      angular.element(ths[1]).triggerHandler('click');
      $timeout.flush();
      actual = trToModel(element.find('tr.test-row'));
      expect(hasClass(ths[1], 'st-sort-ascent')).toBe(true);
      expect(hasClass(ths[1], 'st-sort-descent')).toBe(false);
      expect(actual).toEqual([
        {name: 'Faivre', firstname: 'Blandine', age: 44},
        {name: 'Leponge', firstname: 'Bob', age: 22},
        {name: 'Francoise', firstname: 'Frere', age: 99},
        {name: 'Renard', firstname: 'Laurent', age: 66},
        {name: 'Renard', firstname: 'Olivier', age: 33}
      ]);
    }));

    it('should revert on the second click', inject(function ($timeout) {
      var ths = element.find('th');
      var actual;
      angular.element(ths[1]).triggerHandler('click');
      $timeout.flush();
      angular.element(ths[1]).triggerHandler('click');
      $timeout.flush();
      actual = trToModel(element.find('tr.test-row'));
      expect(hasClass(ths[1], 'st-sort-ascent')).toBe(false);
      expect(hasClass(ths[1], 'st-sort-descent')).toBe(true);
      expect(actual).toEqual([
        {name: 'Renard', firstname: 'Olivier', age: 33},
        {name: 'Renard', firstname: 'Laurent', age: 66},
        {name: 'Francoise', firstname: 'Frere', age: 99},
        {name: 'Leponge', firstname: 'Bob', age: 22},
        {name: 'Faivre', firstname: 'Blandine', age: 44}
      ]);
    }));

    it('should reset the sort state on the third call', inject(function ($timeout) {
      var ths = element.find('th');
      var actual;
      angular.element(ths[1]).triggerHandler('click');
      $timeout.flush();
      angular.element(ths[1]).triggerHandler('click');
      $timeout.flush();
      tableState.sort = {
        predicate: 'firstname',
        reverse: true
      };
      tableState.pagination.start = 40;
      angular.element(ths[1]).triggerHandler('click');
      $timeout.flush();
      actual = trToModel(element.find('tr.test-row'));
      expect(hasClass(ths[1], 'st-sort-ascent')).toBe(false);
      expect(hasClass(ths[1], 'st-sort-descent')).toBe(false);
      expect(actual).toEqual([
        {name: 'Renard', firstname: 'Laurent', age: 66},
        {name: 'Francoise', firstname: 'Frere', age: 99},
        {name: 'Renard', firstname: 'Olivier', age: 33},
        {name: 'Leponge', firstname: 'Bob', age: 22},
        {name: 'Faivre', firstname: 'Blandine', age: 44}
      ]);
      expect(tableState.sort).toEqual({});
      expect(tableState.pagination.start).toEqual(0);
    }));

    it('should support getter function as predicate', inject(function ($timeout) {
      var ths = element.find('th');
      var actual;
      angular.element(ths[2]).triggerHandler('click');
      $timeout.flush();
      actual = trToModel(element.find('tr.test-row'));
      expect(actual).toEqual([
        {name: 'Renard', firstname: 'Laurent', age: 66},
        {name: 'Renard', firstname: 'Olivier', age: 33},
        {name: 'Faivre', firstname: 'Blandine', age: 44},
        {name: 'Leponge', firstname: 'Bob', age: 22},
        {name: 'Francoise', firstname: 'Frere', age: 99}
      ]);
    }));

    it('should switch from getter function to the other', inject(function ($timeout) {
      var ths = element.find('th');
      var actual;
      angular.element(ths[2]).triggerHandler('click');
      $timeout.flush();
      expect(hasClass(ths[2], 'st-sort-ascent')).toBe(true);
      expect(hasClass(ths[3], 'st-sort-ascent')).toBe(false);

      angular.element(ths[3]).triggerHandler('click');
      $timeout.flush();
      expect(hasClass(ths[2], 'st-sort-ascent')).toBe(false);
      expect(hasClass(ths[3], 'st-sort-ascent')).toBe(true);
    }));

    it('should reset its class if table state has changed', inject(function ($timeout) {
      var ths = element.find('th');
      angular.element(ths[1]).triggerHandler('click');
      $timeout.flush();
      expect(hasClass(ths[1], 'st-sort-ascent')).toBe(true);

      tableState.sort = {
        predicate: 'lastname'
      };

      scope.$apply();
      expect(hasClass(ths[1], 'st-sort-ascent')).toBe(false);
      expect(hasClass(ths[1], 'st-sort-descent')).toBe(false);

    }));

    it('should sort by default a column', inject(function ($compile, $timeout) {
      var template = '<table dummy="" st-table="rowCollection">' +
        '<thead>' +
        '<tr><th st-sort="name">name</th>' +
        '<th st-sort-default="true" st-sort="firstname">firstname</th>' +
        '<th st-sort="getters.age">age</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr class="test-row" ng-repeat="row in rowCollection">' +
        '<td>{{row.name}}</td>' +
        '<td>{{row.firstname}}</td>' +
        '<td>{{row.age}}</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>';

      element = $compile(template)(scope);

      $timeout.flush();

      var ths = element.find('th');
      var actual = trToModel(element.find('tr.test-row'));
      expect(hasClass(ths[1], 'st-sort-ascent')).toBe(true);
      expect(hasClass(ths[1], 'st-sort-descent')).toBe(false);
      expect(actual).toEqual([
        {name: 'Faivre', firstname: 'Blandine', age: 44},
        {name: 'Leponge', firstname: 'Bob', age: 22},
        {name: 'Francoise', firstname: 'Frere', age: 99},
        {name: 'Renard', firstname: 'Laurent', age: 66},
        {name: 'Renard', firstname: 'Olivier', age: 33}
      ]);
    }));

    it('should evaluate st sort default and consider a falsy value', inject(function ($compile) {

      scope.column = {reverse: false};

      var template = '<table dummy="" st-table="rowCollection">' +
        '<thead>' +
        '<tr><th st-sort="name">name</th>' +
        '<th st-sort-default="column.reverse" st-sort="firstname">firstname</th>' +
        '<th st-sort="getters.age">age</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr class="test-row" ng-repeat="row in rowCollection">' +
        '<td>{{row.name}}</td>' +
        '<td>{{row.firstname}}</td>' +
        '<td>{{row.age}}</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>';

      element = $compile(template)(scope);

      scope.$apply();

      var ths = element.find('th');
      var actual = trToModel(element.find('tr.test-row'));
      expect(hasClass(ths[1], 'st-sort-ascent')).toBe(false);
      expect(hasClass(ths[1], 'st-sort-descent')).toBe(false);
      expect(actual).toEqual([
        {name: 'Renard', firstname: 'Laurent', age: 66},
        {name: 'Francoise', firstname: 'Frere', age: 99},
        {name: 'Renard', firstname: 'Olivier', age: 33},
        {name: 'Leponge', firstname: 'Bob', age: 22},
        {name: 'Faivre', firstname: 'Blandine', age: 44}
      ]);

    }));

    it('should sort by default a column in reverse mode', inject(function ($compile, $timeout) {
      var template = '<table dummy="" st-table="rowCollection">' +
        '<thead>' +
        '<tr><th st-sort="name">name</th>' +
        '<th st-sort-default="reverse" st-sort="firstname">firstname</th>' +
        '<th st-sort="getters.age">age</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr class="test-row" ng-repeat="row in rowCollection">' +
        '<td>{{row.name}}</td>' +
        '<td>{{row.firstname}}</td>' +
        '<td>{{row.age}}</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>';

      element = $compile(template)(scope);

      $timeout.flush();

      var ths = element.find('th');
      var actual = trToModel(element.find('tr.test-row'));
      expect(hasClass(ths[1], 'st-sort-ascent')).toBe(false);
      expect(hasClass(ths[1], 'st-sort-descent')).toBe(true);
      expect(actual).toEqual([
        {name: 'Renard', firstname: 'Olivier', age: 33},
        {name: 'Renard', firstname: 'Laurent', age: 66},
        {name: 'Francoise', firstname: 'Frere', age: 99},
        {name: 'Leponge', firstname: 'Bob', age: 22},
        {name: 'Faivre', firstname: 'Blandine', age: 44}
      ]);
    }));


    it('should skip natural order', inject(function ($compile, $timeout) {
      var template = '<table dummy="" st-table="rowCollection">' +
        '<thead>' +
        '<tr><th>name</th>' +
        '<th st-skip-natural="true" st-sort="firstname">firstname</th>' +
        '<th>age</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr class="test-row" ng-repeat="row in rowCollection">' +
        '<td>{{row.name}}</td>' +
        '<td>{{row.firstname}}</td>' +
        '<td>{{row.age}}</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>';

      element = $compile(template)(scope);

      scope.$apply();

      var ths = element.find('th');
      var th1 = angular.element(ths[1]);
      th1.triggerHandler('click');
      $timeout.flush();
      th1.triggerHandler('click');
      $timeout.flush();
      th1.triggerHandler('click');
      $timeout.flush();
      var actual = trToModel(element.find('tr.test-row'));
      expect(hasClass(ths[1], 'st-sort-ascent')).toBe(true);
      expect(hasClass(ths[1], 'st-sort-descent')).toBe(false);
      expect(actual).toEqual([
        {name: 'Faivre', firstname: 'Blandine', age: 44},
        {name: 'Leponge', firstname: 'Bob', age: 22},
        {name: 'Francoise', firstname: 'Frere', age: 99},
        {name: 'Renard', firstname: 'Laurent', age: 66},
        {name: 'Renard', firstname: 'Olivier', age: 33}
      ]);
    }));

  });


});
