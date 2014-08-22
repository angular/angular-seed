## version 1.1.0

* allow binding on search predicate [https://github.com/lorenzofox3/Smart-Table/issues/142] (issue 142)
Note that if you want to search against a property name you have now to put in under single quote otherwise it will be considered as a binding
```markup
<input st-search="'name'"/>
```