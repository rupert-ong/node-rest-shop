const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
const upload = multer({storage: storage});

const Product = require('../models/product');
const port = process.env.PORT || 3000;

router.get('/', (req, res, next) => {
  Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            ...doc._doc,
            request: {
              type: 'GET',
              url: `http://localhost:${port}/products/${doc._id}`
            }
          }
        })
      }
      res.status(200).json(response);
    })
    .catch(err => { res.status(500).json({ error: err }); });
});

router.post('/', upload.single('productImage'), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product.save()
    .then(result => {
      res.status(201).json({
        message: 'Created product',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result.id,
          request: {
            type: 'GET',
            url: `http://localhost:${port}/products/${result._id}`
          }
        }
      });
    })
    .catch(err => { res.status(500).json({ error: err }); });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({
        ...doc._doc,
        request: {
          type: 'GET',
          description: 'Get all products',
          url: `http://localhost:${port}/products`
        }
      });
    })
    .catch(err => { res.status(500).json({ error: err }); });
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const updateObj = {};
  // Body JSON data in request must be an array of object [{"propName": "name", "value", "New Title"}]
  /* for(const obj of req.body){
    updateObj[obj.propName] = obj.value;
  } */
  for (const key in req.body) {
    updateObj[key] = req.body[key];
  }
  Product.update({ _id: id }, { $set: updateObj })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          description: 'Get single product',
          url: `http://localhost:${port}/products/${id}`
        }
      });
    })
    .catch(err => { res.status(500).json({ error: err }); });
});

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          description: 'Create a product',
          url: `http://localhost/${port}/products`,
          body: {
            name: 'String',
            price: 'Number'
          }
        }
      });
    })
    .catch(err => { res.status(500).json({ error: err }); });
});

module.exports = router;