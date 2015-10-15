var app = angular.module('chirpApp', []);

app.controller('authController', function($scope) {
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';

	$scope.login = function() {
		//placeholder until authentication is implemented
		$scope.error_message = 'login request for ' + $scope.user.username;
	};

	$scope.register = function() {
		//placeholder until authentication is implemented
		$scope.error_message = 'registration request for ' + $scope.user.username;
	};
});