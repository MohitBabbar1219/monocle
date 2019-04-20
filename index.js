const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const db = require('./config/keys').mongoURI;

mongoose.connect(db)
  .then(() => console.log('successfully connected to database...'))
  .catch((err) => console.log('error occurred while connecting to database', err));

require('./models/order');
require('./models/cart');
require('./models/product');
require('./models/user');

app.use(passport.initialize());
// app.use();
require('./services/passport')(passport);

const users = require('./routes/users');
const products = require('./routes/products');
app.use('/api/users', users);
app.use('/api/products', products);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));