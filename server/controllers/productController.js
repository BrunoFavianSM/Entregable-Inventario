import Product from '../models/Product.js';

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
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

// Obtener producto por ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.getById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message
    });
  }
};

// Buscar productos
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un término de búsqueda'
      });
    }
    
    const products = await Product.search(q);
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar productos',
      error: error.message
    });
  }
};

// Crear producto
export const createProduct = async (req, res) => {
  try {
    const productId = await Product.create(req.body);
    const newProduct = await Product.getById(productId);
    
    // Emitir evento Socket.io
    req.io.emit('product:created', newProduct);
    
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: newProduct
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.update(id, req.body);
    const updatedProduct = await Product.getById(id);
    
    // Emitir evento Socket.io
    req.io.emit('product:updated', updatedProduct);
    
    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
};

// Actualizar stock
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, movement_type, notes, created_by } = req.body;
    
    await Product.updateStock(id, quantity, movement_type, notes, created_by);
    const updatedProduct = await Product.getById(id);
    
    // Emitir evento Socket.io
    req.io.emit('stock:updated', updatedProduct);
    
    res.json({
      success: true,
      message: 'Stock actualizado exitosamente',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar stock',
      error: error.message
    });
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.delete(id);
    
    // Emitir evento Socket.io
    req.io.emit('product:deleted', { id });
    
    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};

// Obtener productos con stock bajo
export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.getLowStock();
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos con stock bajo',
      error: error.message
    });
  }
};

// Obtener movimientos de stock
export const getStockMovements = async (req, res) => {
  try {
    const { id } = req.params;
    const movements = await Product.getStockMovements(id);
    res.json({
      success: true,
      data: movements,
      count: movements.length
    });
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener movimientos',
      error: error.message
    });
  }
};
