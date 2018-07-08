const genres = require('./genres');
const Joi = require('joi');
const mongoose = require('mongoose');

const Movie = mongoose.model(
  'Movie',
  mongoose.Schema({
    title: {
      type: String,
      minlength: 1,
      maxlength: 255,
      required: true,
      trim: true
    },
    genre: {
      type: genres.schema,
      required: true
    },
    numberInStock: {
      type: Number,
      required: true,
      default: 0
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      default: 0
    }
  })
);

const validateMovie = movie => {
  const schema = {
    title: Joi.string()
      .required()
      .min(1),
    genreId: Joi.string().required(),
    numberInStock: Joi.number()
      .min(0)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .required()
  };

  return Joi.validate(movie, schema);
};

exports.Movie = Movie;
exports.validate = validateMovie;
