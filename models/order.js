const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId
    }
  }],
  netAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
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

module.exports = User = mongoose.model('orders', orderSchema);