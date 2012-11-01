'use strict';
angular.module('taggedList.mock.service', []).factory('taggedListService', function () {
    var items = [];
    var tags = [];

    return {
        getItems: function () {
            return items;
        },
        getTags: function() {
        	return tags;
        },
        addItem: function(item) {
        	angular.forEach(item.tags, function(tag){
        		if (tags.indexOf(tag) == -1) {
        			tags.push(tag);
        		}				
        	});        	        

            items.push(item);
        }
    };
});