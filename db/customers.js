const Joi = require('joi');
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to a DB'))
  .catch(err => console.log('Couldnt connect to a DB', err));

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

const Customer = mongoose.model('Customer', customerSchema);

// Create customer
const createCustomer = async customer => {
  const customerObj = new Customer({ ...customer });

  try {
    return await customerObj.save();
  } catch (e) {
    return e.message;
  }
};

// Validate customer
const validateCustomer = customer => {
  const schema = {
    name: Joi.string().required(),
    phone: Joi.string().required(),
    isGold: Joi.boolean()
  };

  return Joi.validate(customer, schema);
};

// Delete customer
const removeCustomer = async id => await Customer.findByIdAndRemove(id);

// Edit customer
const editCustomer = async (id, customer) => {
  const updateObj = {
    $set: {
      ...customer
    }
  };

  return await Customer.findByIdAndUpdate(id, customer, { new: true });
};

// Get customer
const getCustomer = async id => await Customer.findById(id);

// Get customers
const getCustomers = async () => {
  const customers = await Customer.find()
    .sort('name')
    .select({ name: 1, phone: 1 });

  console.log(customers);

  return customers;
};

module.exports = {
  createCustomer,
  validateCustomer,
  removeCustomer,
  editCustomer,
  getCustomer,
  getCustomers
};
