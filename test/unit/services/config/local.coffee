describe 'Unit: ConfigLocal', () ->

  beforeEach angular.mock.module 'App'

  it 'should contain a ConfigLocal service', inject (ConfigLocal) ->
    expect(ConfigLocal).not.toBe null

  it 'should have env set to "local"', inject (ConfigLocal) ->
    expect(ConfigLocal.env).toBe 'local'