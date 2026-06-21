const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const router = express.Router();

const getChatId = (id1, id2) => [id1, id2].sort().join('_');

router.get('/conversations', protect, async (req, res) => {
  try {
    const messages = await Message.aggregate([
      { $match: { $or: [{ sender: req.user._id }, { receiver: req.user._id }] } },
      { $sort: { createdAt: -1 } },
      { $group: {
        _id: '$chatId',
        lastMessage: { $first: '$$ROOT' },
        unread: { $sum: { $cond: [{ $and: [{ $eq: ['$receiver', req.user._id] }, { $eq: ['$read', false] }] }, 1, 0] } }
      }},
      { $sort: { 'lastMessage.createdAt': -1 } }
    ]);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:userId', protect, async (req, res) => {
  try {
    const chatId = getChatId(req.user._id.toString(), req.params.userId);
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar');
    await Message.updateMany({ chatId, receiver: req.user._id, read: false }, { read: true });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:userId', protect, async (req, res) => {
  try {
    const chatId = getChatId(req.user._id.toString(), req.params.userId);
    const message = await Message.create({
      chatId,
      sender: req.user._id,
      receiver: req.params.userId,
      content: req.body.content,
      product: req.body.productId
    });
    await message.populate('sender', 'name avatar');

    const io = req.app.get('io');
    io.to(chatId).emit('new_message', message);

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
