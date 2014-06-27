describe 'Unit: ConfigProd', () ->

  beforeEach angular.mock.module 'App'

  it 'should contain a ConfigProd service', inject (ConfigProd) ->
    expect(ConfigProd).not.toBe null

  it 'should have env set to "local"', inject (ConfigProd) ->
    expect(ConfigProd.env).toBe 'prod'