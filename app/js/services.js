'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1')
    .service('Session', function () {
        this.create = function (sessionId, userId, userRole) {
            this.id = sessionId;
            this.userId = userId;
            this.userRole = userRole;
        };
        this.destroy = function () {
            this.id = null;
            this.userId = null;
            this.userRole = null;
        };
        return this;
    })
    .factory('AuthService', function ($http, Session) {
        var authService = {};

        authService.login = function (credentials) {

            return $http
                .post('/api/users/login', credentials)
                .then(function (res) {
                    Session.create(res.id, res.data.uid, res.data.role);
                    console.log(res);
                    return res.data;
                });
        };

        authService.isAuthenticated = function () {
            return !!Session.userId;
        };

        authService.isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() &&
                authorizedRoles.indexOf(Session.userRole) !== -1);
        };

        return authService;
    }).factory('RegistrationService', function ($http) {
        var registrationService = {};

        registrationService.registration = function (user) {

            return $http
                .post('/api/users/registration', user)
                .then(function (res) {
                    console.log(res);
                    return res.data;
                });
        };

        return registrationService;
    });
