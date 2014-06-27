describe 'Unit: GoogleAnalytics', () ->

  beforeEach angular.mock.module 'App'

  it 'should contain a GoogleAnalytics service', inject (GoogleAnalytics) ->
    expect(!!GoogleAnalytics).toBe true

  it 'should create ga object when initialising', inject (GoogleAnalytics) ->
    expect(!!window.ga).toBe false
    GoogleAnalytics.init()
    expect(!!window.ga).toBe true

  it 'should initialise with errorReporting off', inject (Config, GoogleAnalytics) ->
    Config.googleAnalytics.trackErrors = false
    GoogleAnalytics.init()

  it 'should initialise with errorReporting on', inject (Config, GoogleAnalytics) ->
    Config.googleAnalytics.trackErrors = true
    GoogleAnalytics.init()

  it 'should call initCore when initialising', inject (Config, GoogleAnalytics) ->
    Config.googleAnalytics.trackErrors = false
    spyOn GoogleAnalytics, 'initCore'
    GoogleAnalytics.init()
    expect(GoogleAnalytics.initCore).toHaveBeenCalled()

  it 'should call initErrorReporting when Config says so', inject (Config, GoogleAnalytics) ->
    Config.googleAnalytics.trackErrors = true
    spyOn GoogleAnalytics, 'initErrorReporting'
    GoogleAnalytics.init()
    expect(GoogleAnalytics.initErrorReporting).toHaveBeenCalled()

  it 'should not call initErrorReporting when Config says so', inject (Config, GoogleAnalytics) ->
    Config.googleAnalytics.trackErrors = false
    spyOn GoogleAnalytics, 'initErrorReporting'
    GoogleAnalytics.init()
    expect(GoogleAnalytics.initErrorReporting).not.toHaveBeenCalled()

  it 'should set custom window.onerror when Config.googleAnalytics.errorReporting is true',
    inject (Config, GoogleAnalytics) ->
      Config.googleAnalytics.trackErrors = true
      originalWindowOnError = window.onerror
      GoogleAnalytics.init()
      expect(typeof window.onerror).toBe 'function'
      expect(window.onerror).not.toBe originalWindowOnError

  it 'window.onerror should report to Google Analytics',
    inject (Config, GoogleAnalytics) ->
      Config.googleAnalytics.trackErrors = true
      GoogleAnalytics.init()
      spyOn window, 'ga'
      window.onerror 'test message', 'testfile.js', 10, 10, new Error()
      expect(window.ga).toHaveBeenCalled()
      window.onerror 'test message', null, 10, 10, null

  it 'trackPageview should call Google Analytics',
    inject (GoogleAnalytics) ->
      GoogleAnalytics.init()
      spyOn window, 'ga'
      GoogleAnalytics.trackPageview 'test'
      expect(window.ga).toHaveBeenCalled()

  it 'trackPageview should allow no parameter',
    inject (GoogleAnalytics) ->
      GoogleAnalytics.init()
      GoogleAnalytics.trackPageview()