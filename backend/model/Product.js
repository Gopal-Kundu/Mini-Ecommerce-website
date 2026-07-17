import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add product name'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please add product price'],
  },
  description: {
    type: String,
    required: [true, 'Please add product description'],
  },
  category: {
    type: String,
    required: [true, 'Please add product category'],
  },
  image: {
    type: String,
    required: [true, 'Please add product image URL'],
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);
export default Product;
