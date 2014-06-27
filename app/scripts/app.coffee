module = angular.module('App', [
  'ngCookies',
  'ngResource',
  'ngAnimate',
  'ui.router',
  'pascalprecht.translate'
])

module.config ($stateProvider, $urlRouterProvider) ->
  $urlRouterProvider.otherwise '/'
  $stateProvider
    .state 'home', {
      url: '/'
      templateUrl: 'partials/home.html'
    }