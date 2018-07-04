// Routes: '/'

const express = require('express');
const router = express.Router();

// GET
router.get('/', (req, res) => {
  res.send('Films genres');
});

module.exports = router;
