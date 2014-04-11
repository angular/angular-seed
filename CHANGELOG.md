# The Change log across the different versions

## V0.1.0

* table markup: it is a table and follows the semantic of an HTML table.
* manage your layout: you can choose the number of columns and how the should be mapped to your data model
* format data: you can choose how the data are formatted within a given column:
    * by giving your own format function
    * using one of the built-in angular filters
* Sort data
    * using your own algorithm
    * using the 'orderBy' angular algorithm: in this case you'll be able to provide predicates as explained in [orderBy filter documentation](http://docs.angularjs.org/api/ng.filter:orderBy)
* Filter data
    * using a global search input box
    * using the controller API to filter according to a particular column
* Select data row(s) according to different modes:
    * single: one row selected at the time
    * multiple: many row selected at the time. In this case you can also add a selection column with checkboxes
* Simple style: you can easily give class name to all the cells of a given column and to the header as well
* template cell:
    * you can provide template for a given column header (it will be compiled so that you can attach directves to it)
    * same for the data cells
* Edit cells: you can make cells editable and specify a type for the input so that validation rules, etc will be applied
* Client side pagination : you can choose the number of rows you want to display and use the [angular-ui.bootstrap](http://angular-ui.github.io/bootstrap/) pagination directive to navigate.
* All the directives of the table use the table controller API. It means that you can easily change the templates and directives but still using the API to perform any operation

## V0.1.1

* change build if you want to change the interpolation symbol ({{ }}) thanks to [ccapndave](https://github.com/ccapndave)
* the update dataRow is now provided my the table controller
* emit event when :
    * `selectionChange`
    * `udpateDataRow`
    * `pageChange`

## v0.1.2
* support multi-level object in column config like `map:'myNestedObject.subProperties`
* change pagination directive name to avoid collision with angular-ui.bootstrap [popalexandruvasile](https://github.com/popalexandruvasile)
* make module IE8 compatible. [pheuter](https://github.com/pheuter)
    
## v0.1.3
* reset the selectionAll state on page change

## v0.1.4
* fix sync issue with the content of an item and its smart-table row

## v0.1.5
* add the clear column functionality

## v0.1.6
* modify filter to be compatible with 1.2.X branch

## v0.1.7
* ability to pass a rowFunction (thanks to [pheuter](https://github.com/lorenzofox3/Smart-Table/pull/57))

## v0.1.8 
* allow for HTML formatted cell contents: see pull request from TNGPS https://github.com/lorenzofox3/Smart-Table/pull/80

## v0.1.9
* fix sort ascent/descent definition
* merge pull request from [morrog](https://github.com/morrog) about db click issue

## v0.2.0
breaking change:
* sort column has now 3 states ascend->descend->back to natural order

## v0.2.1
* make pagination markup "Twitter bootstrap 3" friendly
