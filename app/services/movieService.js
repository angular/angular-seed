app.factory('movieService', ($http) => ({
  getData(category) {
    return $http.get(getLink(category))
      .then((response) => response.data.results);
  },
}));
