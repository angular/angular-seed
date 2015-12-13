'use strict'

describe 'myApp.version module', ->

  beforeEach module 'myApp.version'

  describe 'version service', ->

    it 'should return current version', inject (version) ->
      expect(version)
        .toEqual '0.1'
