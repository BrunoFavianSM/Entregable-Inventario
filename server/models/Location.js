import { query } from '../config/database.js';

class Location {
  // Obtener todas las ubicaciones
  static async getAll() {
    const sql = `
      SELECT 
        l.*,
        COUNT(pl.product_id) as products_count
      FROM locations l
      LEFT JOIN product_locations pl ON l.id = pl.location_id
      GROUP BY l.id
      ORDER BY l.created_at DESC
    `;
    return await query(sql);
  }

  // Obtener ubicación por ID
  static async getById(id) {
    const sql = 'SELECT * FROM locations WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0];
  }

  // Obtener ubicaciones activas
  static async getActive() {
    const sql = 'SELECT * FROM locations WHERE is_active = TRUE ORDER BY name';
    return await query(sql);
  }

  // Buscar ubicaciones
  static async search(searchTerm) {
    const sql = `
      SELECT * FROM locations
      WHERE name LIKE ? 
        OR address LIKE ?
        OR description LIKE ?
      ORDER BY name
    `;
    const term = `%${searchTerm}%`;
    return await query(sql, [term, term, term]);
  }

  // Crear ubicación
  static async create(locationData) {
    const sql = `
      INSERT INTO locations (
        name, description, address, latitude, longitude, 
        location_type, is_active, contact_name, contact_phone
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      locationData.name,
      locationData.description,
      locationData.address,
      locationData.latitude,
      locationData.longitude,
      locationData.location_type || 'warehouse',
      locationData.is_active !== undefined ? locationData.is_active : true,
      locationData.contact_name,
      locationData.contact_phone
    ];
    const result = await query(sql, params);
    return result.insertId;
  }

  // Actualizar ubicación
  static async update(id, locationData) {
    const sql = `
      UPDATE locations 
      SET name = ?, 
          description = ?, 
          address = ?, 
          latitude = ?,
          longitude = ?,
          location_type = ?,
          is_active = ?,
          contact_name = ?,
          contact_phone = ?
      WHERE id = ?
    `;
    const params = [
      locationData.name,
      locationData.description,
      locationData.address,
      locationData.latitude,
      locationData.longitude,
      locationData.location_type,
      locationData.is_active,
      locationData.contact_name,
      locationData.contact_phone,
      id
    ];
    return await query(sql, params);
  }

  // Eliminar ubicación
  static async delete(id) {
    const sql = 'DELETE FROM locations WHERE id = ?';
    return await query(sql, [id]);
  }

  // Obtener productos en una ubicación
  static async getProducts(locationId) {
    const sql = `
      SELECT 
        pl.*,
        p.name,
        p.sku,
        p.price,
        p.unit,
        p.image_url
      FROM product_locations pl
      INNER JOIN products p ON pl.product_id = p.id
      WHERE pl.location_id = ?
      ORDER BY p.name
    `;
    return await query(sql, [locationId]);
  }

  // Asignar producto a ubicación
  static async addProduct(locationId, productId, quantity) {
    const sql = `
      INSERT INTO product_locations (location_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + ?
    `;
    return await query(sql, [locationId, productId, quantity, quantity]);
  }

  // Actualizar cantidad de producto en ubicación
  static async updateProductQuantity(locationId, productId, quantity) {
    const sql = `
      UPDATE product_locations 
      SET quantity = ? 
      WHERE location_id = ? AND product_id = ?
    `;
    return await query(sql, [quantity, locationId, productId]);
  }

  // Eliminar producto de ubicación
  static async removeProduct(locationId, productId) {
    const sql = 'DELETE FROM product_locations WHERE location_id = ? AND product_id = ?';
    return await query(sql, [locationId, productId]);
  }

  // Obtener ubicaciones por tipo
  static async getByType(type) {
    const sql = 'SELECT * FROM locations WHERE location_type = ? ORDER BY name';
    return await query(sql, [type]);
  }

  // Obtener ubicaciones cercanas (ejemplo simplificado)
  static async getNearby(latitude, longitude, radiusKm = 10) {
    const sql = `
      SELECT *,
        (6371 * acos(
          cos(radians(?)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(?)) +
          sin(radians(?)) * sin(radians(latitude))
        )) AS distance
      FROM locations
      WHERE is_active = TRUE
      HAVING distance < ?
      ORDER BY distance
    `;
    return await query(sql, [latitude, longitude, latitude, radiusKm]);
  }

  // Obtener estadísticas de ubicaciones
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_locations,
        SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_locations,
        SUM(CASE WHEN location_type = 'warehouse' THEN 1 ELSE 0 END) as warehouses,
        SUM(CASE WHEN location_type = 'store' THEN 1 ELSE 0 END) as stores
      FROM locations
    `;
    const results = await query(sql);
    return results[0];
  }
}

export default Location;
