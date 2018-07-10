// Require middlewares
const logger = require('./middleware/logger');
const helmet = require('helmet');
const morgan = require('morgan');

// Require modules
const debug = require('debug')('app:debug');
const config = require('config');

// Require routes
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');

// App
const express = require('express');
const app = express();

// Debug
debug(`Appname: ${config.get('name')}`);
debug(`Mail Server: ${config.get('mail.host')}`);
debug(`Mail Pass: ${config.get('mail.password')}`);

// Built-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Middlewares
app.use(logger);
app.use(helmet());
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled');
}

// Routes
app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
