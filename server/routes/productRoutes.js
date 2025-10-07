import express from 'express';
import {
  getAllProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
  getLowStockProducts,
  getStockMovements
} from '../controllers/productController.js';

const router = express.Router();

// Rutas de productos
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/low-stock', getLowStockProducts);
router.get('/:id', getProductById);
router.get('/:id/movements', getStockMovements);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.patch('/:id/stock', updateStock);
router.delete('/:id', deleteProduct);

export default router;
