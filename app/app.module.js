"use strict";

// define the myApp module
let myApp = angular.module("myApp", [
  // ...which depends on the `vehicleList` module
  "ngRoute",
  "vehicleDetail",
  "vehicleList",
  "form"
]);
