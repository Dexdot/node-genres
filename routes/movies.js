// Routes: '/api/movies'

const { Genre } = require('../models/genres');
const { Movie, validate } = require('../models/movies');

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
  const movies = await Movie.find().sort('title');
  res.send(movies);
});
router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send('Movie with the given ID was not found');
  res.send(movie);
});

// POST
router.post('/', async (req, res) => {
  // Validate
  const { error } = validate(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  // Load movie
  const { title, numberInStock, dailyRentalRate, genreId } = req.body;
  const genre = await Genre.findById(genreId);
  const { _id, name } = genre;

  const movieObj = new Movie({
    genre: { _id, name },
    title,
    numberInStock,
    dailyRentalRate
  });

  const result = await movieObj.save();
  res.send(result);
});

// PUT
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  const movie = await Movie.findById(id);
  if (!movie)
    return res.status(404).send('Movie with the given ID was not found');

  // Validate
  const { error } = validate(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  // Edit movie
  const genre = await Genre.findById(req.body.genreId);
  const { _id, name } = genre;

  const updateObj = {
    $set: {
      ...req.body,
      genre: { _id, name }
    }
  };

  const result = await Movie.findByIdAndUpdate(id, updateObj, { new: true });
  res.send(result);
});

// DELETE
router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(id);
  if (!movie)
    return res.status(404).send('Movie with the given ID was not found');
  res.send(movie);
});

module.exports = router;
