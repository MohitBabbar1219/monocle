const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  address: {
    buildingNumber: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    zipcode: {
      type: Number,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  }
});

module.exports = User = mongoose.model('users', userSchema);