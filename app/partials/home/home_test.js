'use strict';

describe('mainModule.view1 module', function() {

  beforeEach(module('mainModule.home'));

  describe('view1 controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var view1Ctrl = $controller('View1Ctrl');
      expect(view1Ctrl).toBeDefined();
    }));

  });
});