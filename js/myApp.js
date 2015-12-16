var myApp=angular.module('myApp',['ngRoute','pagesControllers']);

myApp.config(['$routeProvider',function($routeProvider){
	$routeProvider.
	when('/',{
		templateUrl:'partials/main.html',
		controller:'mainController'
	})
}]);