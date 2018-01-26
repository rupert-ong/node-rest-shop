const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
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
    .catch(err => { res.status(500).json({ error: err }); });
});

router.post('/', (req, res, next) => {
  Product.findById(req.body.productId)
    .exec()
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      // returns a promise
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created order',
        createdOrder: {
          product: result.product,
          quantity: result.quantity,
          _id: result._id
        },
        request: {
          type: 'GET',
          url: `http://localhost:${port}/orders/${result._id}`
        }
      });
    })
    .catch(err => { res.status(500).json({ error: err }); });
});

router.get('/:orderId', (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select('product quantity _id')
    .exec()
    .then(doc => {
      if (!doc) {
        res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json({
        ...doc._doc,
        request: {
          type: 'GET',
          description: 'Get all orders',
          url: `http://localhost:${port}/orders`
        }
      });
    })
    .catch(err => { res.status(500).json({ error: err }); });
});

router.delete('/:orderId', (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          description: 'Create an order',
          url: `http://localhost:${port}/orders`,
          body: {
            product: 'Id',
            quantity: 'Number'
          }
        }
      });
    })
    .catch(err => { res.status(500).json({ error: err }); });
});

module.exports = router;