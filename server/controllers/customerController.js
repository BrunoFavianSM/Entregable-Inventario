import Customer from '../models/Customer.js';

// Obtener todos los clientes
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.getAll();
    res.json({
      success: true,
      data: customers,
      count: customers.length
    });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener clientes',
      error: error.message
    });
  }
};

// Obtener cliente por ID
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.getById(id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cliente',
      error: error.message
    });
  }
};

// Buscar clientes
export const searchCustomers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un término de búsqueda'
      });
    }
    
    const customers = await Customer.search(q);
    res.json({
      success: true,
      data: customers,
      count: customers.length
    });
  } catch (error) {
    console.error('Error al buscar clientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar clientes',
      error: error.message
    });
  }
};

// Crear cliente
export const createCustomer = async (req, res) => {
  try {
    const customerId = await Customer.create(req.body);
    const newCustomer = await Customer.getById(customerId);
    
    // Emitir evento Socket.io
    req.io.emit('customer:created', newCustomer);
    
    res.status(201).json({
      success: true,
      message: 'Cliente creado exitosamente',
      data: newCustomer
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear cliente',
      error: error.message
    });
  }
};

// Actualizar cliente
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await Customer.update(id, req.body);
    const updatedCustomer = await Customer.getById(id);
    
    // Emitir evento Socket.io
    req.io.emit('customer:updated', updatedCustomer);
    
    res.json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: updatedCustomer
    });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar cliente',
      error: error.message
    });
  }
};

// Eliminar cliente
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await Customer.delete(id);
    
    // Emitir evento Socket.io
    req.io.emit('customer:deleted', { id });
    
    res.json({
      success: true,
      message: 'Cliente eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar cliente',
      error: error.message
    });
  }
};

// Obtener historial de compras
export const getCustomerHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await Customer.getPurchaseHistory(id);
    res.json({
      success: true,
      data: history[0] // Los procedimientos almacenados retornan arrays anidados
    });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial',
      error: error.message
    });
  }
};

// Obtener estadísticas del cliente
export const getCustomerStats = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await Customer.getStats(id);
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

// Obtener clientes VIP
export const getVIPCustomers = async (req, res) => {
  try {
    const customers = await Customer.getVIPCustomers();
    res.json({
      success: true,
      data: customers,
      count: customers.length
    });
  } catch (error) {
    console.error('Error al obtener clientes VIP:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener clientes VIP',
      error: error.message
    });
  }
};
