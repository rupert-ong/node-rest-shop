const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');
const port = process.env.PORT || 3000;

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    // Allows us to query/get the matching Product document associated with the Order document
    // 'product' refers to the reference property in the Orders Model
    // 'product' will no longer just be the ObjectId, but the Product information :)
    .populate('product', 'name')
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
}

exports.orders_create_order = (req, res, next) => {
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
}

exports.orders_get_order = (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select('product quantity _id')
    // Populate product property with Product document information
    .populate('product')
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
}

exports.orders_delete_order = (req, res, next) => {
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
}