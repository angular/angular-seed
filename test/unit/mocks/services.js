'use strict';

mocks.services.factory('taggedListService', function () {

    var items = [
        {text:'first item', done:false },
        {text:'next item', done:true},
        {text:'third item', done:false},
        {text:'fourth item', done:true}
    ];

    return {
        fetch:function () {
            return items;
        }
    };
});