describe 'Unit: ConfigDev', () ->

  beforeEach angular.mock.module 'App'

  it 'should contain a ConfigDev service', inject (ConfigDev) ->
    expect(ConfigDev).not.toBe null

  it 'should have env set to "dev"', inject (ConfigDev) ->
    expect(ConfigDev.env).toBe 'dev'