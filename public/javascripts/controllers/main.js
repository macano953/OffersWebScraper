var app = angular.module('offers', []);

app.controller('offers', function($scope, $http) {
	$http.get("/offers")
	    .success(function(offers) {
	    	$scope.offers = offers;
			console.log(offers)
	    }).
	    error(function(err){
	    	console.log(err);
	    });
});
