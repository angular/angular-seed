'use strict';
// decouple the constants into a standalone module, inject it as a dependency where needed.
angular.module('myApp.constants', [])
  .constant(
    'feature1RestService',{
      'restRoot':'http://localhost:8081'
    }
  );
