const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  isGold: {
    type: Boolean,
    default: false
  }
});

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
    trim: true
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    default: 0
  }
});

const Rental = mongoose.model(
  'Rental',
  mongoose.Schema({
    customer: {
      type: customerSchema,
      required: true
    },
    movie: {
      type: movieSchema,
      required: true
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now()
    },
    dateReturned: {
      type: Date
    },
    rentalFee: {
      type: Number,
      min: 0
    }
  })
);

const validateRental = rental => {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };

  return Joi.validate(rental, schema);
};

exports.Rental = Rental;
exports.validate = validateRental;
