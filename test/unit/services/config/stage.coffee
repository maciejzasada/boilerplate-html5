describe 'Unit: ConfigStage', () ->

  beforeEach angular.mock.module 'App'

  it 'should contain a ConfigStage service', inject (ConfigStage) ->
    expect(ConfigStage).not.to.equal null

  it 'should have env set to "local"', inject (ConfigStage) ->
    expect(ConfigStage.env).to.equal 'stage'