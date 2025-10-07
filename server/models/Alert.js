import { query } from '../config/database.js';

class Alert {
  // Obtener todas las alertas
  static async getAll() {
    const sql = `
      SELECT 
        sa.*,
        p.name as product_name,
        p.sku,
        p.stock_quantity,
        p.min_stock_level
      FROM stock_alerts sa
      INNER JOIN products p ON sa.product_id = p.id
      ORDER BY sa.is_resolved ASC, sa.created_at DESC
    `;
    return await query(sql);
  }

  // Obtener alertas activas
  static async getActive() {
    const sql = `
      SELECT 
        sa.*,
        p.name as product_name,
        p.sku,
        p.stock_quantity,
        p.min_stock_level,
        p.image_url
      FROM stock_alerts sa
      INNER JOIN products p ON sa.product_id = p.id
      WHERE sa.is_resolved = FALSE
      ORDER BY 
        CASE sa.alert_level
          WHEN 'critical' THEN 1
          WHEN 'warning' THEN 2
          WHEN 'info' THEN 3
        END,
        sa.created_at DESC
    `;
    return await query(sql);
  }

  // Obtener alerta por ID
  static async getById(id) {
    const sql = `
      SELECT 
        sa.*,
        p.name as product_name,
        p.sku,
        p.stock_quantity
      FROM stock_alerts sa
      INNER JOIN products p ON sa.product_id = p.id
      WHERE sa.id = ?
    `;
    const results = await query(sql, [id]);
    return results[0];
  }

  // Obtener alertas por producto
  static async getByProduct(productId) {
    const sql = `
      SELECT * FROM stock_alerts
      WHERE product_id = ?
      ORDER BY created_at DESC
    `;
    return await query(sql, [productId]);
  }

  // Crear alerta manualmente
  static async create(alertData) {
    const sql = `
      INSERT INTO stock_alerts (
        product_id, alert_type, alert_level, message
      )
      VALUES (?, ?, ?, ?)
    `;
    const params = [
      alertData.product_id,
      alertData.alert_type,
      alertData.alert_level || 'warning',
      alertData.message
    ];
    const result = await query(sql, params);
    return result.insertId;
  }

  // Resolver alerta
  static async resolve(id) {
    const sql = `
      UPDATE stock_alerts 
      SET is_resolved = TRUE, 
          resolved_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    return await query(sql, [id]);
  }

  // Resolver todas las alertas de un producto
  static async resolveByProduct(productId) {
    const sql = `
      UPDATE stock_alerts 
      SET is_resolved = TRUE, 
          resolved_at = CURRENT_TIMESTAMP 
      WHERE product_id = ? 
      AND is_resolved = FALSE
    `;
    return await query(sql, [productId]);
  }

  // Eliminar alerta
  static async delete(id) {
    const sql = 'DELETE FROM stock_alerts WHERE id = ?';
    return await query(sql, [id]);
  }

  // Obtener conteo de alertas por nivel
  static async getCountByLevel() {
    const sql = `
      SELECT 
        alert_level,
        COUNT(*) as count
      FROM stock_alerts
      WHERE is_resolved = FALSE
      GROUP BY alert_level
    `;
    return await query(sql);
  }

  // Obtener estadísticas de alertas
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_alerts,
        SUM(CASE WHEN is_resolved = FALSE THEN 1 ELSE 0 END) as active_alerts,
        SUM(CASE WHEN is_resolved = FALSE AND alert_level = 'critical' THEN 1 ELSE 0 END) as critical_alerts,
        SUM(CASE WHEN is_resolved = FALSE AND alert_level = 'warning' THEN 1 ELSE 0 END) as warning_alerts,
        SUM(CASE WHEN is_resolved = FALSE AND alert_level = 'info' THEN 1 ELSE 0 END) as info_alerts
      FROM stock_alerts
    `;
    const results = await query(sql);
    return results[0];
  }
}

export default Alert;
