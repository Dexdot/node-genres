const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model(
  'Customer',
  mongoose.Schema({
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
  })
);

// Validate customer
const validateCustomer = customer => {
  const schema = {
    name: Joi.string().required(),
    phone: Joi.string().required(),
    isGold: Joi.boolean()
  };

  return Joi.validate(customer, schema);
};

exports.Customer = Customer;
exports.validate = validateCustomer;
