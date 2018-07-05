// Routes: '/api/customers'

const express = require('express');
const router = express.Router();

const {
  createCustomer,
  validateCustomer,
  removeCustomer,
  editCustomer,
  getCustomer,
  getCustomers
} = require('../db/customers');

// GET
router.get('/', (req, res) => {
  getCustomers()
    .then(customers => res.send(customers))
    .catch(err => res.send(err.message));
});

router.get('/:id', (req, res) => {
  getCustomer(req.params.id)
    .then(customer => {
      if (!customer)
        res.status(404).send('Customer with the given ID was not founded');
      res.send(customer);
    })
    .catch(err => res.send(err.message));
});

// POST
router.post('/', (req, res) => {
  // Validate
  const { error } = validateCustomer(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  const customer = { ...req.body };
  createCustomer(customer)
    .then(result => res.send(result))
    .catch(err => res.send(err.message));
});

// PUT
router.put('/:id', (req, res) => {
  const { id } = req.params;
  getCustomer(id, req.body)
    .then(customer => {
      if (!customer)
        return res.status(404).send('Customer with the given ID was not found');

      // Validate
      const { error } = validateCustomer(req.body);
      if (error) {
        res.send(error.details[0].message);
        return;
      }

      // Edit customer
      editCustomer(id, req.body)
        .then(newCustomer => res.send(newCustomer))
        .catch(err => res.send(err.message));
    })
    .catch(err =>
      res.status(404).send('Customer with the given ID was not found')
    );
});

// DELETE
router.delete('/:id', (req, res) => {
  removeCustomer(req.params.id)
    .then(result => res.send(result))
    .catch(err => {
      res.status(404).send('Customer with the given ID was not founded');
    });
});

module.exports = router;
