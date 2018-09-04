"use strict";

angular.module("form").component("form", {
  controllerAs: "vm",

  templateUrl: "components/form.template.html",

  controller: function($scope) {
    let vm = $scope;
    vm.master = {};

    vm.update = function(user) {
      vm.master = angular.copy(user);
    };

    vm.reset = function() {
      vm.user = angular.copy(vm.master);
    };

    vm.reset();
  }
});
