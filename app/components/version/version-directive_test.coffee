'use strict'

describe 'myApp.version module', ->

  beforeEach module 'myApp.version'

  describe 'app-version directive', ->

    it 'should print current version', ->
      module ($provide) ->
        $provide.value 'version', 'TEST_VER'
        return

      inject ($compile, $rootScope) ->
        element = $compile('<span app-version></span>')($rootScope)

        expect(element.text())
          .toEqual 'TEST_VER'
