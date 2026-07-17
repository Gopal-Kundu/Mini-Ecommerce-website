import express from 'express';
import { getProducts, createProduct, getVendorProducts } from '../controller/productController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(isAuthenticated, createProduct);

router.get('/vendor', isAuthenticated, getVendorProducts);

export default router;
