ng-vega
------------

Angular directive for rendering [Vega](http://vega.github.io/) specs.
This project was forked and modified from [angular-vega](https://github.com/eptify/angular-vega) which was written for Vega 1 and became inactive.
The current version of ng-vega supports Vega 2.

### Demo

- [Simple demo](http://kristw.github.io/ng-vega) -- Select dataset/renderer to see the chart changes and see the [code](https://github.com/kristw/ng-vega/blob/master/examples/index.html) to see how it was implemented.
- [Vega editor demo](http://kristw.github.io/ng-vega/editor.html) -- Implement Vega editor using ng-vega.

For more information about Vega, please refer to [official documentation](http://trifacta.github.io/vega/).

### Usage

```javascript
angular.module('exampleApp', ['ngVega'])
```

```html
<div vega spec="spec" vega-data="testData" vega-renderer="'svg'"></div>
```

- `spec` is `$scope.spec` in your controller.

- `vega-data` (optional) can be used to pass dynamic data. In the example above, it is bound to `$scope.testData`. Data can be function to modify the values (Vega 2 syntax) or raw values (and ng-vega will convert it to function to make it work for you).

```javascript
$scope.testData = {
  // function to modify dataset name "table"
  table: function(data){
    data.remove(function(d){return true;})
      insert([{a: 3}, {a: 4}])
  }
}

$scope.testData = {
  // raw values for dataset name "table"
  table: [{a: 1},{a: 2}] 
}
```

- `vega-renderer` (optional) can be used to set renderer (`'canvas'` or `'svg'`). Don't forget the quote.

### Installation

```
bower install ng-vega --save
```

or

```
npm install ng-vega --save
```

### Import into your project

Angular module `ngVega` will be available once you do one of the following:

##### Choice 1. Global

Adding this library via ```<script>``` tag is the simplest way. 

```html
<script src="path/to/angular.js"></script>
<script src="path/to/vega.js"></script>
<script src="path/to/ng-vega.min.js"></script>
```

##### Choice 2: AMD

If you use requirejs, this library support AMD out of the box.

```javascript
require.config({
  paths: {
    angular:   'path/to/angular',
    vega:      'path/to/vega',
    'ng-vega': 'path/to/ng-vega'
  }
});
require(['ng-vega'], function() {
  // do something
});
```

##### Choice 3: node.js / browserify

```javascript
require('ng-vega');
```

### Author

Krist Wongsuphasawat / [@kristw](https://twitter.com/kristw)


Copyright (c) 2016 Krist Wongsuphasawat. MIT License
