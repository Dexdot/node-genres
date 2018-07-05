const Joi = require('joi');
const mongoose = require('mongoose');

// Connect to the DB
mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to a MongoDB'))
  .catch(err => console.log('Connected to a MongoDB', err));

// Define a schema
const genreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
    lowercase: true
  }
});

// Create the model
const Genre = mongoose.model('Genre', genreSchema);

// Validate genre
const validateGenre = genre => {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(255)
      .required()
  };

  return Joi.validate(genre, schema);
};

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
const getGenres = async () => {
  const genres = await Genre.find()
    .sort('name')
    .select('name');

  return genres;
};

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
  validateGenre,
  removeGenre,
  editGenre,
  loadGenre,
  getGenre,
  getGenres
};
