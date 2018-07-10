const Fawn = require('fawn');
const { getCustomer } = require('./customers');
const { getMovie } = require('./movies');
const { Rental } = require('../models/rentals');
const mongoose = require('mongoose');

// Fawn init
Fawn.init(mongoose);

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to a DB'))
  .catch(err => console.log('Couldnt connect to a DB', err));

// Create rental
const createRental = async rental => {
  // Get IDs
  const { customerId, movieId } = rental;

  const customer = await getCustomer(customerId);
  const movie = await getMovie(movieId);

  const { name, phone } = customer;
  const { title, numberInStock, dailyRentalRate } = movie;

  if (numberInStock === 0) return new Error('Movie not in stock');

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

  try {
    // movie.numberInStock -= 1;
    // movie.save();
    // return await rentalObj.save();
    new Fawn.Task()
      .save('rentals', rentalObj)
      .update(
        'movies',
        { _id: movie._id },
        {
          $set: { numberInStock: movie.numberInStock - 1 }
        }
      )
      .run();
  } catch (e) {
    return e.message;
  }
};

// Delete rental
const removeRental = async id => await Rental.findByIdAndRemove(id);

// Edit rental
const editRental = async (id, rental) => {
  const updateObj = {
    $set: {
      ...rental
    }
  };

  return await Rental.findByIdAndUpdate(id, rental, { new: true });
};

// Get rental
const getRental = async id => await Rental.findById(id);

// Get rentals
const getRentals = async () => await Rental.find().sort('-dateOut');

module.exports = {
  createRental,
  removeRental,
  editRental,
  getRental,
  getRentals
};
