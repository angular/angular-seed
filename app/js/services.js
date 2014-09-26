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
            var fd = new FormData();
            fd.append('name', user.name);
            fd.append('email', user.email);
            fd.append('login', user.login);
            fd.append('password', user.password);
            fd.append('certfile', user.certfile);
            if (typeof user.certfile != 'undefined')
                fd.append('certfilename', user.certfile.name)
            fd.append('keyfile', user.keyfile);
            if (typeof user.keyfile != 'undefined')
                fd.append('keyfilename', user.keyfile.name)
            fd.append('certpassword', user.certpassword);


            return $http
                .post('/api/users/registration', fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .then(function (res) {
                    console.log(res);
                    return res.data;
                });
        };
        registrationService.checkLogin = function (user) {
            return $http
                .post('/api/users/checklogin', user)
                .then(function (res) {
                    return res.data;
                });
        };
        return registrationService;
    })
    .factory('EditService', function ($http) {
        var editService = {};

        editService.createTask = function (task) {
            return $http
                .post('/api/tasks/create', task)
                .then(function (res) {
                    console.log('task:');
                    console.log(res);
                    return res.data;
                });
        };
        editService.send = function (task) {
            return $http
                .post('/api/tasks/start', task)
                .then(function (res) {
                    return res.data;
                });
        };
        return editService;
    })
    .factory('TaskService', function ($http) {
        var taskService = {};

        taskService.loadTasksSer = function (userUid) {
            return $http.get('/api/tasks' + '?uid=' + userUid)
                .then(function (res) {
                    console.log(res.data);
                    return res.data;
                });
        };

        return taskService;
    });
