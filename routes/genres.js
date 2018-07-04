// Routes: '/api/genres'

const express = require('express');
const router = express.Router();

let genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Horror' },
  { id: 3, name: 'Romance' }
];

// Look up for a genre
const getGenre = id => {
  return genres.find(genre => genre.id === parseInt(id, 10));
};

// Validate
const validateGenre = genre => {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(genre, schema);
};

// GET
router.get('/', (req, res) => {
  res.send(genres);
});
router.get('/:id', (req, res) => {
  const genre = getGenre(req.params.id);
  if (!genre)
    return res.status(404).send('Genre with the given ID was not found');
  res.send(genre);
});

// POST
router.post('/', (req, res) => {
  // Validate
  const { error } = validateGenre(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  // Create a new genre
  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };
  genres.push(genre);
  res.send(genre);
});

// PUT
router.put('/:id', (req, res) => {
  // Find genre
  const genre = getGenre(req.params.id);
  if (!genre)
    return res.status(404).send('Genre with the given ID was not found');

  // Validate
  const { error } = validateGenre(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  // Edit genre
  genre.name = req.body.name;
  res.send(genre);
});

// DELETE
router.delete('/:id', (req, res) => {
  // Find genre
  const { id } = req.params;
  const genre = getGenre(id);
  if (!genre)
    return res.status(404).send('Genre with the given ID was not found');

  const filteredGenres = genres.filter(genre => genre.id !== parseInt(id));
  genres = filteredGenres;

  res.send(genre);
});

module.exports = router;
