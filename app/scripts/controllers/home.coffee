angular.module('App')
.controller 'HomeCtrl', ($scope, Config) ->
  console.log Config
  $scope.awesomeThings = [
    'HTML5 Boilerplate'
    'AngularJS'
    'Karma'
  ]