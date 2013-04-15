'use strict';

/*table module */

//TODO be able to register function on remove/add column and rows or use the scope to emit the events

var tableModule = angular.module('SmartTable.Table', ['SmartTable.Column', 'SmartTable.Utilities']);
tableModule.constant('DefaultTableConfiguration', {
    selectionMode: 'single',
    tableTitle:'',
    dataCollection:'',
    columns:'',
    sortFunction:''
});
tableModule.controller('TableCtrl', ['$scope', 'Column','$filter','DefaultTableConfiguration', 'SelectUtility', 'ArrayUtility', function (scope, Column,filter, defaultConfig, select, array) {


    //set default value
    angular.extend(scope, defaultConfig);

    scope.columns = [];
    scope.dataCollection = [];
    scope.displayedCollection = scope.dataCollection;
    scope.tableTitle = '';


    /*////////////
     Column API
     ///////////*/


    /**
     * insert a new column in scope.collection at index or push at the end if no index
     * @param columnConfig column configuration used to instantiate the new Column
     * @param index where to insert the column (at the end if not specified)
     */
    this.insertColumn = function (columnConfig, index) {
        var column = new Column(columnConfig);
        array.insertAt(scope.columns, index, column);
    };

    /**
     * remove the column at columnIndex from scope.columns
     * @param columnIndex index of the column to be removed
     */
    this.removeColumn = function (columnIndex) {
        array.removeAt(scope.columns, columnIndex);
    };

    /**
     * move column located at oldIndex to the newIndex in scope.columns
     * @param oldIndex index of the column before it is moved
     * @param newIndex index of the column after the column is moved
     */
    this.moveColumn = function (oldIndex, newIndex) {
        array.moveAt(scope.columns,oldIndex,newIndex);
    };

    /**
     * set column as the column used to sort the data (if it is already the case, it will change the reverse value)
     * @param column
     */
    this.sortBy=function (column){
        var index=scope.columns.indexOf(column);
        if(index!==-1){
            if(column.isSortable===true){
                column.sortPredicate=column.sortPredicate || column.map;
                column.reverse=column.reverse!==true;
                //if custom sorting function
                if(scope.sortFunction){
                    scope.displayedCollection=scope.sortFunction(scope.displayedCollection,column.sortPredicate,column.reverse);
                }else{
                    scope.displayedCollection=filter('orderBy')(scope.displayedCollection,column.sortPredicate,column.reverse);
                }
            }
        }
    };

    /*///////////
     ROW API
     *///////////

    /**
     * select or unselect the item of the displayedCollection with the selection mode set in the scope
     * @param dataRow
     */
    this.toggleSelection = function (dataRow) {
        var index=scope.displayedCollection.indexOf(dataRow);
        if (index!==-1) {
            select(scope.displayedCollection, scope.selectionMode, index, dataRow.isSelected !== true);
        }
    };

    /**
     * remove the item at index rowIndex from the displayed collection
     * @param rowIndex
     * @returns {*} item just removed or undefined
     */
    this.removeDataRow = function (rowIndex) {
        array.removeAt(scope.displayedCollection, rowIndex);
    };

    /**
     * move an item from oldIndex to newIndex in displayedCollection
     * @param oldIndex
     * @param newIndex
     */
    this.moveDataRow = function (oldIndex, newIndex) {
        array.moveAt(scope.displayedCollection,oldIndex,newIndex);
    };
}]);

tableModule.directive('smartTable', ['$log', function (log) {
    return {
        restrict: 'E',
        scope: {
//            tableTitle: '@',
//            tableColumns: '=',
//            tableRows: '='
        },
        replace: 'true',
        templateUrl: 'partials/smartTable.html',
        controller: 'TableCtrl',
        link: function (scope, element, attr, ctrl) {

            //TODO for the moment we assign the table ctrl scope here
            scope.displayedCollection = scope.dataCollection = [
                {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21')},
                {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25')},
                {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27')}
            ];


            scope.columns = [];

            ctrl.insertColumn({label: 'FirsName', map: 'firstName',sortPredicate: function (item) {
                return item.firstName[item.firstName.length-1];
            }});
            ctrl.insertColumn({label: 'LastName', map: 'lastName'});
            ctrl.insertColumn({label: 'birth date', map: 'birthDate'});

            scope.tableTitle = 'super table';
            //   scope.selectionMode='multiple';
        }
    };
}]);

tableModule.directive('smartTableDataRow', function () {

    return {
        require: '^smartTable',
        restrict: 'C',
        link: function (scope, element, attr, ctrl) {

            element.bind('click', function () {
               scope.$apply(function () {
                   ctrl.toggleSelection(scope.dataRow);
               })
            });

            scope.$watch('dataRow.isSelected', function (value) {
                if (value) {
                    element.addClass('selected');
                } else {
                    element.removeClass('selected');
                }
            });
        }
    }
});

tableModule.directive('smartTableHeaderCell', function () {
   return {
       restrict:'C',
       require:'^smartTable',
       link: function (scope, element, attr, ctrl) {
           element.bind('click', function () {
               scope.$apply(function () {
                    ctrl.sortBy(scope.column);
               });
           });

       }
   }
});








