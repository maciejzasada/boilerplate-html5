angular.module('App')
  .factory 'Config', ($location, ConfigDefault, ConfigLocal, ConfigDev, ConfigStage, ConfigProd) ->
    config = ConfigProd
    switch $location.host()
      when 'localhost', '127.0.0.1', '0.0.0.0' then config = ConfigLocal
      when 'dev' then config = ConfigDev
      when 'stage' then config = ConfigStage
    angular.extend {}, ConfigDefault, config