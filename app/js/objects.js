var Item = function (text, done, tags) {
    this.text = text;
    this.done = done;
    this.tags = tags;
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

  return new Item(text, false, tags);
};