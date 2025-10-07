-- ============================================
-- DATOS DE PRUEBA
-- Sistema de Gestión de Inventario
-- ============================================

USE gestion_inventario;

-- ============================================
-- Insertar Categorías
-- ============================================
INSERT INTO categories (name, description) VALUES
('Electrónica', 'Productos electrónicos y tecnológicos'),
('Alimentos', 'Productos alimenticios'),
('Ropa', 'Prendas de vestir'),
('Hogar', 'Artículos para el hogar'),
('Deportes', 'Artículos deportivos'),
('Oficina', 'Suministros de oficina');

-- ============================================
-- Insertar Productos
-- ============================================
INSERT INTO products (name, sku, description, category_id, price, cost, stock_quantity, min_stock_level, max_stock_level, unit, status, image_url) VALUES
('Laptop HP Pavilion 15', 'ELEC-001', 'Laptop HP Pavilion 15" Intel i5 8GB RAM 256GB SSD', 1, 2499.00, 1800.00, 15, 5, 50, 'unidad', 'active', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'),
('Mouse Logitech G502', 'ELEC-002', 'Mouse gaming Logitech G502 RGB', 1, 189.00, 120.00, 45, 10, 100, 'unidad', 'active', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400'),
('Teclado Mecánico RGB', 'ELEC-003', 'Teclado mecánico gaming con retroiluminación RGB', 1, 249.00, 150.00, 30, 8, 60, 'unidad', 'active', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'),
('Monitor LG 24"', 'ELEC-004', 'Monitor LG 24 pulgadas Full HD IPS', 1, 699.00, 450.00, 8, 5, 30, 'unidad', 'active', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'),
('Auriculares Sony WH-1000XM4', 'ELEC-005', 'Auriculares inalámbricos con cancelación de ruido', 1, 1299.00, 900.00, 3, 5, 25, 'unidad', 'active', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400'),
('Arroz Premium 1kg', 'ALIM-001', 'Arroz grado premium bolsa de 1kg', 2, 4.50, 2.80, 250, 50, 500, 'kg', 'active', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
('Aceite Vegetal 1L', 'ALIM-002', 'Aceite vegetal embotellado 1 litro', 2, 8.90, 5.50, 180, 40, 300, 'litro', 'active', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'),
('Azúcar Blanca 1kg', 'ALIM-003', 'Azúcar blanca refinada 1kg', 2, 3.50, 2.20, 200, 50, 400, 'kg', 'active', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
('Leche Entera 1L', 'ALIM-004', 'Leche entera UHT 1 litro', 2, 4.20, 2.80, 120, 30, 250, 'litro', 'active', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'),
('Café Molido 250g', 'ALIM-005', 'Café molido premium 250g', 2, 15.90, 10.00, 80, 20, 150, 'paquete', 'active', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400'),
('Camiseta Polo Hombre', 'ROPA-001', 'Camiseta tipo polo 100% algodón', 3, 45.00, 25.00, 60, 15, 120, 'unidad', 'active', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'),
('Pantalón Jean Dama', 'ROPA-002', 'Pantalón jean stretch para dama', 3, 89.00, 50.00, 40, 10, 80, 'unidad', 'active', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400'),
('Zapatillas Deportivas', 'DEPO-001', 'Zapatillas deportivas para running', 5, 159.00, 90.00, 35, 10, 70, 'par', 'active', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
('Cuaderno A4 100 hojas', 'OFIC-001', 'Cuaderno espiral A4 100 hojas cuadriculado', 6, 8.50, 4.50, 150, 30, 300, 'unidad', 'active', 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400'),
('Bolígrafos Azul x12', 'OFIC-002', 'Pack de 12 bolígrafos tinta azul', 6, 12.00, 6.00, 200, 50, 400, 'pack', 'active', 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400');

-- ============================================
-- Insertar Clientes
-- ============================================
INSERT INTO customers (first_name, last_name, email, phone, address, city, document_type, document_number, customer_type, status) VALUES
('Juan', 'Pérez García', 'juan.perez@email.com', '987654321', 'Av. Principal 123', 'Lima', 'DNI', '12345678', 'regular', 'active'),
('María', 'González López', 'maria.gonzalez@email.com', '987654322', 'Jr. Comercio 456', 'Lima', 'DNI', '23456789', 'vip', 'active'),
('Carlos', 'Rodríguez Silva', 'carlos.rodriguez@email.com', '987654323', 'Av. Industrial 789', 'Callao', 'DNI', '34567890', 'wholesale', 'active'),
('Ana', 'Martínez Ramos', 'ana.martinez@email.com', '987654324', 'Calle Las Flores 321', 'Lima', 'DNI', '45678901', 'regular', 'active'),
('Luis', 'Fernández Torres', 'luis.fernandez@email.com', '987654325', 'Av. Central 654', 'Miraflores', 'DNI', '56789012', 'regular', 'active'),
('Rosa', 'Sánchez Díaz', 'rosa.sanchez@email.com', '987654326', 'Jr. Independencia 987', 'San Isidro', 'DNI', '67890123', 'vip', 'active'),
('Pedro', 'López Vargas', 'pedro.lopez@email.com', '987654327', 'Av. Universitaria 147', 'Los Olivos', 'DNI', '78901234', 'regular', 'active'),
('Carmen', 'Ruiz Mendoza', 'carmen.ruiz@email.com', '987654328', 'Calle Los Pinos 258', 'Surco', 'DNI', '89012345', 'wholesale', 'active');

-- ============================================
-- Insertar Ubicaciones (Coordenadas)
-- ============================================
INSERT INTO locations (name, description, address, latitude, longitude, location_type, contact_name, contact_phone) VALUES
('Almacén Principal', 'Almacén central de distribución', 'Av. Industrial 1000, Lima', -12.046374, -77.042793, 'warehouse', 'Roberto Almacén', '987111222'),
('Tienda Centro', 'Tienda ubicada en el centro de Lima', 'Jr. Unión 500, Lima Centro', -12.046863, -77.030190, 'store', 'Sandra Tienda', '987222333'),
('Tienda Norte', 'Sucursal en zona norte', 'Av. Túpac Amaru 2500, Los Olivos', -11.961851, -77.061924, 'store', 'Miguel Norte', '987333444'),
('Almacén Callao', 'Almacén secundario en el Callao', 'Av. Argentina 3000, Callao', -12.055890, -77.118269, 'warehouse', 'Jorge Callao', '987444555'),
('Tienda Miraflores', 'Tienda en distrito premium', 'Av. Larco 1234, Miraflores', -12.119280, -77.030644, 'store', 'Patricia Mira', '987555666'),
('Proveedor TechWorld', 'Ubicación de proveedor de electrónicos', 'Av. República de Panamá 5000, Surco', -12.106050, -76.999031, 'supplier', 'Ricardo Tech', '987666777');

-- ============================================
-- Insertar Proveedores
-- ============================================
INSERT INTO suppliers (name, contact_name, email, phone, address, city, tax_id, status) VALUES
('TechWorld SA', 'Ricardo Vega', 'contacto@techworld.com', '987111000', 'Av. República de Panamá 5000', 'Lima', '20123456789', 'active'),
('Distribuidora Alimentos SAC', 'Martha Rojas', 'ventas@distalimentos.com', '987222000', 'Av. Productores 2000', 'Lima', '20234567890', 'active'),
('Textiles del Perú EIRL', 'José Campos', 'info@textilesperu.com', '987333000', 'Jr. Gamarra 500', 'La Victoria', '20345678901', 'active'),
('Oficina Total SAC', 'Laura Quispe', 'ventas@oficinatotal.com', '987444000', 'Av. Javier Prado 1500', 'San Isidro', '20456789012', 'active');

-- ============================================
-- Insertar Ventas de Ejemplo
-- ============================================
INSERT INTO sales (sale_number, customer_id, total_amount, discount, tax, final_amount, payment_method, payment_status, served_by) VALUES
('VTA-2025-0001', 1, 189.00, 0.00, 34.02, 223.02, 'card', 'completed', 'Vendedor 1'),
('VTA-2025-0002', 2, 2499.00, 249.90, 404.84, 2653.94, 'card', 'completed', 'Vendedor 2'),
('VTA-2025-0003', 3, 1000.50, 100.05, 162.08, 1062.53, 'transfer', 'completed', 'Vendedor 1'),
('VTA-2025-0004', 4, 45.00, 0.00, 8.10, 53.10, 'cash', 'completed', 'Vendedor 3'),
('VTA-2025-0005', 5, 159.00, 0.00, 28.62, 187.62, 'cash', 'completed', 'Vendedor 2');

-- ============================================
-- Insertar Detalles de Venta
-- ============================================
-- NO insertamos detalles aquí porque el trigger actualizará automáticamente el stock
-- En su lugar, estos se crearán a través de la aplicación

-- ============================================
-- Insertar Configuración del Sistema
-- ============================================
INSERT INTO system_config (config_key, config_value, description) VALUES
('company_name', 'Sistema de Gestión de Inventario', 'Nombre de la empresa'),
('tax_rate', '18', 'Tasa de impuesto IGV en porcentaje'),
('currency', 'PEN', 'Moneda del sistema (Soles Peruanos)'),
('low_stock_alert_enabled', 'true', 'Habilitar alertas de stock bajo'),
('email_notifications', 'true', 'Habilitar notificaciones por email'),
('default_language', 'es', 'Idioma por defecto del sistema');

-- ============================================
-- Insertar Relación Productos - Ubicaciones
-- ============================================
INSERT INTO product_locations (product_id, location_id, quantity) VALUES
-- Almacén Principal tiene la mayoría del stock
(1, 1, 10),
(2, 1, 30),
(3, 1, 20),
(4, 1, 5),
(5, 1, 2),
-- Tienda Centro
(1, 2, 3),
(2, 2, 10),
(3, 2, 5),
(6, 2, 50),
(7, 2, 30),
-- Tienda Norte
(11, 3, 30),
(12, 3, 20),
(13, 3, 15);
