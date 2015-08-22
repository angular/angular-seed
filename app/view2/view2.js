(function(){
  'use strict';

  angular
    .module('myApp.view2', [])
    .controller('View2Ctrl', View2Ctrl);

  function View2Ctrl () {
    this.content = "Content for view2";
  };
})();
