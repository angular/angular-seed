'use strict';

describe 'myApp.view2 module', ->

  beforeEach module 'myApp.view2'

  describe 'view2 controller', ->

    it 'should ....', inject ($controller) ->
      #spec body
      view2Ctrl = $controller 'View2Ctrl'
      expect(view2Ctrl)
        .toBeDefined()
