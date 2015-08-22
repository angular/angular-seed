(function(){
  'use strict';
  angular
    .module('myApp.header', [])
    .controller('HeaderController', HeaderController);

  function HeaderController ($scope){
    $scope.myheader = 'hello world';
  };

})();
