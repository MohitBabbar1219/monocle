const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const db = require('./config/keys').mongoURI;

const users = require('./routes/users');

mongoose.connect(db)
    .then(() => console.log('successfully connected to database...'))
    .catch((err) => console.log('error occurred while connecting to database', err));

app.use('/api/users', users);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));