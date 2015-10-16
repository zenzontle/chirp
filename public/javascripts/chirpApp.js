var app = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function($rootScope, $http) {
	$rootScope.authenticated = false;
	$rootScope.currentUser = "";

	$rootScope.signout = function(){
		$http.get('/auth/signout');

		$rootScope.authenticated = false;
		$rootScope.currentUser = "";
	};
});


app.config(function($routeProvider) {
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/register', {
			templateUrl: 'register.html',
			controller: 'authController'
		});
});

app.factory('postService', function($resource){
	return $resource('/api/posts/:id');
});

app.controller('mainController', function($rootScope, $scope, postService) {
	$scope.posts = postService.query();
	$scope.newPost = {created_by: '', text: '', create_at: ''};

	$scope.post = function() {
		$scope.newPost.created_by = $rootScope.currentUser;
		$scope.newPost.created_at = Date.now();
		postService.save($scope.newPost, function() {
			$scope.posts = postService.query();
			$scope.newPost = {created_by: '', text: '', created_at: ''};
		});
	};
});

app.controller('authController', function($scope, $rootScope, $http, $location) {
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';

	$scope.login = function() {
		$http.post('./auth/login', $scope.user).success(function(data) {
			$rootScope.authenticated = true;
			$rootScope.currentUser = data.user.username;
			$location.path('/');
		});
	};

	$scope.register = function() {
		$http.post('./auth/signup', $scope.user).success(function(data) {
			$rootScope.authenticated = true;
			$rootScope.currentUser = data.user.username;
			$location.path('/');
		});
	};
});