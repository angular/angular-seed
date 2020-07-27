angular
  .module('myApp')
  .component('list', {
    templateUrl: 'list/list.html',
    controller: function ListController(category, movieService) {
      movieService.getData(category)
        .then((result) => this.category = result);
    },

  });
