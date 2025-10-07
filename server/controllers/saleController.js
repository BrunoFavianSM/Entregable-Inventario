import Sale from '../models/Sale.js';

// Obtener todas las ventas
export const getAllSales = async (req, res) => {
  try {
    const { limit } = req.query;
    const sales = await Sale.getAll(limit ? parseInt(limit) : 100);
    res.json({
      success: true,
      data: sales,
      count: sales.length
    });
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ventas',
      error: error.message
    });
  }
};

// Obtener venta por ID
export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.getById(id);
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: sale
    });
  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener venta',
      error: error.message
    });
  }
};

// Crear venta
export const createSale = async (req, res) => {
  try {
    const saleData = await Sale.create(req.body);
    const newSale = await Sale.getById(saleData.id);
    
    // Emitir evento Socket.io
    req.io.emit('sale:created', newSale);
    req.io.emit('stock:updated', { message: 'Stock actualizado por venta' });
    
    res.status(201).json({
      success: true,
      message: 'Venta registrada exitosamente',
      data: newSale
    });
  } catch (error) {
    console.error('Error al crear venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear venta',
      error: error.message
    });
  }
};

// Obtener ventas por rango de fechas
export const getSalesByDateRange = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fechas de inicio y fin'
      });
    }
    
    const sales = await Sale.getByDateRange(start_date, end_date);
    res.json({
      success: true,
      data: sales,
      count: sales.length
    });
  } catch (error) {
    console.error('Error al obtener ventas por rango:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ventas por rango',
      error: error.message
    });
  }
};

// Obtener reporte de ventas
export const getSalesReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fechas de inicio y fin'
      });
    }
    
    const report = await Sale.getSalesReport(start_date, end_date);
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reporte',
      error: error.message
    });
  }
};

// Cancelar venta
export const cancelSale = async (req, res) => {
  try {
    const { id } = req.params;
    await Sale.cancel(id);
    
    // Emitir evento Socket.io
    req.io.emit('sale:cancelled', { id });
    
    res.json({
      success: true,
      message: 'Venta cancelada exitosamente'
    });
  } catch (error) {
    console.error('Error al cancelar venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cancelar venta',
      error: error.message
    });
  }
};

// Obtener estadísticas de ventas
export const getSalesStats = async (req, res) => {
  try {
    const stats = await Sale.getStats();
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

// Obtener productos más vendidos
export const getTopProducts = async (req, res) => {
  try {
    const { limit } = req.query;
    const topProducts = await Sale.getTopProducts(limit ? parseInt(limit) : 10);
    res.json({
      success: true,
      data: topProducts[0] // Los procedimientos almacenados retornan arrays anidados
    });
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos más vendidos',
      error: error.message
    });
  }
};
