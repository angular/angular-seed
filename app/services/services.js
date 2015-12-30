angular.module('myApp.services', ['ngResource'])

.factory('CatGifs', ['$resource',
	function($resource){
		return $resource(
			'https://api.imgur.com/3/gallery/search/viral/:page/?q=cat%20gif',
			{},
			{
				query: {method:'GET', params:{page: 0}, isArray:false, headers:{"Authorization": "Client-ID f4f99cf9dbe0a35"}}
			}
		);
	}
]);