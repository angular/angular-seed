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
      {text:'Practice Algorithms', done:true},
      {text:'Study System Design', done:true},
      {text:'Learn More about CH',done:true},
      {text:'Look through my projects',done:true},
      {text:'Learn AngularJS',done:false},
      {text:'Create an App',done:false},
      {text:'Get Hired!',done:false}
    ];

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
