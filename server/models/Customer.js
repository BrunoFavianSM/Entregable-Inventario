import { query } from '../config/database.js';

class Customer {
  // Obtener todos los clientes
  static async getAll() {
    const sql = `
      SELECT 
        c.*,
        COUNT(s.id) as total_orders
      FROM customers c
      LEFT JOIN sales s ON c.id = s.customer_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;
    return await query(sql);
  }

  // Obtener cliente por ID
  static async getById(id) {
    const sql = 'SELECT * FROM customers WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0];
  }

  // Buscar clientes
  static async search(searchTerm) {
    const sql = `
      SELECT * FROM customers
      WHERE first_name LIKE ? 
        OR last_name LIKE ? 
        OR email LIKE ?
        OR document_number LIKE ?
      ORDER BY first_name, last_name
    `;
    const term = `%${searchTerm}%`;
    return await query(sql, [term, term, term, term]);
  }

  // Crear cliente
  static async create(customerData) {
    const sql = `
      INSERT INTO customers (
        first_name, last_name, email, phone, address, city, 
        country, document_type, document_number, customer_type, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      customerData.first_name,
      customerData.last_name,
      customerData.email,
      customerData.phone,
      customerData.address,
      customerData.city || 'Lima',
      customerData.country || 'Perú',
      customerData.document_type || 'DNI',
      customerData.document_number,
      customerData.customer_type || 'regular',
      customerData.status || 'active'
    ];
    const result = await query(sql, params);
    return result.insertId;
  }

  // Actualizar cliente
  static async update(id, customerData) {
    const sql = `
      UPDATE customers 
      SET first_name = ?, 
          last_name = ?, 
          email = ?, 
          phone = ?,
          address = ?,
          city = ?,
          country = ?,
          document_type = ?,
          document_number = ?,
          customer_type = ?,
          status = ?
      WHERE id = ?
    `;
    const params = [
      customerData.first_name,
      customerData.last_name,
      customerData.email,
      customerData.phone,
      customerData.address,
      customerData.city || 'Lima',
      customerData.country || 'Perú',
      customerData.document_type || 'DNI',
      customerData.document_number,
      customerData.customer_type || 'regular',
      customerData.status || 'active',
      id
    ];
    return await query(sql, params);
  }

  // Eliminar cliente
  static async delete(id) {
    const sql = 'DELETE FROM customers WHERE id = ?';
    return await query(sql, [id]);
  }

  // Obtener historial de compras del cliente
  static async getPurchaseHistory(id) {
    const sql = 'CALL sp_customer_history(?)';
    return await query(sql, [id]);
  }

  // Obtener estadísticas del cliente
  static async getStats(id) {
    const sql = `
      SELECT 
        c.id,
        c.first_name,
        c.last_name,
        c.email,
        c.customer_type,
        c.total_purchases,
        COUNT(s.id) as total_orders,
        MAX(s.sale_date) as last_purchase_date,
        AVG(s.final_amount) as average_order_value
      FROM customers c
      LEFT JOIN sales s ON c.id = s.customer_id
      WHERE c.id = ?
      GROUP BY c.id
    `;
    const results = await query(sql, [id]);
    return results[0];
  }

  // Obtener clientes VIP
  static async getVIPCustomers() {
    const sql = `
      SELECT * FROM customers
      WHERE customer_type = 'vip' 
      AND status = 'active'
      ORDER BY total_purchases DESC
    `;
    return await query(sql);
  }
}

export default Customer;
