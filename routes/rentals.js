// Routes: '/api/rentals'

const Fawn = require('fawn');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const { Rental, validate } = require('../models/rentals');
const { Customer } = require('../models/customers');
const { Movie } = require('../models/movies');

// Fawn init
Fawn.init(mongoose);

// Connect to the DB
mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to a MongoDB'))
  .catch(err => console.log('Connected to a MongoDB', err));

// GET
router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) res.status(404).send('Rental with the given ID was not founded');
  res.send(rental);
});

// POST
router.post('/', async (req, res) => {
  // Validate
  const { error } = validate(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  // Get IDs
  const { customerId, movieId } = req.body;

  const customer = await Customer.findById(customerId);
  const movie = await Movie.findById(movieId);

  const { name, phone } = customer;
  const { title, numberInStock, dailyRentalRate } = movie;

  if (numberInStock === 0) return res.status(404).send('Movie not in stock.');

  const rentalObj = new Rental({
    customer: {
      _id: customer._id,
      name,
      phone
    },
    movie: {
      _id: movie._id,
      title,
      dailyRentalRate
    }
  });

  new Fawn.Task()
    .save('rentals', rentalObj)
    .update(
      'movies',
      { _id: movie._id },
      { $set: { numberInStock: movie.numberInStock - 1 } }
    )
    .run();

  res.send(rentalObj);
});

// PUT
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  const rental = await Rental.findById(id);
  if (!rental)
    return res.status(404).send('Rental with the given ID was not found');

  // Validate
  const { error } = validate(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  // Edit rental
  const updateObj = {
    $set: {
      ...req.body
    }
  };

  const result = await Rental.findByIdAndUpdate(id, updateObj, { new: true });
  res.send(result);
});

// DELETE
router.delete('/:id', async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);
  if (!rental) res.status(404).send('Rental with the given ID was not founded');
  res.send(rental);
});

module.exports = router;
