import Location from '../models/Location.js';

// Obtener todas las ubicaciones
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.getAll();
    res.json({
      success: true,
      data: locations,
      count: locations.length
    });
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ubicaciones',
      error: error.message
    });
  }
};

// Obtener ubicación por ID
export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.getById(id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Ubicación no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Error al obtener ubicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ubicación',
      error: error.message
    });
  }
};

// Buscar ubicaciones
export const searchLocations = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un término de búsqueda'
      });
    }
    
    const locations = await Location.search(q);
    res.json({
      success: true,
      data: locations,
      count: locations.length
    });
  } catch (error) {
    console.error('Error al buscar ubicaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar ubicaciones',
      error: error.message
    });
  }
};

// Crear ubicación
export const createLocation = async (req, res) => {
  try {
    const locationId = await Location.create(req.body);
    const newLocation = await Location.getById(locationId);
    
    // Emitir evento Socket.io
    req.io.emit('location:created', newLocation);
    
    res.status(201).json({
      success: true,
      message: 'Ubicación creada exitosamente',
      data: newLocation
    });
  } catch (error) {
    console.error('Error al crear ubicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear ubicación',
      error: error.message
    });
  }
};

// Actualizar ubicación
export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    await Location.update(id, req.body);
    const updatedLocation = await Location.getById(id);
    
    // Emitir evento Socket.io
    req.io.emit('location:updated', updatedLocation);
    
    res.json({
      success: true,
      message: 'Ubicación actualizada exitosamente',
      data: updatedLocation
    });
  } catch (error) {
    console.error('Error al actualizar ubicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar ubicación',
      error: error.message
    });
  }
};

// Eliminar ubicación
export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    await Location.delete(id);
    
    // Emitir evento Socket.io
    req.io.emit('location:deleted', { id });
    
    res.json({
      success: true,
      message: 'Ubicación eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar ubicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar ubicación',
      error: error.message
    });
  }
};

// Obtener productos en una ubicación
export const getLocationProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Location.getProducts(id);
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

// Asignar producto a ubicación
export const addProductToLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, quantity } = req.body;
    
    await Location.addProduct(id, product_id, quantity);
    
    res.json({
      success: true,
      message: 'Producto asignado exitosamente'
    });
  } catch (error) {
    console.error('Error al asignar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al asignar producto',
      error: error.message
    });
  }
};

// Obtener ubicaciones por tipo
export const getLocationsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const locations = await Location.getByType(type);
    res.json({
      success: true,
      data: locations,
      count: locations.length
    });
  } catch (error) {
    console.error('Error al obtener ubicaciones por tipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ubicaciones por tipo',
      error: error.message
    });
  }
};

// Obtener ubicaciones cercanas
export const getNearbyLocations = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren coordenadas (latitude y longitude)'
      });
    }
    
    const locations = await Location.getNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      radius ? parseFloat(radius) : 10
    );
    
    res.json({
      success: true,
      data: locations,
      count: locations.length
    });
  } catch (error) {
    console.error('Error al obtener ubicaciones cercanas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ubicaciones cercanas',
      error: error.message
    });
  }
};

// Obtener estadísticas de ubicaciones
export const getLocationStats = async (req, res) => {
  try {
    const stats = await Location.getStats();
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
