// Routes: '/api/rentals'

const { validate } = require('../models/rentals');

const express = require('express');
const router = express.Router();

const {
  createRental,
  removeRental,
  editRental,
  getRental,
  getRentals
} = require('../db/rentals');

// GET
router.get('/', (req, res) => {
  getRentals()
    .then(rentals => res.send(rentals))
    .catch(err => res.send(err.message));
});

router.get('/:id', (req, res) => {
  getRental(req.params.id)
    .then(rental => {
      if (!rental)
        res.status(404).send('Rental with the given ID was not founded');
      res.send(rental);
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

  createRental(req.body)
    .then(result => res.send(result))
    .catch(err => res.send(err.message));
});

// PUT
router.put('/:id', (req, res) => {
  const { id } = req.params;
  getRental(id, req.body)
    .then(rental => {
      if (!rental)
        return res.status(404).send('Rental with the given ID was not found');

      // Validate
      const { error } = validate(req.body);
      if (error) {
        res.send(error.details[0].message);
        return;
      }

      // Edit rental
      editRental(id, req.body)
        .then(newRental => res.send(newRental))
        .catch(err => res.send(err.message));
    })
    .catch(err =>
      res.status(404).send('Rental with the given ID was not found')
    );
});

// DELETE
router.delete('/:id', (req, res) => {
  removeRental(req.params.id)
    .then(result => res.send(result))
    .catch(err => {
      res.status(404).send('Rental with the given ID was not founded');
    });
});

module.exports = router;
