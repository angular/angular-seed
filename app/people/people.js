'use strict';

angular.module('hereiam.people', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/people', {
    templateUrl: 'people/people.html',
    controller: 'PeopleController'
  });
}])

.controller('PeopleController', [function() {
	var people = this;
	people.peopleList = [
		{ "_id" : "d9dfaef4-cb1e-4d78-a231-6ccaf9386bdc", "Name" : "bob yunger", "PhoneNumber" : "1232341234" },
		{ "_id" : "5c150c68-c3e1-411b-846c-e76b478af6df", "Name" : "bob yunger", "PhoneNumber" : "1232341234" },
		{ "_id" : "054ea9bd-02b5-4df4-8ea4-08734ec62739", "Name" : "bob yunger", "PhoneNumber" : "1232341234" },
		{ "_id" : "0c146ed2-f656-4614-a661-27dbce0eb605", "Name" : "bob yunger", "PhoneNumber" : "1232341234" },
		{ "_id" : "dd1f7869-da99-4815-8184-8c6d621e3381", "Name" : "bob yunger", "PhoneNumber" : "1232341234" },
		{ "_id" : "4813602b-5ba2-436e-8e6f-f18972250e24", "Name" : "bob yunger", "PhoneNumber" : "1232341234" },
		{ "_id" : "b4af058c-1be7-4001-8114-497ed5c7ecf1", "Name" : "bob yunger", "PhoneNumber" : "1232341234" }
	];

	people.removePerson = function(person){
		people.peopleList = people.peopleList.filter(function(obj){
			return obj !== person;
		});
	};


}]);