import express from 'express';
import {
  getAllSales,
  getSaleById,
  createSale,
  getSalesByDateRange,
  getSalesReport,
  cancelSale,
  getSalesStats,
  getTopProducts
} from '../controllers/saleController.js';

const router = express.Router();

// Rutas de ventas
router.get('/', getAllSales);
router.get('/stats', getSalesStats);
router.get('/top-products', getTopProducts);
router.get('/report', getSalesReport);
router.get('/date-range', getSalesByDateRange);
router.get('/:id', getSaleById);
router.post('/', createSale);
router.patch('/:id/cancel', cancelSale);

export default router;
