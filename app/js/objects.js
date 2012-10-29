var Item = function (text, done, categories) {
    this.text = text;
    this.done = done;
    this.categories = categories;
};

Item.createNewItem = function(text) {

    var words = text.trim().split(' ');
    var categories = [];
    angular.forEach(words, function(word){
       if (word.charAt(0) === '#') {
           categories.push(word.replace('#', ''));
           text = text.replace(word, '').trim();
       }
    });

    return new Item(text, false, categories);
};