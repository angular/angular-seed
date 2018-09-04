'use strict';

angular.module('cartForm').component('cartForm', {
  controllerAs: 'vm',

  templateUrl: 'components/cart-form.template.html',

  controller: function($scope) {
    let vm = $scope;
    vm.master = {};

    vm.update = function(user) {
      vm.master = angular.copy(user);
    };

    vm.reset = function() {
      vm.user = angular.copy(vm.master);
    };

    vm.state = [{ state: 'New York' }, { state: 'New Jersey' }];

    vm.gender = [
      { gender: 'Male' },
      { gender: 'Female' },
      { gender: 'I choose not to identify' }
    ];

    vm.reset();
  }
});
