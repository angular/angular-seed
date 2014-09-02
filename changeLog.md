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
