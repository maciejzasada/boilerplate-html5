angular.module('App')
.service 'ConfigDefault', () ->

  @env = undefined

  @init = () ->
    console.log '[Config] init'

  @version =
    major: '{{versionMajor}}'
    minor: '{{versionMinor}}'
    build: '{{versionBuild}}'
    string: '{{versionString}}'

  @googleAnalytics =
    id: 'UA-52157125-1'
    trackErrors: true

  @
