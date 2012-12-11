'use strict';

/* jasmine specs for controllers go here */

describe('MyCtrl1', function(){
  var myCtrl1;

  beforeEach(module('myApp'));
  
  beforeEach(inject(function($controller){
    $controller('MyCtrl1', {});
  }));


  it('should ....', function() {
    //spec body
  });
});


describe('MyCtrl2', function(){
  var myCtrl2;


  beforeEach(module('myApp'));
  
  beforeEach(inject(function($controller){
    $controller('MyCtrl2', {});
  }));


  it('should ....', function() {
    //spec body
  });
});
