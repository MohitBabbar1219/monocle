const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'products'
    }
  }]
});

module.exports = Post = mongoose.model('carts', cartSchema);