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
      {text:'As a recent college grad, I am freshly familiar with best study practices and materials. I have had to stand in lines for practice exams and have previously initiated shared study guides on Google Drive. I am all about knowledge sharing!',icon:"fa fa-graduation-cap fa-2x fa-border"},
      {text:'What sets me apart as a full stack developer is my eye for detail, which comes from my love for painting and design.',icon:"fa fa-eye fa-2x fa-border"},
      {text:'I can adapt easily between working independently and collaborating with others. I believe in self-growth via learning and hands on experience!',icon:"fa fa-hand-paper-o fa-2x fa-border"},
      {text:'I am always curious and excited to solve any kind of puzzles: whether it be zombie games, Settlers of Catan, or debugging!',icon:"fa fa-lightbulb-o fa-2x fa-border"}
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
