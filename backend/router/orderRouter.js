import express from 'express';
import { checkout, getVendorOrders, updateOrderStatus, getCustomerOrders } from '../controller/orderController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/checkout', isAuthenticated, checkout);
router.get('/vendor', isAuthenticated, getVendorOrders);
router.put('/vendor/:orderId', isAuthenticated, updateOrderStatus);
router.get('/my-orders', isAuthenticated, getCustomerOrders);

export default router;
