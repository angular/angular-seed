'use strict'

describe 'myApp.version module', ->

  beforeEach module 'myApp.version'

  describe 'interpolate filter', ->

    beforeEach module ($provide) ->
      $provide.value 'version', 'TEST_VER'
      return

    it 'should replace VERSION', inject (interpolateFilter) ->
      expect(interpolateFilter 'before %VERSION% after')
        .toEqual 'before TEST_VER after'
