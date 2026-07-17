import Product from '../model/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    // Only vendors can create products
    if (req.role !== 'vendor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only vendors can create products.',
      });
    }

    const { name, price, description, category, image } = req.body;

    if (!name || !price || !description || !category || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields',
      });
    }

    const product = await Product.create({
      name,
      price: Number(price),
      description,
      category,
      image,
      vendor: req.id,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
    });
  }
};

export const getVendorProducts = async (req, res) => {
  try {
    if (req.role !== 'vendor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only vendors can access this resource.',
      });
    }

    const products = await Product.find({ vendor: req.id });
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor products',
    });
  }
};
