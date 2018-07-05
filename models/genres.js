const Joi = require('joi');
const mongoose = require('mongoose');

// Create the model
const Genre = mongoose.model(
  'Genre',
  mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
      lowercase: true
    }
  })
);

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

exports.Genre = Genre;
exports.validate = validateGenre;
