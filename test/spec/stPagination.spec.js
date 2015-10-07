if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP    = function() {},
      fBound  = function() {
        return fToBind.apply(this instanceof fNOP
            ? this
            : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments)));
      };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

describe('stPagination directive', function () {

  var controllerMock = {
    tableState: function () {
      return tableState
    },

    slice: function (start, number) {
      tableState.pagination.start = start;
      tableState.pagination.number = number;
    }
  };

  function ControllerMock() {
    this.tableState = controllerMock.tableState;
    this.slice = controllerMock.slice;
  }

  var tableState = {
    sort: {},
    search: {},
    pagination: {start: 0, totalItemCount: 0}
  };
  var compile;

  function getPages() {
    return Array.prototype.map.call(element.find('LI'), function (val) {
      return angular.element(val);
    });
  }


  function hasClass(element, classname) {
    return Array.prototype.indexOf.call(element.classList, classname) !== -1
  }

  var rootScope;
  var element;
  var stConfig;

  beforeEach(module('smart-table', function ($controllerProvider) {
    $controllerProvider.register('stTableController', ControllerMock);
  }));

  beforeEach(inject(function ($compile, $rootScope, _stConfig_) {
    compile = $compile;
    rootScope = $rootScope;
    stConfig = _stConfig_;

    rootScope.rowCollection = [
      {name: 'Renard', firstname: 'Laurent', age: 66},
      {name: 'Francoise', firstname: 'Frere', age: 99},
      {name: 'Renard', firstname: 'Olivier', age: 33},
      {name: 'Leponge', firstname: 'Bob', age: 22},
      {name: 'Faivre', firstname: 'Blandine', age: 44}
    ];
  }));

  describe('init', function () {
    it('should call for the first page on init', function () {
      spyOn(controllerMock, 'slice');
      var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-items-by-page="5" st-pagination=""></td></tr></tfoot></table>';
      compile(template)(rootScope);
      rootScope.$apply();
      element = angular.element(document.getElementById('pagination'));
      expect(controllerMock.slice).toHaveBeenCalledWith(0, 5);
    });

    it('should call for the first page with 10 as default value for item by page', function () {
      spyOn(controllerMock, 'slice');
      var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-pagination=""></td></tr></tfoot></table>';
      compile(template)(rootScope);
      rootScope.$apply();
      element = angular.element(document.getElementById('pagination'));
      expect(controllerMock.slice).toHaveBeenCalledWith(0, 10);
    });

    it('should call for the first page with `stConfig.pagination.itemsByPage = 21` as value for item by page', function () {
      var oldItemsByPage = stConfig.pagination.itemsByPage;
      stConfig.pagination.itemsByPage = 21;

      spyOn(controllerMock, 'slice');
      var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-pagination=""></td></tr></tfoot></table>';
      compile(template)(rootScope);
      rootScope.$apply();
      element = angular.element(document.getElementById('pagination'));
      expect(controllerMock.slice).toHaveBeenCalledWith(0, 21);

      stConfig.pagination.itemsByPage = oldItemsByPage;
    });
  });

  describe('template', function () {
    var templateCache;
    beforeEach(inject(function ($templateCache) {
      templateCache = $templateCache;
    }));

    it('should load custom template from stConfig\'s "st-template"', function () {
      var defaultTemplate = stConfig.pagination.template;
      stConfig.pagination.template = 'custom_stConfig_template.html';

      templateCache.put('custom_stConfig_template.html', '<div id="custom_stConfig_id"></div>');

      var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-pagination=""></td></tr></tfoot></table>';
      element = compile(template)(rootScope);
      rootScope.$apply();

      expect(angular.element(element.find('div#custom_stConfig_id')).length).toBe(1);

      stConfig.pagination.template = defaultTemplate;
    });

    it('should load custom template from attribute "st-template"', function () {
      templateCache.put('custom_template.html', '<div id="custom_id"></div>');

      var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-pagination="" st-template="custom_template.html"></td></tr></tfoot></table>';
      element = compile(template)(rootScope);
      rootScope.$apply();

      expect(angular.element(element.find('div#custom_id')).length).toBe(1);
    });
  });

  describe('draw pages', function () {

    it('it should draw the pages based on table state using 5 as default value for displayed pages number and center it on the active page', function () {
      var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-pagination=""></td></tr></tfoot></table>';
      element = compile(template)(rootScope);
      rootScope.$apply();

      tableState.pagination = {
        start: 35,
        numberOfPages: 12,
        number: 10
      };

      rootScope.$apply();

      var pages = getPages();

      expect(pages.length).toBe(5);

      expect(pages[0].text()).toEqual('2');
      expect(pages[1].text()).toEqual('3');
      expect(pages[2].text()).toEqual('4');
      expect(pages[3].text()).toEqual('5');
      expect(pages[4].text()).toEqual('6');

      var active = pages.filter(function (value) {
        return hasClass(value[0], 'active');
      });

      expect(active.length).toBe(1);
      expect(active[0].text()).toEqual('4');

    });

    it('it should draw the pages based on table state using provided value for displayed pages', function () {
      var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-displayed-pages="7" st-pagination=""></td></tr></tfoot></table>';
      element = compile(template)(rootScope);

      rootScope.$apply();

      tableState.pagination = {
        start: 35,
        numberOfPages: 12,
        number: 10
      };

      rootScope.$apply();

      var pages = getPages();

      expect(pages.length).toBe(7);

      expect(pages[0].text()).toEqual('1');
      expect(pages[1].text()).toEqual('2');
      expect(pages[2].text()).toEqual('3');
      expect(pages[3].text()).toEqual('4');
      expect(pages[4].text()).toEqual('5');
      expect(pages[5].text()).toEqual('6');
      expect(pages[6].text()).toEqual('7');

      var active = pages.filter(function (value) {
        return hasClass(value[0], 'active');
      });

      expect(active.length).toBe(1);
      expect(active[0].text()).toEqual('4');
    });

    it('it should draw the pages based on stConfig default for displayed pages', function () {
      var defaultDisplayedPages = stConfig.pagination.displayedPages;
      stConfig.pagination.displayedPages = 8;

      var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-pagination=""></td></tr></tfoot></table>';
      element = compile(template)(rootScope);

      rootScope.$apply();

      tableState.pagination = {
        start: 35,
        numberOfPages: 12,
        number: 10
      };

      rootScope.$apply();

      var pages = getPages();

      expect(pages.length).toBe(8);

      expect(pages[0].text()).toEqual('1');
      expect(pages[1].text()).toEqual('2');
      expect(pages[2].text()).toEqual('3');
      expect(pages[3].text()).toEqual('4');
      expect(pages[4].text()).toEqual('5');
      expect(pages[5].text()).toEqual('6');
      expect(pages[6].text()).toEqual('7');
      expect(pages[7].text()).toEqual('8');

      var active = pages.filter(function (value) {
        return hasClass(value[0], 'active');
      });

      expect(active.length).toBe(1);
      expect(active[0].text()).toEqual('4');

      stConfig.pagination.displayedPages = defaultDisplayedPages;
    });

    it('should support string for number and displayed page as this var can be bound', function () {
      rootScope.itemsByPage = "12";
      rootScope.displayedPages = "6";
      var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-items-by-page="itemsByPage" st-displayed-pages="displayedPages" st-pagination=""></td></tr></tfoot></table>';
      element = compile(template)(rootScope);

      rootScope.$apply();

      tableState.pagination.start = 12;
      tableState.pagination.numberOfPages = 12;

      rootScope.$apply();

      var pages = getPages();

      expect(pages.length).toBe(6);

      expect(pages[0].text()).toEqual('1');
      expect(pages[1].text()).toEqual('2');
      expect(pages[2].text()).toEqual('3');
      expect(pages[3].text()).toEqual('4');
      expect(pages[4].text()).toEqual('5');
      expect(pages[5].text()).toEqual('6');

      var active = pages.filter(function (value) {
        return hasClass(value[0], 'active');
      });

      expect(active.length).toBe(1);
      expect(active[0].text()).toEqual('2');
    });

    it('it should not center when reaching higher edge', function () {
      var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-pagination=""></td></tr></tfoot></table>';
      element = compile(template)(rootScope);

      rootScope.$apply();

      tableState.pagination = {
        start: 105,
        numberOfPages: 12,
        number: 10
      };

      rootScope.$apply();


      var pages = getPages();

      expect(pages.length).toBe(5);

      expect(pages[0].text()).toEqual('8');
      expect(pages[1].text()).toEqual('9');
      expect(pages[2].text()).toEqual('10');
      expect(pages[3].text()).toEqual('11');
      expect(pages[4].text()).toEqual('12');

      var active = pages.filter(function (value) {
        return hasClass(value[0], 'active');
      });

      expect(active.length).toBe(1);
      expect(active[0].text()).toEqual('11');

    });

    it('it should not center when reaching lower edge', function () {
      var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-pagination=""></td></tr></tfoot></table>';
      element = compile(template)(rootScope);

      rootScope.$apply();

      tableState.pagination = {
        start: 5,
        numberOfPages: 12,
        number: 10
      };

      rootScope.$apply();


      var pages = getPages();

      expect(pages.length).toBe(5);

      expect(pages[0].text()).toEqual('1');
      expect(pages[1].text()).toEqual('2');
      expect(pages[2].text()).toEqual('3');
      expect(pages[3].text()).toEqual('4');
      expect(pages[4].text()).toEqual('5');

      var active = pages.filter(function (value) {
        return hasClass(value[0], 'active');
      });

      expect(active.length).toBe(1);
      expect(active[0].text()).toEqual('1');

    });

    it('it should limit the number of page to available pages', function () {
      var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-pagination=""></td></tr></tfoot></table>';
      element = compile(template)(rootScope);

      rootScope.$apply();

      tableState.pagination = {
        start: 12,
        numberOfPages: 3,
        number: 10
      };

      rootScope.$apply();


      var pages = getPages();

      expect(pages.length).toBe(3);

      expect(pages[0].text()).toEqual('1');
      expect(pages[1].text()).toEqual('2');
      expect(pages[2].text()).toEqual('3');

      var active = pages.filter(function (value) {
        return hasClass(value[0], 'active');
      });

      expect(active.length).toBe(1);
      expect(active[0].text()).toEqual('2');
    });

    it('it should remove pagination when there is less than two pages', function () {
      var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-pagination=""></td></tr></tfoot></table>';
      element = compile(template)(rootScope);

      rootScope.$apply();

      tableState.pagination = {
        start: 5,
        numberOfPages: 1,
        number: 10
      };

      rootScope.$apply();

      var pages = getPages();

      expect(pages.length).toBe(0);
    });

    describe('with extended template', function () {
      var templateCache;
      beforeEach(inject(function ($templateCache) {
        templateCache = $templateCache;
      }));

      it('should save totalItemCount from paginationState on scope', function () {
        templateCache.put('custom_template.html', '<nav ng-if="pages.length >= 2"><ul class="pagination">' +
        '<li ng-repeat="page in pages" ng-class="{active: page==currentPage}"><a ng-click="selectPage(page)">{{page}}</a></li>' +
        '</ul>' +
        '<span>Showing {{(currentPage-1)*stItemsByPage+1}}-{{(currentPage)*stItemsByPage > totalItemCount ? totalItemCount : (currentPage)*stItemsByPage}} of {{totalItemCount}}</span>' +
        '</nav>');

        var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-pagination="" st-template="custom_template.html" st-items-by-page="2"></td></tr></tfoot></table>';
        element = compile(template)(rootScope);

        rootScope.$apply();

        tableState.pagination = {
          start: 3,
          numberOfPages: 3,
          number: 2,
          totalItemCount: 5
        };

        rootScope.$apply();

        expect(element.find('SPAN')[0].innerHTML).toBe('Showing 3-4 of 5');
      });
    });
  });

  describe('select page', function () {

    it('should select a page', function () {

      spyOn(controllerMock, 'slice').andCallThrough();

      var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-pagination=""></td></tr></tfoot></table>';
      element = compile(template)(rootScope);

      rootScope.$apply();

      tableState.pagination = {
        start: 35,
        numberOfPages: 12,
        number: 10
      };

      rootScope.$apply();

      var pages = getPages();

      expect(pages.length).toBe(5);

      expect(pages[0].text()).toEqual('2');
      expect(pages[1].text()).toEqual('3');
      expect(pages[2].text()).toEqual('4');
      expect(pages[3].text()).toEqual('5');
      expect(pages[4].text()).toEqual('6');

      var active = pages.filter(function (value) {
        return hasClass(value[0], 'active');
      });

      expect(active.length).toBe(1);
      expect(active[0].text()).toEqual('4');

      angular.element(pages[4].children()[0]).triggerHandler('click');

      rootScope.$apply();

      expect(controllerMock.slice).toHaveBeenCalledWith(50, 10);

    });

  });

  describe('call onPageChange callback', function () {

    it('should call onPageChange method', function () {
      rootScope.onPageChange = jasmine.createSpy('onPageChange');
      spyOn(controllerMock, 'slice').andCallThrough();

      tableState.pagination = {
        start: 1,
        numberOfPages: 4,
        number: 10
      };

      var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-pagination="" st-displayed-pages="5" st-page-change="onPageChange(newPage)"></td></tr></tfoot></table>';
      element = compile(template)(rootScope);

      rootScope.$apply();

      var pages = getPages();

      expect(pages.length).toBe(4);
      angular.element(pages[2].children()[0]).triggerHandler('click');

      rootScope.$apply();

      expect(controllerMock.slice).toHaveBeenCalledWith(20, 10);
      expect(rootScope.onPageChange).toHaveBeenCalledWith(3);
      expect(rootScope.onPageChange.calls.length).toBe(1);

    });

    it('should should not call when current page is not changed', function () {

      rootScope.onPageChange = jasmine.createSpy('onPageChange');
      spyOn(controllerMock, 'slice').andCallThrough();

      tableState.pagination = {
        start: 1,
        numberOfPages: 4,
        number: 10
      };

      var template = '<table st-table="rowCollection"><tfoot><tr><td id="pagination" st-pagination="" st-displayed-pages="pages" st-page-change="onPageChange(newPage)"></td></tr></tfoot></table>';
      element = compile(template)(rootScope);

      rootScope.$apply();

      var pages = getPages();

      expect(pages.length).toBe(4);
      angular.element(pages[2].children()[0]).triggerHandler('click');

      rootScope.$apply();

      expect(controllerMock.slice).toHaveBeenCalledWith(20, 10);
      expect(rootScope.onPageChange).toHaveBeenCalledWith(3);
      expect(rootScope.onPageChange.calls.length).toBe(1);

      tableState.pagination.numberOfPages = 5;

      rootScope.$apply();
      pages = getPages();

      expect(pages.length).toBe(5);
      expect(rootScope.onPageChange.calls.length).toBe(1);
    });

  });

});
