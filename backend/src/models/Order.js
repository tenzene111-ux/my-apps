const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    price: Number,
    quantity: Number,
    variant: String,
    image: String
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  payment: {
    method: { type: String, enum: ['card', 'paypal', 'cod'], required: true },
    transactionId: String,
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' }
  },
  subtotal: Number,
  shippingCost: Number,
  tax: Number,
  total: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  tracking: {
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    history: [{ status: String, date: { type: Date, default: Date.now }, note: String }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
