import User from '../model/User.js';
import Product from '../model/Product.js';

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
    });
  }
};


export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity) || 1;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const user = await User.findById(req.user._id);

    // Check if product already exists in cart
    const cartItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      // Product exists, increment quantity
      user.cart[cartItemIndex].quantity += qty;
    } else {
      // Add new product
      user.cart.push({ product: productId, quantity: qty });
    }

    await user.save();

    // Return populated cart
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.status(200).json({
      success: true,
      cart: updatedUser.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const qty = Number(quantity);

    if (qty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than zero',
      });
    }

    const user = await User.findById(req.user._id);

    const cartItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart',
      });
    }

    user.cart[cartItemIndex].quantity = qty;
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.status(200).json({
      success: true,
      cart: updatedUser.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.status(200).json({
      success: true,
      cart: updatedUser.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.status(200).json({
      success: true,
      cart: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
    });
  }
};
