'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('ApplicationController', function ($scope, $cookieStore, USER_ROLES, AuthService, $window) {
        $scope.currentUser = $cookieStore.get('user');
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;
        $scope.login = function () {

            if ($scope.currentUser) {
                console.log("logined:");
                console.log($scope.currentUser);

            } else {
                console.log("notlogin");
                AuthService.login().then(function (user) {
                    $scope.setCurrentUser(user);
                });
            }

        };
        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
            if (user != null) {
                $cookieStore.put('user', user);
                $cookieStore.put('uid', user.uid);
            } else {
                $cookieStore.remove('user');
                $cookieStore.remove('uid');
            }
           // $window.location.reload();
        };
        $scope.getId = function () {
            return $scope.currentUser.uid;
        };
        $scope.getUniqueId = function (prefix) {
            var d = new Date().getTime();
            d += (parseInt(Math.random() * 100)).toString();
            if (undefined === prefix) {
                prefix = 'uid-';
            }
            d = prefix + d;
            return d;
        };
    })

    .controller('HomeCtrl', ['$scope', function ($scope) {

    }]).
    controller('EditorCtrl', function ($scope, $cookieStore, $window, EditService) {
        var iFrame = document.getElementsByTagName('iframe');
        $scope.task = {
            name: '',
            description: '',
            uid: '',
            status: '',
            userUid: ''
        };
        $scope.create = function (task) {
            document.getElementById('b-open').disabled = false;
            document.getElementById('b-save').disabled = false;
            document.getElementById('b-add-node').disabled = false;
            document.getElementById('b-add-link').disabled = false;
            document.getElementById('b-del').disabled = false;
            document.getElementById('b-clear').disabled = false;
            document.getElementById('b-send').disabled = false;
            document.getElementById('task-panel').style.display = 'none';
            $scope.task.userUid = $scope.getId();
            $scope.task.status = 'CREATED';
            EditService.createTask($scope.task).then(function (task) {
                alert("Task created successfully.");
                $cookieStore.put('taskUid', task.uid);
            }, function () {
                alert("Something wrong.");
            });
        }
        $scope.showCreatePanel = function () {
            var taskPanel = document.getElementById("task-panel");
            taskPanel.style.display = 'block';
            var doc = document.getElementsByTagName('body');
            var height_of_doc = doc[0].clientHeight;
            var width_of_doc = doc[0].clientWidth;
            var height_of_table = taskPanel.clientHeight;
            var width_of_table = taskPanel.clientHeight;
            taskPanel.style.top = height_of_doc / 2 - height_of_table / 2 + 'px';
            taskPanel.style.left = width_of_doc / 2 - width_of_table / 2 + 'px';
        }
        function setIncrement(val) {
            var w = parseInt(document.getElementById('progresbar').style.width);
            document.getElementById('progresbar').style.width = (w + val) + '%';
        }

        $scope.showSubmitPanel = function () {
            var taskPanel = document.getElementById("sending-task-panel");
            taskPanel.style.display = 'block';
            document.getElementById('div-progresbar').style.display = 'block';
            var doc = document.getElementsByTagName('body');
            var height_of_doc = doc[0].clientHeight;
            var width_of_doc = doc[0].clientWidth;
            var height_of_table = taskPanel.clientHeight;
            var width_of_table = taskPanel.clientHeight;
            taskPanel.style.top = height_of_doc / 2 - height_of_table / 2 + 'px';
            taskPanel.style.left = width_of_doc / 2 - width_of_table / 2 + 'px';
            $(document).ready(function () {
                var progress = setInterval(function () {
                    var $bar = $('.bar');
                    if ($bar.width() == 400) {
                        $bar.width(0);
                    } else {
                        $bar.width($bar.width() + 200);
                    }
                }, 800);
            });
        }
        $scope.open = function () {
            alert("open");

        }
        $scope.addNode = function () {
            //      iFrame[0].contentWindow.document.getElementById('uid').value=$scope.currentUser.uid;
            // console.log(iFrame[0].contentWindow.document.getElementById('uid').value);
            iFrame[0].contentWindow.addNode();
        }
        $scope.addLink = function () {
            iFrame[0].contentWindow.addLink();
        }
        $scope.dell = function () {
            iFrame[0].contentWindow.delete_node_link();
        }
        $scope.clearSpace = function () {
            iFrame[0].contentWindow.clearSpace();
        }
        $scope.save = function () {
            var node = iFrame[0].contentWindow.save();
            console.log(node);
        }
        function setMess(val) {
            document.getElementById('div-progresbar').style.display = 'none';
            document.getElementById('res').style.display = 'block';
            document.getElementById('lable').innerHTML = val;
        }

        $scope.send = function () {
            console.log("send");
            $scope.showSubmitPanel();
            $scope.task.uid = $cookieStore.get('taskUid');

            EditService.send($scope.task).then(function (task) {
                //alert("Task send successfully.");
                setMess('Task send successfully.');
                iFrame[0].contentWindow.clearSpace();
                $cookieStore.remove('taskUid');
                $window.location.reload();
            }, function () {
                // alert("Something wrong.");
                setMess('Something wrong.')

            });

        }

        $scope.getHeight = function () {
            return window.innerHeight - 100;
        }

    })
    .controller('NavBarCtrl', ['$scope', '$location', function ($scope, $location) {
        $scope.isActive = function (viewLocation) {
            var active = (viewLocation === $location.path());
            return active;
        };
    }])
    .controller('TasksCtrl', function ($scope, $location, TaskService) {
        $scope.sections = [
            {"name": "children", "totalChildren": 0},
            {"name": "work", "work1": "", "work2": ""}
        ]
        $scope.tasks;
        $scope.loadTasks = function () {
            console.log("run load task")
            TaskService.loadTasksSer($scope.getId()).then(function (tasks) {
                $scope.tasks = angular.fromJson(tasks);
                //  $scope.setCurrentUser(user);
                //   $location.path( "#/home" );
            }, function () {
                alert("did not get tasks.");
            });
        };

    })
    .controller('MonitorCtrl', ['$scope', '$location', function ($scope, $location) {

    }])
    .controller('RegistrationCtrl', function ($scope, md5, $location, RegistrationService) {
        $scope.credential = {
            name: '',
            email: '',
            login: '',
            password: ''
        };

        $scope.registration = function (credential) {
            var fd = new FormData();
            fd.append('uid', $scope.currentUser.uid);
            fd.append('login', $scope.currentUser.login);
            if (typeof credential != 'undefined') {
                if (typeof credential.certfile != 'undefined') {
                    fd.append('certfile', credential.certfile);
                    fd.append('certfilename', credential.certfile.name)
                    if (typeof credential.keyfile != 'undefined') {
                        fd.append('keyfile', credential.keyfile);
                        fd.append('keyfilename', credential.keyfile.name);
                        if (typeof credential.certpassword != 'undefined') {
                            fd.append('certpassword', credential.certpassword);
                            RegistrationService.registration(fd).
                                success(function (user, status, headers, config) {
                                    console.log(user);

                                    if (user.description != null && user.description.indexOf("ERROR") != -1) {
                                        alert(user.description);
                                    } else {
                                        $scope.setCurrentUser(user);
                                        $location.path("/").replace();
                                      //  $location.path("#/home");
                                      //  $location.reload();
                                        //$window.location.reload();
                                    }
                                }).
                                error(function (data, status, headers, config) {
                                    alert("Something wrong");
                                });
                        } else {
                            alert("Please set 'Password for cert'");
                        }
                    } else {
                        alert("Please set 'User key'");
                    }
                }
            } else {
                alert("Please set 'User cert', 'User key' and 'Password for cert'");
            }
        };
    })
    .controller('LoginController', function ($scope, $rootScope, md5, AuthService) {
        $scope.credentials = {
            login: '',
            password: ''
        };
        $scope.login = function () {
            $cookieStore.get('user');
            if ($scope.currentUser) {
                console.log("ssss");
            } else {
                console.log("hhhh");
            }
            //AuthService.login();
        };
    })
    .controller('ResourceCtrl', function ($scope, $rootScope, ResourceService) {
        $scope.resources;
        $scope.loadResources=function () {
            ResourceService.loadResource().then(function (res) {
                $scope.resources = angular.fromJson(res);
            }, function () {
                alert("did not get resources.");
            });
        }
    });

