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

  $scope.reasonsWhyCourseHero = [
      {text:'Course Hero is a leading digital learning platform that serves more than 5 million users and offers more than 7 million course-specific materials to students.',icon:"fa fa-users fa-lg"},
      {text:"I believe in Course Hero's mission to employ educational technology and help students get the most out of their education.",icon:"fa fa fa-laptop fa-lg"},
      {text:'I love the power of knowledge sharing!',icon:"fa fa-share-alt fa-lg."},
      {text:'Working at Course Hero provides the opportunity to help build great products in an energetic and collaborative environment.',icon:"fa fa-smile-o fa-lg"},
      {text:'The Course Hero Knowledge Drive has donated 249,254 books through Books for Africa and continues to help out students abroad.',icon:"fa fa-book fa-lg"},
      {text:'Course Hero has been named as a 2015 top workplace in Bay Area.',icon:"fa fa-hand-peace-o fa-lg"}
  ];

  $scope.reasonsWhyMe = [
      {text:'',icon:"fa fa-users fa-lg"},
      {text:"",icon:"fa fa fa-laptop fa-lg"},
      {text:'I love the power of knowledge sharing!',icon:"fa fa-share-alt fa-lg."},
      {text:'Working at Course Hero provides the opportunity to help build great products in an energetic and collaborative environment.',icon:"fa fa-smile-o fa-lg"},
      {text:'The Course Hero Knowledge Drive has donated 249,254 books through Books for Africa and continues to help out students abroad.',icon:"fa fa-book fa-lg"},
      {text:'Course Hero has been named as a 2015 top workplace in Bay Area.',icon:"fa fa-hand-peace-o fa-lg"}
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
