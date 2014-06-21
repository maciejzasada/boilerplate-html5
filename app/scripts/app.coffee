module = angular.module('boilerplate-html5', [
  'ngCookies',
  'ngResource',
  'ngAnimate',
  'ui.router',
  'pascalprecht.translate'
])

module.config ($stateProvider, $urlRouterProvider) ->
  $urlRouterProvider.otherwise '/'

  console.log 'test'
  $stateProvider
    .state 'home', {
      url: '/'
#      controller: 'HomeCtrl'
      templateUrl: 'partials/home.html'
    }