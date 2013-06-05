(function (angular) {
    "use strict";
    angular.module('smartTable.templateUrlList', [])
        .constant('templateUrlList', {
            smartTable: 'partials/smartTable.html',
            smartTableGlobalSearch: 'partials/globalSearchCell.html',
            editableCell: 'partials/editableCell.html',
            selectionCheckbox: 'partials/selectionCheckbox.html',
            selectAllCheckbox: 'partials/selectAllCheckbox.html',
            defaultHeader: 'partials/defaultHeader.html',
            pagination: 'partials/pagination.html'
        });
})(angular);

