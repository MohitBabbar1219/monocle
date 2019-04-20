const router = require('express').Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const validateRegisterInput = require('./../helpers/registerValidations');
const validateLoginInput = require('./../helpers/loginValidations');
const User = require('./../models/user');
const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');
const {secret} = require('./../config/keys');

router.post('/register', (req, res) => {
  const {errors, isValid} = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({email: req.body.email}).then(user => {
    if (user) {
      return res.status(400).json({email: 'Email already exists'});
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // size
        r: 'pg',   // rating
        d: 'mm'   // default
      });
      const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        avatar
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;
          newUser.save().then(user => res.status(200).json({message: 'successful', user}));
        });
      })
    }
  });
});

router.post('/login', (req, res) => {
  const {errors, isValid} = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email}).then(user => {
    if (user) {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          };
          jwt.sign(payload, secret, {expiresIn: '1d'}, (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          })
        } else {
          return res.status(200).json({password: 'Incorrect password'});
        }
      })
    } else {
      return res.status(200).json({"email": "user not found"});
    }
  })
});

router.get('/current_user', passport.authenticate('jwt', {session: false}), (req, res) => {
  Cart.findOne({user: req.user.id}).then(cart => {
    let userObject = {
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      id: req.user.id,
      address: req.user.address
    };
    if (cart) {
      res.json({...userObject, cart});
    } else {
      res.json(userObject);
    }
  });
});

router.put('/address', passport.authenticate('jwt', {session: false}), (req, res) => {
  User.findById(req.user.id).then(user => {
    const addressToBeSet = {
        buildingNumber: req.body.buildingNumber,
        street: req.body.street,
        zipcode: req.body.zipcode,
        state: req.body.state
      }
    ;
    user.address = addressToBeSet;
    user.save().then(user => res.json(user));
  });
});

router.post('/place_order', passport.authenticate('jwt', {session: false}), (req, res) => {
  Cart.findOne({user: req.user.id}).populate('products.product').then(cart => {
    if (cart) {
      if (cart.products.length === 0) {
        return res.json({message: "Cart is empty"});
      }
      if (!req.user.address) {
        return res.json({message: "Address not set"});
      }
      const order = new Order({
        products: cart.products,
        netAmount: cart.products.reduce((accumulator, currentValue) => accumulator + currentValue.product.price, 0),
        shippingAddress: req.user.address
      });
      order.save().then(order => res.json(order));
    } else {
      res.json({message: "Cart not initialized"});
    }
  });
});

module.exports = router;