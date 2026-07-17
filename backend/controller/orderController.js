import Order from '../model/Order.js';
import User from '../model/User.js';
import Product from '../model/Product.js';

export const checkout = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a shipping address',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty',
      });
    }

    // Group cart items by their vendor ID
    const groupedItemsByVendor = {};

    for (const item of user.cart) {
      // Find the product to get its vendor ID if not populated/saved
      const product = await Product.findById(item.product);
      if (!product) continue;

      const vendorId = product.vendor.toString();

      if (!groupedItemsByVendor[vendorId]) {
        groupedItemsByVendor[vendorId] = [];
      }

      groupedItemsByVendor[vendorId].push({
        product: item.product,
        quantity: item.quantity,
      });
    }

    // Create an order for each vendor
    const orderPromises = Object.keys(groupedItemsByVendor).map((vendorId) => {
      return Order.create({
        customer: req.user._id,
        vendor: vendorId,
        items: groupedItemsByVendor[vendorId],
        address,
        estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // explicitly 1 week from now
      });
    });

    await Promise.all(orderPromises);

    // Clear the customer's cart
    user.cart = [];
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Orders placed successfully with respective vendors!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to place orders',
    });
  }
};

export const getVendorOrders = async (req, res) => {
  try {
    if (req.role !== 'vendor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only vendors can view orders.',
      });
    }

    const orders = await Order.find({ vendor: req.id })
      .populate('customer', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch received orders',
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    if (req.role !== 'vendor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only vendors can update order status.',
      });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      });
    }

    const order = await Order.findOne({ _id: orderId, vendor: req.id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or access denied',
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
    });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('vendor', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your orders',
    });
  }
};
