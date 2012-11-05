angular.module('taggedList.dao', []).factory('itemDao', function() {
	var items = [];

	var find = function(itemToFind){
		var indexFinded = -1;
		items.forEach(function(item, index) {
			if (item.id == itemToFind.id) {
				indexFinded = index;
				return;
			}
		})
		return indexFinded;
	};

	var itemDao = {
		query: function() {
			return items.slice(0, items.length);
		},
		get: function(id) {
			return items[id];
		},
		save: function(item) {
			var index = find(item);
			if (index == -1) {
				items.push(item);
			}
			else {
				items.splice(index, 1, item);
			}
		},
		remove: function(item) {
			var index = find(item);
			if (index != -1) {
				items.splice(index, 1);
			}
		}
	};

	return itemDao;
})