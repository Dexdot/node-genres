// Routes: '/api/genres'

const express = require('express');
const router = express.Router();

const {
  validateGenre,
  editGenre,
  loadGenre,
  removeGenre,
  getGenre,
  getGenres
} = require('../db/genres');

// GET
router.get('/', (req, res) => {
  getGenres()
    .then(genres => res.send(genres))
    .catch(err => res.send(err.message));
});
router.get('/:id', (req, res) => {
  getGenre(req.params.id)
    .then(genre => {
      if (!genre)
        return res.status(404).send('Genre with the given ID was not found');
      res.send(genre);
    })
    .catch(err => res.send(err.message));
});

// POST
router.post('/', (req, res) => {
  // Validate
  const { error } = validateGenre(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  // Load genre
  const genre = { ...req.body };
  loadGenre(genre)
    .then(result => {
      res.send(result);
    })
    .catch(err => res.send(err.message));
});

// PUT
router.put('/:id', (req, res) => {
  const { id } = req.params;

  getGenre(id)
    .then(genre => {
      if (!genre)
        return res.status(404).send('Genre with the given ID was not found');

      // Validate
      const { error } = validateGenre(req.body);
      if (error) {
        res.send(error.details[0].message);
        return;
      }

      // Edit genre
      editGenre(id, req.body)
        .then(newGenre => res.send(newGenre))
        .catch(err => res.send(err.message));
    })
    .catch(err =>
      res.status(404).send('Genre with the given ID was not found')
    );
});

// DELETE
router.delete('/:id', (req, res) => {
  removeGenre(req.params.id)
    .then(result => res.send(result))
    .catch(err => res.send(err.message));
});

module.exports = router;
