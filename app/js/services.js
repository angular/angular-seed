angular.module('F1FeederApp.services', [])
.factory('ergastAPIservice', function($http) {

  // ergastAPI is a part of a http API for Angular
  var ergastAPI = {};

  ergastAPI.getDrivers = function() {
    return $http({
      method: 'JSONP', 
      url: 'http://ergast.com/api/f1/2013/driverStandings.json?callback=JSON_CALLBACK'
    });
  }

  ergastAPI.getDriverDetails = function(id) {
    return $http({
      method: 'JSONP', 
      url: 'http://ergast.com/api/f1/2013/drivers/'+ id +'/driverStandings.json?callback=JSON_CALLBACK'
    });
  }

  ergastAPI.getDriverRaces = function(id) {
    return $http({
      method: 'JSONP', 
      url: 'http://ergast.com/api/f1/2013/drivers/'+ id +'/results.json?callback=JSON_CALLBACK'
    });
  }

  if (!ergastAPI) {
    document.write('<p>WARNING: NO ANY DATA RECIEVED<br />Make sure you have a stable network connection</p>');
  } else {
    return ergastAPI;
  }

  // return ergastAPI;
});
