angular.module('App')
.service 'GoogleAnalytics', (Config) ->

  @init = () ->
    console.log '[GA] init:', Config.googleAnalytics.id
    @initCore()
    if Config.googleAnalytics.trackErrors
      @initErrorReporting()
    return

  @initCore = () ->
    ((i, s, o, g, r, a, m) ->
      i['GoogleAnalyticsObject'] = r
      i[r] = i[r] or ->
        (i[r].q = i[r].q or []).push arguments
        return
      i[r].l = 1 * new Date()
      a = s.createElement(o)
      m = s.getElementsByTagName(o)[0]
      a.async = 1
      a.src = g
      m.parentNode.insertBefore a, m
      return
    ) window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga'
    ga 'create', Config.googleAnalytics.id, window.location.host
    return

  @initErrorReporting = () ->
    console.log '[GA] init error reporting'
    window.onerror = (message, file, line, column, error) ->
      file = if file then file.substr file.indexOf('/scripts/') + '/scripts/'.length else null
      stack = if error then error.stack else null
      errorObj =
        message: message
        file: file
        line: line
        column: column
        stack: stack
      ga 'send', 'event', 'error', file, JSON.stringify errorObj, 1
#      return true
    return

  @trackPageview = (page = undefined) ->
    console.log '[GA] pageview:', page || window.location.pathname
    if page
      ga 'send', 'pageview', page
    else
      ga 'send', 'pageview'
    return

  @