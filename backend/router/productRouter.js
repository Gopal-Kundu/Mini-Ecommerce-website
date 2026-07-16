import express from 'express';
import { getProducts, createProduct } from '../controller/productController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(isAuthenticated, createProduct);

export default router;
