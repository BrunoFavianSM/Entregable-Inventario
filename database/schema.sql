-- ============================================
-- SISTEMA DE GESTIÓN DE INVENTARIO - BOTICA NOVA SALUD
-- Base de Datos MySQL - Adaptado para Farmacia
-- ============================================


-- Crear base de datos
-- 
--CREATE DATABASE nova_salud_inventario CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--


CREATE DATABASE IF NOT EXISTS nova_salud_inventario CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nova_salud_inventario;

-- ============================================
-- TABLA: Categorías de Productos
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category_name (name)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: Productos
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    category_id INT,
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    min_stock_level INT NOT NULL DEFAULT 10,
    max_stock_level INT NOT NULL DEFAULT 100,
    unit VARCHAR(50) DEFAULT 'unidad',
    status ENUM('active', 'inactive', 'discontinued') DEFAULT 'active',
    image_url VARCHAR(500),
    -- Campos específicos para farmacia
    expiration_date DATE,
    batch_number VARCHAR(100),
    requires_prescription BOOLEAN DEFAULT FALSE,
    active_ingredient VARCHAR(500),
    concentration VARCHAR(100),
    pharmaceutical_form ENUM('tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops', 'spray', 'other') DEFAULT 'other',
    manufacturer VARCHAR(200),
    sanitary_registration VARCHAR(100),
    contraindications TEXT,
    dosage_instructions TEXT,
    storage_conditions TEXT,
    is_controlled_substance BOOLEAN DEFAULT FALSE,
    therapeutic_class VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_product_sku (sku),
    INDEX idx_product_name (name),
    INDEX idx_product_stock (stock_quantity),
    INDEX idx_product_status (status),
    INDEX idx_product_expiration (expiration_date),
    INDEX idx_product_prescription (requires_prescription),
    INDEX idx_product_controlled (is_controlled_substance),
    INDEX idx_product_batch (batch_number)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: Clientes
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Perú',
    document_type ENUM('DNI', 'RUC', 'CE', 'Pasaporte') DEFAULT 'DNI',
    document_number VARCHAR(20) UNIQUE,
    customer_type ENUM('regular', 'wholesale', 'vip') DEFAULT 'regular',
    status ENUM('active', 'inactive') DEFAULT 'active',
    total_purchases DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_customer_email (email),
    INDEX idx_customer_document (document_number),
    INDEX idx_customer_name (first_name, last_name)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: Ventas
-- ============================================
CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'card', 'transfer', 'credit') DEFAULT 'cash',
    payment_status ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed',
    notes TEXT,
    served_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    INDEX idx_sale_number (sale_number),
    INDEX idx_sale_date (sale_date),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: Detalles de Venta
