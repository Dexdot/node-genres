const Joi = require('joi');
const mongoose = require('mongoose');

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

exports.schema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;
