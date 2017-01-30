(function (angular) {


  function View3Controller(romanNumeralTranslatorService) {

    var vm = this;

    function validate($event) {

      if ($event.key < "0" || $event.key > "9") {
        $event.preventDefault();
      } else {
        console.log($event);
      }
    }

    function translate() {
      try {
        vm.romanInteger = romanNumeralTranslatorService.translate(vm.decimalInteger);
      } catch (e) {
        vm.decimalInteger = vm.decimalInteger.slice(0,-1);
        console.log(e);
      }
    }

    vm.decimalInteger = '';
    vm.romanInteger = '';

    vm.translate = translate;
    vm.validate = validate;

  }

  angular.module('myApp.view3')
      .controller('View3Controller', ['romanNumeralTranslatorService', View3Controller]);

})(window.angular);