const express = require('express');
const app = express();
const morgan = require('morgan');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));

// API route handling
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// 404 error middleware
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status =404;
  next(error);
});

// Error route handling
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message
    }
  })
});

module.exports = app;