'use strict'

angular.module 'myApp.view1', ['ngRoute']

.config ['$routeProvider', ($routeProvider) ->
  $routeProvider.when '/view1', 
    templateUrl: 'view1/view1.html'
    controller: 'View1Ctrl'
]

.controller 'View1Ctrl', [->]