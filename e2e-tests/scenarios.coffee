'use strict';

# https://github.com/angular/protractor/blob/master/docs/toc.md

describe 'my app', ->

  it 'should automatically redirect to /view1 when location hash/fragment is empty', ->
    browser.get 'index.html'
    expect browser.getLocationAbsUrl()
      .toMatch '/view1'

  describe 'view1', ->

    beforeEach ->
      browser.get 'index.html#/view1'

    it 'should render view1 when user navigates to /view1', ->
      `expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/)`

  describe 'view2', ->

    beforeEach ->
      browser.get 'index.html#/view2'

    it 'should render view2 when user navigates to /view2', ->
      `expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/)`