/*!
 * Bootstrap-select v1.8.1 (http://silviomoreto.github.io/bootstrap-select)
 *
 * Copyright 2013-2015 bootstrap-select
 * Licensed under MIT (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
}(this, function (jQuery) {

(function ($) {
  $.fn.selectpicker.defaults = {
    noneSelectedText: 'Ingen valgt',
    noneResultsText: 'Søket gir ingen treff {0}',
    countSelectedText: function (numSelected, numTotal) {
      return (numSelected == 1) ? "{0} alternativ valgt" : "{0} alternativer valgt";
    },
    maxOptionsText: function (numAll, numGroup) {
      return [
        (numAll == 1) ? 'Grense nådd (maks {n} valg)' : 'Grense nådd (maks {n} valg)',
        (numGroup == 1) ? 'Grense for grupper nådd (maks {n} grupper)' : 'Grense for grupper nådd (maks {n} grupper)'
      ];
    },
    selectAllText: 'Merk alle',
    deselectAllText: 'Fjern alle',
    multipleSeparator: ', '
  };
})(jQuery);


}));
