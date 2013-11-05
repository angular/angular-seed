'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {
    require(['./js/TodoCtrl'], function(TodoCtrl) {
        console.log(TodoCtrl);
        window.TodoCtrl = TodoCtrl;
        //This function is called when scripts/helper/util.js is loaded.
        //If util.js calls define(), then this function is not fired until
        //util's dependencies have loaded, and the util argument will hold
        //the module value for "helper/util".
    });
  }])
  .controller('MyCtrl2', ['$scope', '$location', function($scope, $location) {
        console.log('init TodoCtrl', $scope, $location);
        $scope.todos = [
            {text:'learn angular', done:true},
            {text:'build angular', done:false},
        ];
        $scope.addTodo = function () {
            $scope.todos.push({text:$scope.todoText, done:false});
            $scope.todoText = '';
        };

        $scope.remaining = function () {
            var count = 0;
            angular.forEach($scope.todos, function (todo) {
               count += todo.done ? 0 : 1;
           });
            return count;
        };
        $scope.archive = function () {
            var oldTodos = $scope.todos;
            $scope.todos = [];
            angular.forEach(oldTodos, function (todo) {
               if (!todo.done) $scope.todos.push(todo);
           });
        };
  }])
  .controller('PhoneListCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.phones = [
      {"name": "Nexus S",
       "snippet": "Fast just got faster with Nexus S.",
       "age": 0},
      {"name": "Motorola XOOM™ with Wi-Fi",
       "snippet": "The Next, Next Generation tablet.",
       "age": 1},
      {"name": "MOTOROLA XOOM™",
       "snippet": "The Next, Next Generation tablet.",
       "age": 2}
    ];
    $scope.orderProp = 'age';
  }]);

