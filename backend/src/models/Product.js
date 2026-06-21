const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  category: { type: String, required: true, index: true },
  subcategory: String,
  brand: String,
  images: [String],
  stock: { type: Number, required: true, min: 0 },
  sku: String,
  variants: [{
    name: String,
    options: [String],
    priceModifier: { type: Number, default: 0 }
  }],
  specifications: mongoose.Schema.Types.Mixed,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'draft', 'suspended'], default: 'active' },
  tags: [String],
  shipping: {
    weight: Number,
    freeShipping: { type: Boolean, default: false },
    shippingCost: { type: Number, default: 0 }
  }
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ seller: 1 });

module.exports = mongoose.model('Product', productSchema);
