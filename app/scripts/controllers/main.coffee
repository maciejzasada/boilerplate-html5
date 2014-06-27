angular.module('App')
.controller 'MainCtrl', (Config, GoogleAnalytics) ->
  console.log '[Main] start'
  Config.init()
  GoogleAnalytics.init()
  GoogleAnalytics.trackPageview()
  #  window.generateError()