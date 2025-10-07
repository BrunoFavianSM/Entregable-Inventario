import express from 'express';
import {
  getAllAlerts,
  getActiveAlerts,
  getAlertById,
  createAlert,
  resolveAlert,
  deleteAlert,
  getAlertStats
} from '../controllers/alertController.js';

const router = express.Router();

// Rutas de alertas
router.get('/', getAllAlerts);
router.get('/active', getActiveAlerts);
router.get('/stats', getAlertStats);
router.get('/:id', getAlertById);
router.post('/', createAlert);
router.patch('/:id/resolve', resolveAlert);
router.delete('/:id', deleteAlert);

export default router;
