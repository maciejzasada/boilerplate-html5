describe 'Unit: Config', () ->

  beforeEach angular.mock.module 'App'

  it 'should contain a Config service', inject (Config) ->
    expect(Config).not.to.equal null

  it 'should return ProdConfig by default', inject (Config) ->
    expect(Config.env).to.equal 'prod'