'use strict'

describe 'myApp.view1 module', ->

  beforeEach module 'myApp.view1'

  describe 'view1 controller', ->

    it 'should ....', inject ($controller) ->
      #spec body
      view1Ctrl = $controller 'View1Ctrl'
      expect(view1Ctrl)
        .toBeDefined()
