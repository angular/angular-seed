# Smart Table— an easy to use table/grid 

This project is a lightweight table/grid builder. It is meant to be easy configurable but also easy customisable
(if you want to use it as a base for your own grid development). In The current version (0.1.0) the features are

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

You'll find running examples and more documentation at [the demo website](http://lorenzofox3.github.io/smart-table-website/)

## How to use Smart-Table

* You can clone the repository: the source code will be under smart-table-module directory.
* You can add the Smart-Table.min.js file to your application and then add the module `smartTable.table` to your own app module. The build includes all the template in the $templateCache
so you need only this file.
* use [bower](https://github.com/bower/bower) and run the command `bower install smart-table`

## Smart Table for developers

### the branches

* The [master](https://github.com/lorenzofox3/Smart-Table) branch is the main branch where you can find stable/tested code for a fully client side table module.
* The [cowboy](https://github.com/lorenzofox3/Smart-Table/tree/cowboy) branch is where we add some modifications on the `Directives.js` file. This part is not tested and is more an "experimental" branch
* The [server-partial](https://github.com/lorenzofox3/Smart-Table/tree/server-partial) branch:
I have quite a few times been asked :

> " I have a huge set of data which I want to be loaded in the browser only on demand, how can I do that ?"

This is somehow `server-side pagination`. You load the data on demand but keep the rest of the logic on the client side (sort,filter,...)
This branch show you how to turn smart-table to be able to have this particular flow (~10 lines to change)
* The [server-sample](https://github.com/lorenzofox3/Smart-Table/tree/server-sample) branch:
This time is a small example on how to change smart-table to have the whole logic (sort, filter, ...) on the server side, and be able
to send particular queries to the server (with proper filter value, sort value, etc)

### How does Smart-Table work ?

If you want to adapt smart-table to your own flow, it is really easy. But first you should understand how it works, so you will know what to change to customise it.

The `Table.js` file is the key. When you bind a dataCollection to the smart table directive
```html
<smart-table rows="dataCollection" columns="myColumns"></smart-table>
```
the table controller (Table.js) will have access to this data collection through the scope. This controller provides an API which table child directives (`Directives.js`) will be able to call.
Through this API calls, the controller will perform some operations on the dataCollection (sort,filter, etc) to build a subset of dataCollection (displayedCollection) which is the actual displayed data.
Most of the API method simply change table controller or scope variables and then call the `pipe` function which will actually chain the operations to build the subset (displayedCollection) and regarding to the updated
local/scope variables. The `Column.js` simply wraps (and add some required properties) to your column configuration to expose it to the table child directives through the scope.

So, at the end you don't even have to use the provided directives and build yours if you want a special behavior.

###The build process

1. install [node.js] (http://nodejs.org/) and run `npm install` to install the required node modules.
2. the build tasks are [Grunt](http://gruntjs.com/).
* if you run `grunt build` it will perform the following operations:
    * transform the template (.html) files into an angular module and load them in the [$templateCache](http://docs.angularjs.org/api/ng.$templateCache) (it will result with the `Template.js` file.
    * concatenate all the source files into a single one (Smart-Table.debug.js)
    * minify the debug file so you have a production ready file (Smart-Table.min.js)
* if you run `grunt refApp` the two first steps are the same that the build task, but at the end it will simply copy
the Smart-Table.debug.js into the example-app folder (see below)

### The example app
The example app is a running example of the smart-table in action.
To run it :
1. use node to run `scripts/web-server.js`
2. In your browser go to http://localhost:<port>/example-app/index.html

### Running unit tests

Unit tests are provided for all the code except for Directive.js file which is a bit more experimental.
Tests can be run with [Testacular](http://karma-runner.github.io/0.8/index.html): you'll find the config file under config folder. Note, the coverage is done by [Istanbul.js](http://gotwarlost.github.io/istanbul/)
        
## License

Smart Table module is under MIT license:

> Copyright (C) 2013 Laurent Renard.
>
> Permission is hereby granted, free of charge, to any person
> obtaining a copy of this software and associated documentation files
> (the "Software"), to deal in the Software without restriction,
> including without limitation the rights to use, copy, modify, merge,
> publish, distribute, sublicense, and/or sell copies of the Software,
> and to permit persons to whom the Software is furnished to do so,
> subject to the following conditions:
>
> The above copyright notice and this permission notice shall be
> included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
> NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
> BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
> ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
> CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

## Contact

For more information on Smart Table, please contact the author at laurent34azerty@gmail.com
