
describe('romanNumeralTranslatorService', function() {
  "use strict";

  beforeEach(module('myApp.view3'));

  var service;

  beforeEach(inject(function(romanNumeralTranslatorService) {

    service = romanNumeralTranslatorService;
  }));

  it('should exist', function() {
    expect(service).toBeDefined();
  });


});