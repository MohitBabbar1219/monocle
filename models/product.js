const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  images: [{
    type: String
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('products', productSchema);