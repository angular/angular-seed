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