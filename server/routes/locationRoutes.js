import express from 'express';
import {
  getAllLocations,
  getLocationById,
  searchLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getLocationProducts,
  addProductToLocation,
  getLocationsByType,
  getNearbyLocations,
  getLocationStats
} from '../controllers/locationController.js';

const router = express.Router();

// Rutas de ubicaciones (coordenadas)
router.get('/', getAllLocations);
router.get('/search', searchLocations);
router.get('/nearby', getNearbyLocations);
router.get('/stats', getLocationStats);
router.get('/type/:type', getLocationsByType);
router.get('/:id', getLocationById);
router.get('/:id/products', getLocationProducts);
router.post('/', createLocation);
router.post('/:id/products', addProductToLocation);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);

export default router;
