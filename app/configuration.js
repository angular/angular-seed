const tmdbKey = '06f99320c4d4aafa43383b3d6c8da151';
const imageURL = 'https://image.tmdb.org/t/p/w500';

getLink = function (category) {
  return `https://api.themoviedb.org/3/movie/${category}?api_key=${tmdbKey}`;
};
