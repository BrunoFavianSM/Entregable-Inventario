import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  searchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerHistory,
  getCustomerStats,
  getVIPCustomers
} from '../controllers/customerController.js';

const router = express.Router();

// Rutas de clientes
router.get('/', getAllCustomers);
router.get('/search', searchCustomers);
router.get('/vip', getVIPCustomers);
router.get('/:id', getCustomerById);
router.get('/:id/history', getCustomerHistory);
router.get('/:id/stats', getCustomerStats);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
