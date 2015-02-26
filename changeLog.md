## version 1.1.0

* allow binding on search predicate [https://github.com/lorenzofox3/Smart-Table/issues/142] (issue 142)
Note that if you want to search against a property name you have now to put in under single quote otherwise it will be considered as a binding
```markup
<input st-search="'name'"/>
```

## version 1.1.1

* fix #146 and #148, set stPipe before stPagination is called. Thanks [brianchance](https://github.com/brianchance)

## version 1.2.1

* implement #149 (default sorting)

## version 1.2.2

* hide pagination when less than 1 page
* add unit tests for pagination directive

## version 1.2.3

* fix back to natural sort order
* use same strategy view -> table state, table state -> view for all the plugins

## version 1.2.4

* fix #161 

## version 1.2.5

* fix #162

## version 1.2.6

* fix #165
* ability to overwrite class names for (st-sort-ascent and st-sort-descent) thanks to [replacement87](https://github.com/replacement87)

## version 1.2.7

* fix #167

## version 1.3.0

* new feature, items by page and displayed page can be bound

## version 1.4.0

* support external template for pagination
* support angular v1.3.x

## version 1.4.1

* ability to skip natural ordering state (ie fix #192)

## versiokn 1.4.2

* fix #200, `this` in a custom pipe function does not refer to the table controller anymore, and the signature of a custom pipe function is
```javascript
function(tableState, tableController){

}
```

## version 1.4.3

* ability to set filter function <code>st-set-filter</code>
* ability to set sort function <code>st-set-sort</code>

## version 1.4.4

* patch for sync problem

## version 1.4.5

* merge #234, #218
* fix #233 #237

## version 1.4.6

* evaluate sort predicate as late as possible
* fix #262

## version 1.4.7

* fix #276

## version 1.4.8

* fix #281

## version 1.4.9

* fix #285

## version 1.4.10

* fix #284
* fix #290

## version 1.4.11

* fix #296
* add possibility to bind a callback when page changes

## version 1.4.12

* don't use pagination class twice
* build improvement

