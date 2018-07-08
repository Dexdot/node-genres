const { getGenre } = require('./genres');
const { Genre } = require('../models/genres');
const { Movie } = require('../models/movies');
const mongoose = require('mongoose');

// Connect to the DB
mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to a MongoDB'))
  .catch(err => console.log('Connected to a MongoDB', err));

// Load the movie to the database
const loadMovie = async movie => {
  const { title, numberInStock, dailyRentalRate, genreId } = movie;
  const genre = await getGenre(genreId);

  const movieObj = new Movie({
    genre: { _id: genreId, name: genre.name },
    title,
    numberInStock,
    dailyRentalRate
  });

  try {
    return await movieObj.save();
  } catch (e) {
    for (field in e.errors) return e.errors[field].message;
  }
};

// Get the movie by ID
const getMovie = async id => await Movie.findById(id);

// Get all movies
const getMovies = async () => await Movie.find().sort('name');

// Edit the movie
const editMovie = async (id, movie) => {
  const genre = await getGenre(movie.genreId);
  const { _id, name } = genre;

  const updateObj = {
    $set: {
      ...movie,
      genre: { _id, name }
    }
  };

  return await Movie.findByIdAndUpdate(id, updateObj, { new: true });
};

// Delete the movie
const removeMovie = async id => await Movie.findByIdAndRemove(id);

module.exports = {
  removeMovie,
  editMovie,
  loadMovie,
  getMovie,
  getMovies
};
