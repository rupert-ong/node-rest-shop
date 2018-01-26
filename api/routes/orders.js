const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const port = process.env.PORT || 3000;

router.get('/', (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        orders: docs.map(doc => {
          return {
            ...doc._doc,
            request: {
              type: 'GET',
              url: `http://localhost:${port}/orders/${doc._id}`
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post('/', (req, res, next) => {
  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    product: req.body.productId
  });
  order.save()
    .then(result => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
})

router.get('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Order details',
    orderId: req.params.orderId
  });
});

router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Order deleted',
    orderId: req.params.orderId
  });
});

module.exports = router;