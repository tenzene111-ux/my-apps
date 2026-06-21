const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = cart.items.map(item => ({
      product: item.product._id,
      seller: item.product.seller,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      variant: item.variant,
      image: item.product.images[0]
    }));

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingCost = req.body.shippingCost || 0;
    const tax = subtotal * 0.1;

    const order = await Order.create({
      buyer: req.user._id,
      items,
      shippingAddress: req.body.shippingAddress,
      payment: { method: req.body.paymentMethod },
      subtotal,
      shippingCost,
      tax,
      total: subtotal + shippingCost + tax,
      tracking: { history: [{ status: 'Order placed' }] }
    });

    // Update stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity, totalSold: item.quantity }
      });
    }

    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/seller', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const orders = await Order.find({ 'items.seller': req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      const isSeller = order.items.some(i => i.seller.toString() === req.user._id.toString());
      if (!isSeller) return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/status', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    order.tracking.history.push({ status: req.body.status, note: req.body.note });
    if (req.body.trackingNumber) {
      order.tracking.trackingNumber = req.body.trackingNumber;
      order.tracking.carrier = req.body.carrier;
    }
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
