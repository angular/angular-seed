(function(){
  'use strict';

  angular
    .module('myApp.footer', [])
    .controller('FooterController', FooterController);

  function FooterController ($scope) {
    $scope.myfooter = 'my footer haha';
  };

})();
