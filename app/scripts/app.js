'use strict';

angular
  .module('mffighterApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'mffighterApp.warriors'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
