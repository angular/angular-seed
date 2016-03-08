'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl',
    scope:true
  });
}])

.controller('View1Ctrl',  ['$scope',function($scope) {

$scope.header = {
	title:"My Books",
	listOfBooks:[
		{
			label:"El Pooch",
			url:"javascript:void(0);"
		},
		{
			label:"El Little Pooch",
			url:"javascript:void(0);"
		},
		{
			label:"The Flight",
			url:"javascript:void(0);"
		},
		{
			label:"Welcome To Beaches",
			url:"javascript:void(0);"
		}
	]
};
$scope.dataCardList =[
	{
		firstButtonLabel : "NO",
		secondButtonLabel : "YES",
		title:"Welcome back!",
		line1Text : "Its been a while.",
		line2Text : "Read any new boooks recently?",
		version:"version1"
	},
	{
		firstButtonLabel : "FREE SAMPLE",
		secondButtonLabel : "REVIEW",
		cardTxtHeading : "El Pooch",
		cardTxtSub : "By Alex Nelson",
		src :"http://cdn1.bigcommerce.com/n-63unu/mzwlzs93/product_images/uploaded_images/tyson-pet-of-the-week.jpg?t=1453747722",
		version:"version2"
	},
	{
		firstButtonLabel : "FREE SAMPLE",
		secondButtonLabel : "REVIEW",
		cardTxtHeading : "El Little Pooch",
		cardTxtSub : "By Alex Nelson",
		version:"version2",
		src :"http://images.freeimages.com/images/premium/previews/1152/11525553-elf-dog.jpg"
	},
	{
		firstButtonLabel : "FREE SAMPLE",
		secondButtonLabel : "REVIEW",
		cardTxtHeading : "The Flight",
		cardTxtSub : "By Jack London",
		src :"http://www.usairnet.com/wp-content/uploads/2012/12/3702-A.jpg",
		version:"version2"
	}
];
$scope.dataCardListCol2 =[
	{
		firstButtonLabel : "SHARE",
		secondButtonLabel : "EXPLORE",
		imgTitle:"Welcome to Beaches",
		title:"Number10",
		line1Text : "Whitehaven Beach",
		line2Text : "Whitehaven Beach, Whitehaven Beach",
		version:"version3",
		src :"http://point-shoot-dslr-camera-prices.com/wp-content/uploads/wppa/2651.jpg?ver=4"
	}
];
$scope.custom = true;
$scope.menuClass="hamburger";
$scope.toggleHamburgerMenu = function(){
	$scope.custom = $scope.custom === false ? true: false;
	var background = document.getElementById("destinationCard");
	if($scope.custom===false){
		$scope.menuClass = "hamburgerCross";
		background.style.opacity=0.3;
	}else{
				$scope.menuClass = "hamburger";

				background.style.opacity=1;

	}
};



}]);