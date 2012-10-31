'use strict';

describe('TaggedList App', function() {

  beforeEach(function() {
    browser().navigateTo('../../app/index.html');
  });

    it('should add a new item', function(){
        expect(repeater('table tr').count()).toEqual(3);
        input('newItem').enter('new item');
        element('#btnAdd').click();
        expect(repeater('table tr').count()).toEqual(4);
    });

});
