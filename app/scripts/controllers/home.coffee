angular.module('boilerplate-html5')
.controller 'HomeCtrl', ($scope, Config) ->
  console.log Config
  $scope.awesomeThings = [
    'HTML5 Boilerplate'
    'AngularJS'
    'Karma'
  ]