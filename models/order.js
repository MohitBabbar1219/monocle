const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [{
    product: {
      type: Schema.Types.ObjectId
    }
  }],
  price: {
    type: Number,
    required: true
  },
  shippingAddress: {
    buildingNumber: {
      type: Number,
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

module.exports = User = mongoose.model('orders', orderSchema);