describe 'Unit: Config', () ->

  beforeEach angular.mock.module 'App'

  it 'should contain a Config service', inject (Config) ->
    expect(Config).not.toBe null

  describe 'on localhost', () ->
    beforeEach inject ($location) ->
      spyOn($location, 'host').andReturn 'localhost'
    it 'should return ConfigLocal', inject ($location, $browser, Config) ->
      expect(Config.env).toBe 'local'

  describe 'on local IP', () ->
    beforeEach inject ($location) ->
      spyOn($location, 'host').andReturn '127.0.0.1'
    it 'should return ConfigLocal', inject ($location, $browser, Config) ->
      expect(Config.env).toBe 'local'

  describe 'on local external IP', () ->
    beforeEach inject ($location) ->
      spyOn($location, 'host').andReturn '0.0.0.0'
    it 'should return ConfigLocal', inject ($location, $browser, Config) ->
      expect(Config.env).toBe 'local'

  describe 'on dev URL', () ->
    beforeEach inject ($location) ->
      spyOn($location, 'host').andReturn 'dev'
    it 'should return ConfigDev', inject ($location, $browser, Config) ->
      expect(Config.env).toBe 'dev'

  describe 'on stage URL', () ->
    beforeEach inject ($location) ->
      spyOn($location, 'host').andReturn 'stage'
    it 'should return ConfigStage', inject ($location, $browser, Config) ->
      expect(Config.env).toBe 'stage'

  describe 'on any other URL', () ->
    beforeEach inject ($location) ->
      spyOn($location, 'host').andReturn 'anyurl.com'
    it 'should return ConfigProd', inject ($location, $browser, Config) ->
      expect(Config.env).toBe 'prod'