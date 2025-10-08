-- ============================================
-- PROCEDIMIENTOS ALMACENADOS
-- Sistema de Gestión de Inventario
-- COMPATIBLE CON XAMPP/MariaDB
-- ============================================

USE nova_salud_inventario;

DELIMITER $$

-- ============================================
-- Procedimiento: Obtener productos con stock bajo
-- ============================================
DROP PROCEDURE IF EXISTS sp_get_low_stock_products$$
CREATE PROCEDURE sp_get_low_stock_products()
BEGIN
    SELECT 
        p.id,
        p.name,
        p.sku,
        p.stock_quantity,
        p.min_stock_level,
        c.name as category_name,
        CASE 
            WHEN p.stock_quantity = 0 THEN 'Sin Stock'
            WHEN p.stock_quantity <= p.min_stock_level THEN 'Stock Bajo'
            ELSE 'Normal'
        END as stock_status
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.stock_quantity <= p.min_stock_level
    AND p.status = 'active'
    ORDER BY p.stock_quantity ASC;
END$$

-- ============================================
-- Procedimiento: Reporte de ventas por período
-- ============================================
DROP PROCEDURE IF EXISTS sp_sales_report$$
CREATE PROCEDURE sp_sales_report(
    IN start_date DATE,
    IN end_date DATE
)
BEGIN
    SELECT 
        DATE(s.sale_date) as fecha,
        COUNT(s.id) as total_ventas,
        SUM(s.final_amount) as monto_total,
        AVG(s.final_amount) as promedio_venta,
        SUM(s.discount) as total_descuentos,
        GROUP_CONCAT(DISTINCT s.payment_method) as metodos_pago
    FROM sales s
    WHERE DATE(s.sale_date) BETWEEN start_date AND end_date
    AND s.payment_status = 'completed'
    GROUP BY DATE(s.sale_date)
    ORDER BY fecha DESC;
END$$

-- ============================================
-- Procedimiento: Top productos más vendidos
-- ============================================
DROP PROCEDURE IF EXISTS sp_top_selling_products$$
CREATE PROCEDURE sp_top_selling_products(
    IN limit_count INT
)
BEGIN
    SELECT 
        p.id,
        p.name,
        p.sku,
        SUM(sd.quantity) as total_vendido,
        SUM(sd.subtotal) as ingresos_generados,
        COUNT(DISTINCT sd.sale_id) as numero_ventas
    FROM products p
    INNER JOIN sale_details sd ON p.id = sd.product_id
    INNER JOIN sales s ON sd.sale_id = s.id
    WHERE s.payment_status = 'completed'
    GROUP BY p.id, p.name, p.sku
    ORDER BY total_vendido DESC
    LIMIT limit_count;
END$$

-- ============================================
-- Procedimiento: Actualizar stock de producto
-- ============================================
DROP PROCEDURE IF EXISTS sp_update_product_stock$$
CREATE PROCEDURE sp_update_product_stock(
    IN p_product_id INT,
    IN p_quantity INT,
    IN p_movement_type ENUM('entry', 'exit', 'adjustment', 'return'),
    IN p_notes TEXT,
    IN p_created_by VARCHAR(100)
)
BEGIN
    DECLARE current_stock INT;
    DECLARE new_stock INT;
    
    -- Obtener stock actual
    SELECT stock_quantity INTO current_stock 
    FROM products 
    WHERE id = p_product_id;
    
    -- Calcular nuevo stock
    IF p_movement_type = 'entry' OR p_movement_type = 'return' THEN
        SET new_stock = current_stock + p_quantity;
    ELSE
        SET new_stock = current_stock - p_quantity;
    END IF;
    
    -- Validar que no sea negativo
    IF new_stock < 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Stock insuficiente para realizar la operación';
    END IF;
    
    -- Actualizar stock
    UPDATE products 
    SET stock_quantity = new_stock 
    WHERE id = p_product_id;
    
    -- Registrar movimiento
    INSERT INTO stock_movements (
        product_id, movement_type, quantity, previous_stock, 
        new_stock, reference_type, notes, created_by
    )
    VALUES (
        p_product_id, p_movement_type, p_quantity, current_stock, 
        new_stock, 'adjustment', p_notes, p_created_by
    );
    
    SELECT new_stock as nuevo_stock;
