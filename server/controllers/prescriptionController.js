import Prescription from '../models/Prescription.js';

// Obtener todas las recetas
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.getAll();
    res.json({
      success: true,
      data: prescriptions,
      count: prescriptions.length
    });
  } catch (error) {
    console.error('Error al obtener recetas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener recetas',
      error: error.message
    });
  }
};

// Obtener receta por ID
export const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.getById(id);
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Receta no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: prescription
    });
  } catch (error) {
    console.error('Error al obtener receta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener receta',
      error: error.message
    });
  }
};

// Buscar recetas
export const searchPrescriptions = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un término de búsqueda'
      });
    }
    
    const prescriptions = await Prescription.search(q);
    res.json({
      success: true,
      data: prescriptions,
      count: prescriptions.length
    });
  } catch (error) {
    console.error('Error al buscar recetas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar recetas',
      error: error.message
    });
  }
};

// Crear receta
export const createPrescription = async (req, res) => {
  try {
    const prescriptionId = await Prescription.create(req.body);
    const newPrescription = await Prescription.getById(prescriptionId);
    
    // Emitir evento Socket.io
    req.io.emit('prescription:created', newPrescription);
    
    res.status(201).json({
      success: true,
      message: 'Receta creada exitosamente',
      data: newPrescription
    });
  } catch (error) {
    console.error('Error al crear receta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear receta',
      error: error.message
    });
  }
};

// Actualizar receta
export const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    await Prescription.update(id, req.body);
    const updatedPrescription = await Prescription.getById(id);
    
    // Emitir evento Socket.io
    req.io.emit('prescription:updated', updatedPrescription);
    
    res.json({
      success: true,
      message: 'Receta actualizada exitosamente',
      data: updatedPrescription
    });
  } catch (error) {
    console.error('Error al actualizar receta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar receta',
      error: error.message
    });
  }
};

// Actualizar estado de receta
export const updatePrescriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await Prescription.updateStatus(id, status);
    const updatedPrescription = await Prescription.getById(id);
    
    // Emitir evento Socket.io
    req.io.emit('prescription:status_updated', updatedPrescription);
    
    res.json({
      success: true,
      message: 'Estado de receta actualizado exitosamente',
      data: updatedPrescription
    });
  } catch (error) {
    console.error('Error al actualizar estado de receta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar estado de receta',
      error: error.message
    });
  }
};

// Dispensar medicamento
export const dispenseMedication = async (req, res) => {
  try {
    const { detailId } = req.params;
    const { quantity } = req.body;
    
    await Prescription.dispenseDetail(detailId, quantity);
    
    // Emitir evento Socket.io
    req.io.emit('prescription:dispensed', { detailId, quantity });
    
    res.json({
      success: true,
      message: 'Medicamento dispensado exitosamente'
    });
  } catch (error) {
    console.error('Error al dispensar medicamento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al dispensar medicamento',
      error: error.message
    });
  }
};

// Eliminar receta
export const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    await Prescription.delete(id);
    
    // Emitir evento Socket.io
    req.io.emit('prescription:deleted', { id });
    
    res.json({
      success: true,
      message: 'Receta eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar receta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar receta',
      error: error.message
    });
  }
};

// Obtener recetas por cliente
export const getPrescriptionsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const prescriptions = await Prescription.getByCustomer(customerId);
    res.json({
      success: true,
      data: prescriptions,
      count: prescriptions.length
    });
  } catch (error) {
    console.error('Error al obtener recetas del cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener recetas del cliente',
      error: error.message
    });
  }
};

// Obtener recetas pendientes
export const getPendingPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.getPending();
    res.json({
      success: true,
      data: prescriptions,
      count: prescriptions.length
    });
  } catch (error) {
    console.error('Error al obtener recetas pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener recetas pendientes',
      error: error.message
    });
  }
};

// Obtener recetas expiradas
export const getExpiredPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.getExpired();
    res.json({
      success: true,
      data: prescriptions,
      count: prescriptions.length
    });
  } catch (error) {
    console.error('Error al obtener recetas expiradas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener recetas expiradas',
      error: error.message
    });
  }
};
