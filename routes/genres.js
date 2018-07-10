// Routes: '/api/genres'

const { Genre, validate } = require('../models/genres');

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
  const genres = await Genre.find()
    .sort('name')
    .select('name');
  res.send(genres);
});
router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send('Genre with the given ID was not found');
  res.send(genre);
});

// POST
router.post('/', async (req, res) => {
  // Validate
  const { error } = validate(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  // Load genre
  const genreObj = new Genre({ ...req.body });
  const result = await genreObj.save();
  res.send(result);
});

// PUT
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  const genre = await Genre.findById(id);
  if (!genre)
    return res.status(404).send('Genre with the given ID was not found');

  // Validate
  const { error } = validate(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  // Edit genre
  const updateObj = {
    $set: {
      ...req.body
    }
  };

  const result = await Genre.findByIdAndUpdate(id, updateObj, { new: true });
  res.send(result);
});

// DELETE
router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send('Genre with the given ID was not found');
  res.send(genre);
});

module.exports = router;