END$$

-- ============================================
-- Procedimiento: Procesar venta completa
-- NOTA: Este procedimiento ha sido REMOVIDO porque usa JSON
-- que no es compatible con MariaDB/XAMPP.
-- Las ventas se procesan directamente desde el backend Node.js
-- ============================================
-- DROP PROCEDURE IF EXISTS sp_process_sale$$

-- ============================================
-- Procedimiento: Dashboard - Estadísticas generales
-- ============================================
DROP PROCEDURE IF EXISTS sp_dashboard_stats$$
CREATE PROCEDURE sp_dashboard_stats()
BEGIN
    -- Total de productos
    SELECT COUNT(*) INTO @total_productos FROM products WHERE status = 'active';
    
    -- Total de ventas del mes actual
    SELECT COALESCE(SUM(final_amount), 0) INTO @ventas_mes
    FROM sales 
    WHERE MONTH(sale_date) = MONTH(CURDATE()) 
    AND YEAR(sale_date) = YEAR(CURDATE())
    AND payment_status = 'completed';
    
    -- Total de clientes activos
    SELECT COUNT(*) INTO @total_clientes FROM customers WHERE status = 'active';
    
    -- Alertas activas
    SELECT COUNT(*) INTO @alertas_activas FROM stock_alerts WHERE is_resolved = FALSE;
    
    -- Productos con stock bajo
    SELECT COUNT(*) INTO @productos_stock_bajo 
    FROM products 
    WHERE stock_quantity <= min_stock_level 
    AND status = 'active';
    
    -- Retornar resultados
    SELECT 
        @total_productos as total_productos,
        @ventas_mes as ventas_mes,
        @total_clientes as total_clientes,
        @alertas_activas as alertas_activas,
        @productos_stock_bajo as productos_stock_bajo;
END$$

-- ============================================
-- Procedimiento: Buscar productos por nombre o SKU
-- ============================================
DROP PROCEDURE IF EXISTS sp_search_products$$
CREATE PROCEDURE sp_search_products(
    IN search_term VARCHAR(200)
)
BEGIN
    SELECT 
        p.id,
        p.name,
        p.sku,
        p.description,
        p.price,
        p.stock_quantity,
        p.min_stock_level,
        p.unit,
        p.status,
        c.name as category_name,
        CASE 
            WHEN p.stock_quantity = 0 THEN 'Sin Stock'
            WHEN p.stock_quantity <= p.min_stock_level THEN 'Stock Bajo'
            ELSE 'Disponible'
        END as stock_status
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE (p.name LIKE CONCAT('%', search_term, '%') 
        OR p.sku LIKE CONCAT('%', search_term, '%')
        OR p.description LIKE CONCAT('%', search_term, '%'))
    AND p.status = 'active'
    ORDER BY p.name;
END$$

-- ============================================
-- Procedimiento: Obtener historial de cliente
-- ============================================
DROP PROCEDURE IF EXISTS sp_customer_history$$
CREATE PROCEDURE sp_customer_history(
    IN p_customer_id INT
)
BEGIN
    SELECT 
        s.id,
        s.sale_number,
        s.sale_date,
        s.final_amount,
        s.payment_method,
        s.payment_status,
        COUNT(sd.id) as items_count
    FROM sales s
    LEFT JOIN sale_details sd ON s.id = sd.sale_id
    WHERE s.customer_id = p_customer_id
    GROUP BY s.id, s.sale_number, s.sale_date, s.final_amount, s.payment_method, s.payment_status
    ORDER BY s.sale_date DESC;
END$$

DELIMITER ;
