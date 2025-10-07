import { query } from '../config/database.js';

class Product {
  // Obtener todos los productos
  static async getAll() {
    const sql = `
      SELECT 
        p.*,
        c.name as category_name,
        CASE 
          WHEN p.stock_quantity = 0 THEN 'out_of_stock'
          WHEN p.stock_quantity <= p.min_stock_level THEN 'low_stock'
          WHEN p.stock_quantity >= p.max_stock_level THEN 'overstock'
          ELSE 'normal'
        END as stock_status
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    return await query(sql);
  }

  // Obtener producto por ID
  static async getById(id) {
    const sql = `
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
    const results = await query(sql, [id]);
    return results[0];
  }

  // Buscar productos
  static async search(searchTerm) {
    const sql = `
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.name LIKE ? 
        OR p.sku LIKE ? 
        OR p.description LIKE ?
      ORDER BY p.name
    `;
    const term = `%${searchTerm}%`;
    return await query(sql, [term, term, term]);
  }

  // Crear producto
  static async create(productData) {
    const sql = `
      INSERT INTO products (
        name, sku, description, category_id, price, cost, 
        stock_quantity, min_stock_level, max_stock_level, 
        unit, status, image_url
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      productData.name,
      productData.sku,
      productData.description,
      productData.category_id,
      productData.price,
      productData.cost,
      productData.stock_quantity || 0,
      productData.min_stock_level || 10,
      productData.max_stock_level || 100,
      productData.unit || 'unidad',
      productData.status || 'active',
      productData.image_url
    ];
    const result = await query(sql, params);
    return result.insertId;
  }

  // Actualizar producto
  static async update(id, productData) {
    const sql = `
      UPDATE products 
      SET name = ?, 
          description = ?, 
          category_id = ?, 
          price = ?, 
          cost = ?,
          min_stock_level = ?,
          max_stock_level = ?,
          unit = ?,
          status = ?,
          image_url = ?
      WHERE id = ?
    `;
    const params = [
      productData.name,
      productData.description,
      productData.category_id,
      productData.price,
      productData.cost,
      productData.min_stock_level,
      productData.max_stock_level,
      productData.unit,
      productData.status,
      productData.image_url,
      id
    ];
    return await query(sql, params);
  }

  // Actualizar stock
  static async updateStock(id, quantity, movementType = 'adjustment', notes = '', createdBy = 'Sistema') {
    const sql = 'CALL sp_update_product_stock(?, ?, ?, ?, ?)';
    return await query(sql, [id, quantity, movementType, notes, createdBy]);
  }

  // Eliminar producto
  static async delete(id) {
    const sql = 'DELETE FROM products WHERE id = ?';
    return await query(sql, [id]);
  }

  // Obtener productos con stock bajo
  static async getLowStock() {
    const sql = `
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.stock_quantity <= p.min_stock_level
      AND p.status = 'active'
      ORDER BY p.stock_quantity ASC
    `;
    return await query(sql);
  }

  // Obtener movimientos de stock de un producto
  static async getStockMovements(productId) {
    const sql = `
      SELECT * FROM stock_movements
      WHERE product_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `;
    return await query(sql, [productId]);
  }
}

export default Product;
