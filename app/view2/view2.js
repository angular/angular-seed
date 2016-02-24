'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', function($scope) {
  $scope.courses = [
    {title:'Scalability', description:"A Harvard lecture on scalability", link: "https://www.youtube.com/watch?v=-W9F__D3oY4&index=1&list=FLKOszlrF4CK62gzWj7zsNbQ"},
    {title:'AngularJS', description:"Deploying angular seed to Heroku", link: "http://linqed.eu/2014/10/07/deploying-angular-seed-to-heroku/"},
    {title:'CodeQuizzes', description:"Learn by doing", link: "http://www.codequizzes.com/"},
    {title:'Software Architecture', description:"20 Software Architect Questions & Answers for Scalability", link: "http://www.fromdev.com/2013/07/architect-interview-questions-and-answers.html"},
    {title:'Active Record Associations', description:"Advanced associations in Active Record", link: "http://www.theodinproject.com/ruby-on-rails/active-record-associations"},
    {title:'HTTP Basics', description:"The Protocol Every Web Developer Must Know - Part 1", link: "http://code.tutsplus.com/tutorials/http-the-protocol-every-web-developer-must-know-part-1--net-31177"},
    {title:'Code School', description:"Interactive programming courses and coding challenges", link: "https://www.codeschool.com/"},
    {title:'Rails Gudies', description:"Ruby on Rails guides", link: "http://guides.rubyonrails.org/"},
    {title:'Eloquent JavaScript', description:"A book to learn JavaScript, starting from fundamentals", link: "http://eloquentjavascript.net/"},
    {title:'PluralSight', description:"Online Dev and IT courses", link: "https://app.pluralsight.com/library/"},
    {title:'PHP', description:"A Harvard lecture on PHP and building dynamic websites", link: "https://www.youtube.com/watch?v=h2Nq0qv0K8M"},
    {title:'Hackerrank', description:"Practice algorithms", link: "https://www.hackerrank.com/"},
    {title:'Rubular', description:"A regular expression editor", link: "http://rubular.com/"},
    {title:'AngularJS', description:"AngularJS step-by-step tutorial", link: "https://docs.angularjs.org/tutorial"},
    {title:'PHP tutorial', description:"A simple PHP tutorial", link: "http://php.net/manual/en/tutorial.php"},
    {title:'System Design', description:"System Design Interview questions", link: "https://github.com/checkcheckzz/system-design-interview"},
    {title:'Sinatra', description:"Learn Sinatra", link: "http://www.sinatrarb.com/"},
    {title:'What Happens When', description:"The answer to what happens when you type in Google..", link: "https://github.com/alex/what-happens-when"}

    ];
}]);




