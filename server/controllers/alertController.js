import Alert from '../models/Alert.js';

// Obtener todas las alertas
export const getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.getAll();
    res.json({
      success: true,
      data: alerts,
      count: alerts.length
    });
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener alertas',
      error: error.message
    });
  }
};

// Obtener alertas activas
export const getActiveAlerts = async (req, res) => {
  try {
    const alerts = await Alert.getActive();
    res.json({
      success: true,
      data: alerts,
      count: alerts.length
    });
  } catch (error) {
    console.error('Error al obtener alertas activas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener alertas activas',
      error: error.message
    });
  }
};

// Obtener alerta por ID
export const getAlertById = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await Alert.getById(id);
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alerta no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    console.error('Error al obtener alerta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener alerta',
      error: error.message
    });
  }
};

// Crear alerta
export const createAlert = async (req, res) => {
  try {
    const alertId = await Alert.create(req.body);
    const newAlert = await Alert.getById(alertId);
    
    // Emitir evento Socket.io
    req.io.emit('alert:created', newAlert);
    
    res.status(201).json({
      success: true,
      message: 'Alerta creada exitosamente',
      data: newAlert
    });
  } catch (error) {
    console.error('Error al crear alerta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear alerta',
      error: error.message
    });
  }
};

// Resolver alerta
export const resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    await Alert.resolve(id);
    
    // Emitir evento Socket.io
    req.io.emit('alert:resolved', { id });
    
    res.json({
      success: true,
      message: 'Alerta resuelta exitosamente'
    });
  } catch (error) {
    console.error('Error al resolver alerta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al resolver alerta',
      error: error.message
    });
  }
};

// Eliminar alerta
export const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    await Alert.delete(id);
    
    // Emitir evento Socket.io
    req.io.emit('alert:deleted', { id });
    
    res.json({
      success: true,
      message: 'Alerta eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar alerta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar alerta',
      error: error.message
    });
  }
};

// Obtener estadísticas de alertas
export const getAlertStats = async (req, res) => {
  try {
    const stats = await Alert.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};
