const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Cart = require('../models/cart');
const Product = require('../models/product');

router.get('/', (req, res) => {
  const errors = {};
  Product.find({}).then(products => {
    if (!products) {
      errors.noProducts = "There are no products";
      return res.json(errors);
    }
    return res.json({products});
  }).catch(err => res.status(400).json(err));
});

router.get('/:id', (req, res) => {
  const errors = {};
  Product.findById(req.params.id).then(product => {
    if (!product) {
      errors.noProduct = "There is no product with that id";
      return res.json(errors);
    }
    return res.json(product);
  }).catch(err => res.status(400).json(err));
});

router.post('/', (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    price: req.body.price,
    images: req.body.images,
    description: req.body.description,
    arModel: req.body.arModel
  });
  newProduct.save().then(product => res.json(product));
});

router.put('/:id/add_to_cart', passport.authenticate('jwt', { session: false }), (req, res) => {
  Product.findById(req.params.id).then(product => {
    Cart.findOne({user: req.user.id}).then(cart => {
      if (cart) {
        cart.products.unshift({product: product.id});
        cart.save().then(cart => res.json(cart));
      } else {
        const newCart = new Cart({
          user: req.user.id
        });
        newCart.products.unshift({product: product.id});
        newCart.save().then(cart => res.json(cart));
      }
    });
  });
});

router.put('/:id/remove_from_cart', passport.authenticate('jwt', { session: false }), (req, res) => {
  Product.findById(req.params.id).then(product => {
    Cart.findOne({user: req.user.id}).then(cart => {
      if (cart) {
        let productToBeRemoved = cart.products.map(productFromCart => productFromCart.id.toString()).indexOf(product.id.toString());
        if (productToBeRemoved === -1) {
          return res.json({message: "Item not present in cart"});
        }
        cart.products.splice(productToBeRemoved, 1);
        cart.save().then(cart => res.json(cart));
      } else {
        res.json({message: "Cart not initialized"});
      }
    });
  });
});

module.exports = router;