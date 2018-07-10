const { Genre } = require('../models/genres');
const mongoose = require('mongoose');

// Connect to the DB
mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to a MongoDB'))
  .catch(err => console.log('Connected to a MongoDB', err));

// Load the genre to the database
const loadGenre = async genre => {
  const genreObj = new Genre({ ...genre });

  try {
    return await genreObj.save();
  } catch (e) {
    for (field in e.errors) return e.errors[field].message;
  }
};

// Get the genre by ID
const getGenre = async id => await Genre.findById(id);

// Get all genres
const getGenres = async () =>
  await Genre.find()
    .sort('name')
    .select('name');

// Edit the genre
const editGenre = async (id, genre) => {
  const updateObj = {
    $set: {
      ...genre
    }
  };

  return await Genre.findByIdAndUpdate(id, updateObj, { new: true });
};

// Delete the genre
const removeGenre = async id => await Genre.findByIdAndRemove(id);

module.exports = {
  removeGenre,
  editGenre,
  loadGenre,
  getGenre,
  getGenres
};
