'use strict';

mocks.services.factory('taggedListService', function () {

    var items = [];

    return {
        fetch:function () {
            return items;
        },
        add: function(item) {
            items.push(item);
        }
    };
});