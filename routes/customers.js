// Routes: '/api/customers'

const { Customer, validate } = require('../models/customers');

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Connect to the DB
mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to a MongoDB'))
  .catch(err => console.log('Connected to a MongoDB', err));

// GET
router.get('/', async (req, res) => {
  const customers = await Customer.find()
    .sort('name')
    .select({ name: 1, phone: 1 });
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    res.status(404).send('Customer with the given ID was not founded');
  res.send(customer);
});

// POST
router.post('/', async (req, res) => {
  // Validate
  const { error } = validate(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  // Save
  const customerObj = new Customer({ ...req.body });
  const result = await customerObj.save();
  res.send(result);
});

// PUT
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findById(id);
  if (!customer)
    return res.status(404).send('Customer with the given ID was not found');

  // Validate
  const { error } = validate(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  // Edit customer
  const updateObj = {
    $set: {
      ...req.body
    }
  };

  const result = await Customer.findByIdAndUpdate(id, updateObj, { new: true });
  res.send(result);
});

// DELETE
router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    res.status(404).send('Customer with the given ID was not founded');
  res.send(customer);
});

module.exports = router;