-- ============================================
CREATE TABLE IF NOT EXISTS sale_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_sale_detail_sale (sale_id),
    INDEX idx_sale_detail_product (product_id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: Recetas Médicas
-- ============================================
CREATE TABLE IF NOT EXISTS prescriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    doctor_name VARCHAR(200) NOT NULL,
    doctor_license VARCHAR(50),
    issue_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    diagnosis TEXT,
    notes TEXT,
    status ENUM('pending', 'partial', 'completed', 'expired') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_prescription_number (prescription_number),
    INDEX idx_prescription_customer (customer_id),
    INDEX idx_prescription_status (status),
    INDEX idx_prescription_expiration (expiration_date)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: Detalles de Receta
-- ============================================
CREATE TABLE IF NOT EXISTS prescription_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity_prescribed INT NOT NULL,
    quantity_dispensed INT DEFAULT 0,
    dosage_instructions TEXT,
    treatment_duration VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_prescription_detail_prescription (prescription_id),
    INDEX idx_prescription_detail_product (product_id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: Alertas de Stock (Mejorada para Farmacia)
-- ============================================
CREATE TABLE IF NOT EXISTS stock_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    alert_type ENUM('low_stock', 'out_of_stock', 'overstock', 'expiring_soon', 'expired', 'controlled_substance') NOT NULL,
    alert_level ENUM('info', 'warning', 'critical', 'urgent') DEFAULT 'warning',
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP NULL,
    expiration_date DATE NULL,
    requires_immediate_action BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_alert_product (product_id),
    INDEX idx_alert_resolved (is_resolved),
    INDEX idx_alert_type (alert_type),
    INDEX idx_alert_level (alert_level),
    INDEX idx_alert_expiration (expiration_date)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: Historial de Movimientos de Stock
-- ============================================
CREATE TABLE IF NOT EXISTS stock_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    movement_type ENUM('entry', 'exit', 'adjustment', 'return') NOT NULL,
    quantity INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    reference_type ENUM('sale', 'purchase', 'adjustment', 'other') NOT NULL,
    reference_id INT,
    notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_movement_product (product_id),
    INDEX idx_movement_type (movement_type),
    INDEX idx_movement_date (created_at)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: Ubicaciones (Coordenadas)
-- ============================================
CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    address TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location_type ENUM('warehouse', 'store', 'customer', 'supplier', 'other') DEFAULT 'warehouse',
    is_active BOOLEAN DEFAULT TRUE,
    contact_name VARCHAR(100),
    contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location_coordinates (latitude, longitude),
    INDEX idx_location_type (location_type),
    INDEX idx_location_active (is_active)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: Relación Productos - Ubicaciones
-- ============================================
CREATE TABLE IF NOT EXISTS product_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    location_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_location (product_id, location_id),
    INDEX idx_product_location (product_id, location_id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: Proveedores
-- ============================================
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    contact_name VARCHAR(100),
    email VARCHAR(150),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Perú',
    tax_id VARCHAR(20) UNIQUE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_supplier_name (name),
    INDEX idx_supplier_status (status)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: Configuración del Sistema
-- ============================================
CREATE TABLE IF NOT EXISTS system_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- TRIGGERS: Actualización Automática de Alertas (Mejorado para Farmacia)
-- ============================================

DELIMITER $$

-- Trigger para crear alertas cuando el stock cambia
CREATE TRIGGER after_product_stock_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    -- Alerta de stock bajo (crítico para medicamentos esenciales)
    IF NEW.stock_quantity <= NEW.min_stock_level AND NEW.stock_quantity > 0 THEN
        INSERT INTO stock_alerts (product_id, alert_type, alert_level, message, requires_immediate_action)
        VALUES (
            NEW.id,
            'low_stock',
            CASE 
                WHEN NEW.requires_prescription = TRUE OR NEW.is_controlled_substance = TRUE THEN 'critical'
                ELSE 'warning'
            END,
            CONCAT('MEDICAMENTO "', NEW.name, '" con stock bajo: ', NEW.stock_quantity, ' unidades. ', 
                   CASE WHEN NEW.requires_prescription = TRUE THEN 'REQUIERE RECETA MÉDICA. ' ELSE '' END,
                   CASE WHEN NEW.is_controlled_substance = TRUE THEN 'SUSTANCIA CONTROLADA. ' ELSE '' END),
            CASE 
                WHEN NEW.requires_prescription = TRUE OR NEW.is_controlled_substance = TRUE THEN TRUE
                ELSE FALSE
            END
        )
        ON DUPLICATE KEY UPDATE 
            is_resolved = FALSE,
            updated_at = CURRENT_TIMESTAMP;
    END IF;
    
    -- Alerta de sin stock (urgente para medicamentos)
    IF NEW.stock_quantity = 0 THEN
        INSERT INTO stock_alerts (product_id, alert_type, alert_level, message, requires_immediate_action)
        VALUES (
            NEW.id,
            'out_of_stock',
            'urgent',
            CONCAT('MEDICAMENTO "', NEW.name, '" SIN STOCK - REABASTECER INMEDIATAMENTE'),
            TRUE
        )
        ON DUPLICATE KEY UPDATE 
            is_resolved = FALSE,
            updated_at = CURRENT_TIMESTAMP;
    END IF;
    
    -- Alerta de sobre stock
    IF NEW.stock_quantity >= NEW.max_stock_level THEN
        INSERT INTO stock_alerts (product_id, alert_type, alert_level, message)
        VALUES (
            NEW.id,
            'overstock',
            'info',
            CONCAT('El medicamento "', NEW.name, '" tiene sobre stock: ', NEW.stock_quantity, ' unidades')
        )
        ON DUPLICATE KEY UPDATE 
            is_resolved = FALSE,
            updated_at = CURRENT_TIMESTAMP;
    END IF;
    
    -- Resolver alertas si el stock está normalizado
    IF NEW.stock_quantity > NEW.min_stock_level AND NEW.stock_quantity < NEW.max_stock_level THEN
        UPDATE stock_alerts 
        SET is_resolved = TRUE, resolved_at = CURRENT_TIMESTAMP
        WHERE product_id = NEW.id AND alert_type IN ('low_stock', 'out_of_stock', 'overstock') AND is_resolved = FALSE;
    END IF;
END$$

-- Trigger para alertas de vencimiento
CREATE TRIGGER after_product_insert_or_update
AFTER INSERT ON products
FOR EACH ROW
BEGIN
    -- Alerta de medicamento próximo a vencer (30 días)
    IF NEW.expiration_date IS NOT NULL AND NEW.expiration_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN
        INSERT INTO stock_alerts (product_id, alert_type, alert_level, message, expiration_date, requires_immediate_action)
        VALUES (
            NEW.id,
            CASE 
                WHEN NEW.expiration_date <= CURDATE() THEN 'expired'
                ELSE 'expiring_soon'
            END,
            CASE 
                WHEN NEW.expiration_date <= CURDATE() THEN 'urgent'
                WHEN NEW.expiration_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 'critical'
                ELSE 'warning'
            END,
            CASE 
                WHEN NEW.expiration_date <= CURDATE() THEN 
                    CONCAT('MEDICAMENTO VENCIDO: "', NEW.name, '" - Lote: ', IFNULL(NEW.batch_number, 'N/A'), ' - RETIRAR INMEDIATAMENTE')
                ELSE 
                    CONCAT('Medicamento próximo a vencer: "', NEW.name, '" - Vence: ', NEW.expiration_date, ' - Lote: ', IFNULL(NEW.batch_number, 'N/A'))
            END,
            NEW.expiration_date,
            CASE WHEN NEW.expiration_date <= CURDATE() THEN TRUE ELSE FALSE END
        );
    END IF;
    
    -- Alerta para sustancias controladas
    IF NEW.is_controlled_substance = TRUE THEN
        INSERT INTO stock_alerts (product_id, alert_type, alert_level, message, requires_immediate_action)
        VALUES (
            NEW.id,
            'controlled_substance',
            'info',
            CONCAT('Sustancia controlada registrada: "', NEW.name, '" - Requiere control especial'),
            FALSE
        );
    END IF;
END$$

-- Trigger para registrar movimientos de stock
CREATE TRIGGER after_sale_detail_insert
AFTER INSERT ON sale_details
FOR EACH ROW
BEGIN
    DECLARE current_stock INT;
    
    -- Obtener stock actual
    SELECT stock_quantity INTO current_stock FROM products WHERE id = NEW.product_id;
    
    -- Registrar movimiento
    INSERT INTO stock_movements (
        product_id, movement_type, quantity, previous_stock, new_stock, 
        reference_type, reference_id, notes
    )
    VALUES (
        NEW.product_id, 'exit', NEW.quantity, current_stock, 
        current_stock - NEW.quantity, 'sale', NEW.sale_id, 
        'Venta automática'
    );
    
    -- Actualizar stock del producto
    UPDATE products 
    SET stock_quantity = stock_quantity - NEW.quantity 
    WHERE id = NEW.product_id;
END$$

-- Trigger para actualizar total de compras del cliente
CREATE TRIGGER after_sale_insert
AFTER INSERT ON sales
FOR EACH ROW
BEGIN
    IF NEW.customer_id IS NOT NULL THEN
        UPDATE customers 
        SET total_purchases = total_purchases + NEW.final_amount
        WHERE id = NEW.customer_id;
    END IF;
END$$

DELIMITER ;
