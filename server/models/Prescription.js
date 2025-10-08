import { query } from '../config/database.js';

class Prescription {
  // Obtener todas las recetas
  static async getAll() {
    const sql = `
      SELECT 
        p.*,
        c.first_name,
        c.last_name,
        c.phone,
        c.email,
        COUNT(pd.id) as total_items,
        SUM(pd.quantity_prescribed) as total_quantity_prescribed,
        SUM(pd.quantity_dispensed) as total_quantity_dispensed
      FROM prescriptions p
      LEFT JOIN customers c ON p.customer_id = c.id
      LEFT JOIN prescription_details pd ON p.id = pd.prescription_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
    return await query(sql);
  }

  // Obtener receta por ID
  static async getById(id) {
    const sql = `
      SELECT 
        p.*,
        c.first_name,
        c.last_name,
        c.phone,
        c.email,
        c.address
      FROM prescriptions p
      LEFT JOIN customers c ON p.customer_id = c.id
      WHERE p.id = ?
    `;
    const results = await query(sql, [id]);
    
    if (results.length === 0) {
      return null;
    }
    
    const prescription = results[0];
    
    // Obtener detalles de la receta
    const detailsSql = `
      SELECT 
        pd.*,
        pr.name as product_name,
        pr.sku,
        pr.price,
        pr.stock_quantity
      FROM prescription_details pd
      LEFT JOIN products pr ON pd.product_id = pr.id
      WHERE pd.prescription_id = ?
    `;
    prescription.details = await query(detailsSql, [id]);
    
    return prescription;
  }

  // Buscar recetas
  static async search(searchTerm) {
    const sql = `
      SELECT 
        p.*,
        c.first_name,
        c.last_name,
        c.phone
      FROM prescriptions p
      LEFT JOIN customers c ON p.customer_id = c.id
      WHERE p.prescription_number LIKE ? 
        OR c.first_name LIKE ?
        OR c.last_name LIKE ?
        OR p.doctor_name LIKE ?
      ORDER BY p.created_at DESC
    `;
    const term = `%${searchTerm}%`;
    return await query(sql, [term, term, term, term]);
  }

  // Crear receta
  static async create(prescriptionData) {
    const sql = `
      INSERT INTO prescriptions (
        prescription_number, customer_id, doctor_name, doctor_license,
        issue_date, expiration_date, diagnosis, notes, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      prescriptionData.prescription_number,
      prescriptionData.customer_id,
      prescriptionData.doctor_name,
      prescriptionData.doctor_license,
      prescriptionData.issue_date,
      prescriptionData.expiration_date,
      prescriptionData.diagnosis,
      prescriptionData.notes,
      prescriptionData.status || 'pending'
    ];
    const result = await query(sql, params);
    
    // Insertar detalles de la receta
    if (prescriptionData.details && prescriptionData.details.length > 0) {
      for (const detail of prescriptionData.details) {
        await this.addDetail(result.insertId, detail);
      }
    }
    
    return result.insertId;
  }

  // Agregar detalle a una receta
  static async addDetail(prescriptionId, detailData) {
    const sql = `
      INSERT INTO prescription_details (
        prescription_id, product_id, quantity_prescribed,
        quantity_dispensed, dosage_instructions, treatment_duration
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      prescriptionId,
      detailData.product_id,
      detailData.quantity_prescribed,
      detailData.quantity_dispensed || 0,
      detailData.dosage_instructions,
      detailData.treatment_duration
    ];
    const result = await query(sql, params);
    return result.insertId;
  }

  // Actualizar receta
  static async update(id, prescriptionData) {
    const sql = `
      UPDATE prescriptions 
      SET doctor_name = ?,
          doctor_license = ?,
          issue_date = ?,
          expiration_date = ?,
          diagnosis = ?,
          notes = ?,
          status = ?
      WHERE id = ?
    `;
    const params = [
      prescriptionData.doctor_name,
      prescriptionData.doctor_license,
      prescriptionData.issue_date,
      prescriptionData.expiration_date,
      prescriptionData.diagnosis,
      prescriptionData.notes,
      prescriptionData.status,
      id
    ];
    return await query(sql, params);
  }

  // Actualizar estado de la receta
  static async updateStatus(id, status) {
    const sql = 'UPDATE prescriptions SET status = ? WHERE id = ?';
    return await query(sql, [status, id]);
  }

  // Dispensar medicamento (actualizar cantidad dispensada)
  static async dispenseDetail(detailId, quantityDispensed) {
    const sql = `
      UPDATE prescription_details 
      SET quantity_dispensed = quantity_dispensed + ?
      WHERE id = ?
    `;
    await query(sql, [quantityDispensed, detailId]);
    
    // Verificar si la receta está completamente dispensada
    const checkSql = `
      SELECT prescription_id,
        SUM(quantity_prescribed) as total_prescribed,
        SUM(quantity_dispensed) as total_dispensed
      FROM prescription_details
      WHERE id = ?
      GROUP BY prescription_id
    `;
    const result = await query(checkSql, [detailId]);
    
    if (result.length > 0) {
      const { prescription_id, total_prescribed, total_dispensed } = result[0];
      
      if (total_dispensed >= total_prescribed) {
        await this.updateStatus(prescription_id, 'completed');
      } else if (total_dispensed > 0) {
        await this.updateStatus(prescription_id, 'partial');
      }
    }
  }

  // Eliminar receta
  static async delete(id) {
    const sql = 'DELETE FROM prescriptions WHERE id = ?';
    return await query(sql, [id]);
  }

  // Obtener recetas por cliente
  static async getByCustomer(customerId) {
    const sql = `
      SELECT 
        p.*,
        COUNT(pd.id) as total_items
      FROM prescriptions p
      LEFT JOIN prescription_details pd ON p.id = pd.prescription_id
      WHERE p.customer_id = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
    return await query(sql, [customerId]);
  }

  // Obtener recetas pendientes
  static async getPending() {
    const sql = `
      SELECT 
        p.*,
        c.first_name,
        c.last_name,
        c.phone
      FROM prescriptions p
      LEFT JOIN customers c ON p.customer_id = c.id
      WHERE p.status IN ('pending', 'partial')
      AND p.expiration_date >= CURDATE()
      ORDER BY p.issue_date DESC
    `;
    return await query(sql);
  }

  // Obtener recetas expiradas
  static async getExpired() {
    const sql = `
      SELECT 
        p.*,
        c.first_name,
        c.last_name,
        c.phone
      FROM prescriptions p
      LEFT JOIN customers c ON p.customer_id = c.id
      WHERE p.expiration_date < CURDATE()
      AND p.status != 'completed'
      ORDER BY p.expiration_date DESC
    `;
    return await query(sql);
  }
}

export default Prescription;
