'use strict';
var UUID = function() {
};
UUID.id = 1;

var Item = function (text, tags) {
    this.id = UUID.id++;
    this.text = text;
    this.tags = tags;

    this.hasTag = function(tagToFind){
        var tagFinded = false;
        angular.forEach(this.tags, function(tag){
            if (tag === tagToFind) {
                tagFinded = true;
                return;
            }
        });

        return tagFinded;
    }
};
Item.createNewItem = function(text) {

  var words = text.trim().split(' ');
  var tags = [];
  
  angular.forEach(words, function(word){
    if (word.charAt(0) === '#') {
      var tag = word.replace('#', '');
      if (tags.indexOf(tag) === -1) {
        tags.push(tag);
      }           
      text = text.replace(word, '').trim();
    }
  });

  return new Item(text, tags);
};

var TaggedList = function() {
  this.items = [];
  this.tags = [];
  this.currentTag = null;
}