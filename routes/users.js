// Routes: '/api/users'

const { User, validate } = require('../models/users');

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
  const users = await User.find()
    .sort('name')
    .select('name');
  res.send(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) res.status(404).send('User with the given ID was not founded');
  res.send(user);
});

// POST
router.post('/', async (req, res) => {
  // Validate
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check
  const registeredUser = await User.findOne({ email: req.body.email });
  if (registeredUser) return res.status(400).send('User already registered.');

  // Save
  const userObj = new User({ ...req.body });
  const result = await userObj.save();
  res.send(result);
});

// PUT
router.put('/:id', async (req, res) => {
  // Find user
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user)
    return res.status(404).send('User with the given ID was not found');

  // Validate
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message);

  // Edit user
  const updateObj = {
    $set: {
      ...req.body
    }
  };

  const result = await User.findByIdAndUpdate(id, updateObj, { new: true });
  res.send(result);
});

// DELETE
router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user)
    return res.status(404).send('User with the given ID was not found');
  res.send(user);
});

module.exports = router;
