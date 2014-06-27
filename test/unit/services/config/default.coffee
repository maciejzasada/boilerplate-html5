describe 'Unit: ConfigDefault', () ->

  beforeEach angular.mock.module 'App'

  it 'should contain a ConfigDefault service', inject (ConfigDefault) ->
    expect(ConfigDefault).not.toBe null

  it 'should have an init() function', inject (ConfigDefault) ->
    expect(!!ConfigDefault.init).toBe true

  it 'init() should not throw any exception', inject (ConfigDefault) ->
    expect(ConfigDefault.init).not.toThrow()