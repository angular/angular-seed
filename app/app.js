// Define the `phonecatApp` module
var phonecatApp = angular.module('phonecatApp', []);

// Define the `PhoneListController` controller on the `phonecatApp` module
phonecatApp.controller('PhoneListController', function PhoneListController($scope) {
  $scope.phones = [
    {
      name: 'Counter',
      snippet: 'click to count!'
    }
  ];
});


// var phonecatApp = angular.module("phonecatApp", []);


// phonecatApp.controller("PhoneListController", function PhoneListController($scope) {

//   $scope.counter = 0;
//   $scope.decrement = function() {
//       $scope.counter--;
//   };
//   $scope.phones = [
//         {
//           name: 'Counter',
//           snippet: 'click to count!'
//         }
//       ];
      
// })
