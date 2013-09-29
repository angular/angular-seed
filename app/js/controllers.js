'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', [function() {

  }]);

  function TodoCtrl ($scope, $location) {
  	console.log('init TodoCtrl' + $scope + $location);
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
  }