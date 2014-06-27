describe 'Unit: ConfigStage', () ->

  beforeEach angular.mock.module 'App'

  it 'should contain a ConfigStage service', inject (ConfigStage) ->
    expect(ConfigStage).not.toBe null

  it 'should have env set to "local"', inject (ConfigStage) ->
    expect(ConfigStage.env).toBe 'stage'