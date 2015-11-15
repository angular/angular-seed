angular.module('F1FeederApp.services', []).
  factory('ergastAPIservice', function($http) {

    var ergastAPI = {};

    ergastAPI.getDrivers = function() {

      var data = $http({ method: 'JSONP', url: 'http://ergast.com/api/f1/2013/driverStandings.json?callback=JSON_CALLBACK'});

      if (!data) {
        document.write('<p>WARNING: NO ANY DATA RECIEVED<br />Make sure you have a stable network connection</p>');
      } else {
        return data;
      }

      // return $http({
      //   method: 'JSONP', 
      //   url: 'http://ergast.com/api/f1/2013/driverStandings.json?callback=JSON_CALLBACK'
      // });
    }

    return ergastAPI;
  });