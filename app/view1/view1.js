'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope',function($scope) {
  $scope.todos = [
      {text:'Learn AngularJS', done:false},
      {text: 'Build an app', done:false}
    ];

    $scope.getTotalTodos = function () {
      return $scope.todos.length;
    };


    $scope.addTodo = function () {
      $scope.todos.push({text:$scope.formTodoText, done:false});
      $scope.formTodoText = '';
    };

      $scope.clearCompleted = function () {
          $scope.todos = _.filter($scope.todos, function(todo){
              return !todo.done;
          });
      };

}]);
