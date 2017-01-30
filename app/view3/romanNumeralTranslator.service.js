(function (angular) {
  "use strict";

  function romanNumeralTranslator() {

    var digits = ['_','I','II','III','IV','V','VI','VII','VIII','IX','X'];
    // I, V, X, L50, C100, D500, M1000

    function translate(decimal) {
      if( typeof decimal === 'string') {
        decimal = parseInt(decimal);
      }


      if(decimal <= 0) {
        return '';
      }
      if(decimal < 11) {
        return digits[decimal];
      }


      if (decimal < 40) {
        var X = Math.floor(decimal / 10);
        var I = decimal - 10*X;
        return 'X'.repeat(X) + translate(I);
      }

      if (decimal < 50) {
        return 'XL' + translate(decimal - 40);
      }
      if (decimal < 90) {
        return 'L' + translate(decimal - 50);
      }

      if (decimal < 100) {
        return 'XC' + translate(decimal - 90);
      }

      if (decimal < 400 ) {
        var C = Math.floor(decimal/100);
        return 'C'.repeat(C) + translate(decimal % 100);
      }

      if (decimal < 490 ) {
        return 'CD' + translate(decimal - 400);
      }

      if (decimal < 500 ) {
        return 'XD' + translate(decimal - 490);
      }

      if (decimal < 900) {
        return 'D' + translate(decimal - 500);
      }

      if (decimal < 1000) {
        return 'CM' + translate(decimal - 900);
      }

      if (decimal > 3888) {
        throw new Error('invalid number, max value = 3888');
      }
      var M = Math.floor(decimal/1000);

      return 'M'.repeat(M) + translate(decimal - 1000*M);
    }


    this.translate = translate;

  }

  angular.module('myApp.view3')
      .service('romanNumeralTranslatorService', romanNumeralTranslator );

})(window.angular);