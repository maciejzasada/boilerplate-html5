module = angular.module('boilerplate-html5', [
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
      controller: 'HomeCtrl'
      templateUrl: 'partials/home.html'
    }

module.run (Config, GoogleAnalytics) ->
  console.log '[App] start'
  Config.init()
  GoogleAnalytics.init()
  GoogleAnalytics.trackPageview()
  window.generateError()