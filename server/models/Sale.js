import { query } from '../config/database.js';

class Sale {
  // Obtener todas las ventas
  static async getAll(limit = 100) {
    const sql = `
      SELECT 
        s.*,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.email as customer_email,
        COUNT(sd.id) as items_count
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      LEFT JOIN sale_details sd ON s.id = sd.sale_id
      GROUP BY s.id
      ORDER BY s.sale_date DESC
      LIMIT ?
    `;
    return await query(sql, [limit]);
  }

  // Obtener venta por ID con detalles
  static async getById(id) {
    const saleSql = `
      SELECT 
        s.*,
        c.first_name,
        c.last_name,
        c.email,
        c.phone,
        c.document_type,
        c.document_number
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      WHERE s.id = ?
    `;
    
    const detailsSql = `
      SELECT 
        sd.*,
        p.name as product_name,
        p.sku,
        p.unit
      FROM sale_details sd
      INNER JOIN products p ON sd.product_id = p.id
      WHERE sd.sale_id = ?
    `;
    
    const [sale] = await query(saleSql, [id]);
    const details = await query(detailsSql, [id]);
    
    return {
      ...sale,
      details
    };
  }

  // Crear venta con detalles
  static async create(saleData) {
    const connection = await query('SELECT 1'); // Get connection
    
    try {
      // Generar número de venta
      const yearMonth = new Date().toISOString().slice(0, 7).replace('-', '');
      const countSql = `
        SELECT COUNT(*) as count 
        FROM sales 
        WHERE sale_number LIKE ?
      `;
      const [countResult] = await query(countSql, [`VTA-${yearMonth}%`]);
      const saleNumber = `VTA-${yearMonth}-${String(countResult.count + 1).padStart(4, '0')}`;
      
      // Calcular totales
      let totalAmount = 0;
      saleData.items.forEach(item => {
        totalAmount += item.quantity * item.unit_price;
      });
      
      const discount = saleData.discount || 0;
      const taxRate = 18; // IGV 18%
      const taxAmount = (totalAmount - discount) * (taxRate / 100);
      const finalAmount = totalAmount - discount + taxAmount;
      
      // Insertar venta
      const saleSql = `
        INSERT INTO sales (
          sale_number, customer_id, total_amount, discount, 
          tax, final_amount, payment_method, payment_status, 
          notes, served_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const saleParams = [
        saleNumber,
        saleData.customer_id,
        totalAmount,
        discount,
        taxAmount,
        finalAmount,
        saleData.payment_method || 'cash',
        saleData.payment_status || 'completed',
        saleData.notes || '',
        saleData.served_by || 'Sistema'
      ];
      
      const saleResult = await query(saleSql, saleParams);
      const saleId = saleResult.insertId;
      
      // Insertar detalles y actualizar stock
      for (const item of saleData.items) {
        const detailSql = `
          INSERT INTO sale_details (
            sale_id, product_id, quantity, unit_price, subtotal, discount
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const subtotal = item.quantity * item.unit_price;
        await query(detailSql, [
          saleId,
          item.product_id,
          item.quantity,
          item.unit_price,
          subtotal,
          item.discount || 0
        ]);
      }
      
      return {
        id: saleId,
        sale_number: saleNumber,
        final_amount: finalAmount
      };
    } catch (error) {
      throw error;
    }
  }

  // Obtener ventas por rango de fechas
  static async getByDateRange(startDate, endDate) {
    const sql = `
      SELECT 
        s.*,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        COUNT(sd.id) as items_count
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      LEFT JOIN sale_details sd ON s.id = sd.sale_id
      WHERE DATE(s.sale_date) BETWEEN ? AND ?
      GROUP BY s.id
      ORDER BY s.sale_date DESC
    `;
    return await query(sql, [startDate, endDate]);
  }

  // Obtener reporte de ventas
  static async getSalesReport(startDate, endDate) {
    const sql = 'CALL sp_sales_report(?, ?)';
    return await query(sql, [startDate, endDate]);
  }

  // Cancelar venta
  static async cancel(id) {
    const sql = `
      UPDATE sales 
      SET payment_status = 'cancelled' 
      WHERE id = ?
    `;
    return await query(sql, [id]);
  }

  // Obtener estadísticas de ventas
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_sales,
        SUM(final_amount) as total_revenue,
        AVG(final_amount) as average_sale,
        SUM(CASE WHEN DATE(sale_date) = CURDATE() THEN 1 ELSE 0 END) as today_sales,
        SUM(CASE WHEN DATE(sale_date) = CURDATE() THEN final_amount ELSE 0 END) as today_revenue
      FROM sales
      WHERE payment_status = 'completed'
    `;
    const results = await query(sql);
    return results[0];
  }

  // Top productos más vendidos
  static async getTopProducts(limit = 10) {
    const sql = 'CALL sp_top_selling_products(?)';
    return await query(sql, [limit]);
  }
}

export default Sale;
