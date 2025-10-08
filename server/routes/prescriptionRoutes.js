import express from 'express';
import {
  getAllPrescriptions,
  getPrescriptionById,
  searchPrescriptions,
  createPrescription,
  updatePrescription,
  updatePrescriptionStatus,
  dispenseMedication,
  deletePrescription,
  getPrescriptionsByCustomer,
  getPendingPrescriptions,
  getExpiredPrescriptions
} from '../controllers/prescriptionController.js';

const router = express.Router();

// Rutas de recetas
router.get('/', getAllPrescriptions);
router.get('/search', searchPrescriptions);
router.get('/pending', getPendingPrescriptions);
router.get('/expired', getExpiredPrescriptions);
router.get('/customer/:customerId', getPrescriptionsByCustomer);
router.get('/:id', getPrescriptionById);
router.post('/', createPrescription);
router.put('/:id', updatePrescription);
router.patch('/:id/status', updatePrescriptionStatus);
router.patch('/detail/:detailId/dispense', dispenseMedication);
router.delete('/:id', deletePrescription);

export default router;
