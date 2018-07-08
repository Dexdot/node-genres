// Routes: '/api/movies'

const { validate } = require('../models/movies');

const express = require('express');
const router = express.Router();

const {
  editMovie,
  loadMovie,
  removeMovie,
  getMovie,
  getMovies
} = require('../db/movies');

// GET
router.get('/', (req, res) => {
  getMovies()
    .then(movies => res.send(movies))
    .catch(err => res.send(err.message));
});
router.get('/:id', (req, res) => {
  getMovie(req.params.id)
    .then(movie => {
      if (!movie)
        return res.status(404).send('Movie with the given ID was not found');
      res.send(movie);
    })
    .catch(err => res.send(err.message));
});

// POST
router.post('/', (req, res) => {
  // Validate
  const { error } = validate(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  // Load movie
  loadMovie(req.body)
    .then(result => {
      res.send(result);
    })
    .catch(err => res.send(err.message));
});

// PUT
router.put('/:id', (req, res) => {
  const { id } = req.params;

  getMovie(id)
    .then(movie => {
      if (!movie)
        return res.status(404).send('Movie with the given ID was not found');

      // Validate
      const { error } = validate(req.body);
      if (error) {
        res.send(error.details[0].message);
        return;
      }

      // Edit movie
      editMovie(id, req.body)
        .then(newMovie => res.send(newMovie))
        .catch(err => res.send(err.message));
    })
    .catch(err =>
      res.status(404).send('Movie with the given ID was not found')
    );
});

// DELETE
router.delete('/:id', (req, res) => {
  removeMovie(req.params.id)
    .then(result => res.send(result))
    .catch(err => res.send(err.message));
});

module.exports = router;
