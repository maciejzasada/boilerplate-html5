describe 'Unit: MainCtrl', () ->

  beforeEach angular.mock.module 'App'

  it 'should contain a MainCtrl controller', inject (MainCtrl) ->
    expect(!!MainCtrl).toBe true

  it 'should have a MainCtrl working fine', inject ($rootScope, $controller) ->
    console.log 'testing....'
    $scope = $rootScope.$new()
#    ctrl = $controller 'MainCtrl', {
#      $scope: $scope
#    }
    console.lgo 'done...'