-- ============================================
-- DATOS DE PRUEBA - BOTICA NOVA SALUD
-- Sistema de Gestión de Inventario Farmacéutico
-- ============================================

USE nova_salud_inventario;

-- ============================================
-- Insertar Categorías Farmacéuticas
-- ============================================
INSERT INTO categories (name, description) VALUES
('Analgésicos', 'Medicamentos para alivio del dolor'),
('Antibióticos', 'Medicamentos antimicrobianos'),
('Antiinflamatorios', 'Medicamentos antiinflamatorios'),
('Vitaminas y Suplementos', 'Vitaminas, minerales y suplementos nutricionales'),
('Cuidado Personal', 'Productos de higiene y cuidado personal'),
('Primeros Auxilios', 'Productos para primeros auxilios y curaciones'),
('Medicamentos Controlados', 'Medicamentos que requieren receta médica'),
('Productos Infantiles', 'Medicamentos y productos para bebés y niños'),
('Dermatológicos', 'Productos para el cuidado de la piel'),
('Respiratorios', 'Medicamentos para problemas respiratorios');

-- ============================================
-- Insertar Productos Farmacéuticos
-- ============================================
INSERT INTO products (name, sku, description, category_id, price, cost, stock_quantity, min_stock_level, max_stock_level, unit, status, image_url, expiration_date, batch_number, requires_prescription, active_ingredient, concentration, pharmaceutical_form, manufacturer, contraindications, dosage_instructions, is_controlled_substance, therapeutic_class) VALUES
-- Analgésicos
('Paracetamol 500mg', 'PAIN-001', 'Analgésico y antipirético', 1, 8.50, 5.20, 150, 30, 300, 'tableta', 'active', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', '2025-12-31', 'PAR2024001', FALSE, 'Paracetamol', '500mg', 'tablet', 'Laboratorios Bayer', 'Hipersensibilidad al paracetamol', '1-2 tabletas cada 6-8 horas', FALSE, 'Analgésico no opiáceo'),
('Ibuprofeno 400mg', 'PAIN-002', 'Antiinflamatorio no esteroideo', 1, 12.00, 7.50, 80, 20, 150, 'tableta', 'active', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', '2025-10-15', 'IBU2024002', FALSE, 'Ibuprofeno', '400mg', 'tablet', 'Pfizer', 'Úlcera péptica activa', '1 tableta cada 8 horas', FALSE, 'AINE'),
('Aspirina 100mg', 'PAIN-003', 'Antiagregante plaquetario', 1, 15.50, 9.80, 200, 50, 400, 'tableta', 'active', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', '2026-03-20', 'ASP2024003', FALSE, 'Ácido acetilsalicílico', '100mg', 'tablet', 'Bayer', 'Hemofilia, úlcera péptica', '1 tableta diaria', FALSE, 'Antiagregante'),

-- Antibióticos
('Amoxicilina 500mg', 'ANTB-001', 'Antibiótico betalactámico', 2, 25.00, 15.00, 60, 15, 120, 'cápsula', 'active', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', '2025-08-30', 'AMX2024001', TRUE, 'Amoxicilina', '500mg', 'capsule', 'GlaxoSmithKline', 'Alergia a penicilinas', '1 cápsula cada 8 horas por 7-10 días', FALSE, 'Antibiótico betalactámico'),
('Azitromicina 500mg', 'ANTB-002', 'Antibiótico macrólido', 2, 35.00, 22.00, 40, 10, 80, 'tableta', 'active', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', '2025-11-25', 'AZI2024002', TRUE, 'Azitromicina', '500mg', 'tablet', 'Pfizer', 'Hipersensibilidad a macrólidos', '1 tableta diaria por 3-5 días', FALSE, 'Antibiótico macrólido'),

-- Vitaminas y Suplementos
('Vitamina C 1000mg', 'VIT-001', 'Suplemento de ácido ascórbico', 4, 18.00, 11.00, 120, 25, 250, 'tableta', 'active', 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400', '2026-06-15', 'VTC2024001', FALSE, 'Ácido ascórbico', '1000mg', 'tablet', 'Nature Made', 'Ninguna conocida', '1 tableta diaria', FALSE, 'Vitamina hidrosoluble'),
('Complejo B', 'VIT-002', 'Multivitamínico del complejo B', 4, 22.50, 14.00, 90, 20, 180, 'cápsula', 'active', 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400', '2026-01-10', 'CPB2024002', FALSE, 'Complejo B', 'Múltiple', 'capsule', 'Centrum', 'Hipersensibilidad a componentes', '1 cápsula diaria con alimentos', FALSE, 'Complejo vitamínico'),

-- Cuidado Personal
('Alcohol en Gel 250ml', 'CP-001', 'Desinfectante para manos', 5, 8.00, 4.50, 300, 50, 500, 'frasco', 'active', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400', '2026-12-31', 'ALG2024001', FALSE, 'Alcohol etílico', '70%', 'other', 'Quimtia', 'Evitar contacto con ojos', 'Aplicar en manos secas', FALSE, 'Antiséptico'),
('Mascarillas Quirúrgicas x50', 'CP-002', 'Mascarillas desechables', 5, 45.00, 28.00, 80, 15, 150, 'caja', 'active', 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400', '2027-01-15', 'MSQ2024002', FALSE, 'Polipropileno', 'N/A', 'other', 'MedSupply', 'Uso único', 'Cubrir nariz y boca', FALSE, 'Equipo de protección'),

-- Primeros Auxilios
('Gasas Estériles 10x10cm x10', 'PA-001', 'Gasas para curaciones', 6, 12.00, 7.20, 200, 40, 400, 'paquete', 'active', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400', '2028-05-30', 'GAS2024001', FALSE, 'Algodón', 'N/A', 'other', 'Johnson & Johnson', 'Ninguna', 'Para curaciones externas', FALSE, 'Material de curación'),
('Suero Fisiológico 250ml', 'PA-002', 'Solución salina estéril', 6, 6.50, 3.80, 150, 30, 300, 'frasco', 'active', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400', '2025-09-20', 'SF2024002', FALSE, 'Cloruro de sodio', '0.9%', 'other', 'Baxter', 'Ninguna conocida', 'Para limpieza de heridas', FALSE, 'Solución fisiológica'),

-- Medicamentos Controlados
('Tramadol 50mg', 'CTRL-001', 'Analgésico opioide', 7, 45.00, 28.00, 30, 5, 50, 'tableta', 'active', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', '2025-07-10', 'TRA2024001', TRUE, 'Tramadol HCl', '50mg', 'tablet', 'Grünenthal', 'Depresión respiratoria severa', '1 tableta cada 6-8 horas según necesidad', TRUE, 'Analgésico opioide'),
('Lorazepam 1mg', 'CTRL-002', 'Ansiolítico benzodiacepina', 7, 38.00, 23.00, 20, 3, 40, 'tableta', 'active', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', '2025-04-18', 'LOR2024002', TRUE, 'Lorazepam', '1mg', 'tablet', 'Wyeth', 'Glaucoma de ángulo cerrado', '0.5-1mg 2-3 veces al día', TRUE, 'Benzodiacepina');

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
-- Insertar Ubicaciones (Coordenadas) - Nova Salud
-- ============================================
INSERT INTO locations (name, description, address, latitude, longitude, location_type, contact_name, contact_phone) VALUES
('Botica Nova Salud - Sede Principal', 'Farmacia principal con atención 24 horas', 'Av. Comercial 456, Lima Centro', -12.046374, -77.042793, 'store', 'Q.F. Ana María Rodríguez', '987111222'),
('Almacén Farmacéutico Central', 'Almacén principal de medicamentos', 'Jr. Farmacia 100, Lima', -12.046863, -77.030190, 'warehouse', 'Roberto Medicinas', '987222333'),
('Botica Nova Salud - Miraflores', 'Sucursal en Miraflores', 'Av. Larco 1234, Miraflores', -12.119280, -77.030644, 'store', 'Q.F. Patricia Salud', '987333444'),
('Botica Nova Salud - San Isidro', 'Sucursal en San Isidro', 'Av. Javier Prado 890, San Isidro', -12.055890, -77.118269, 'store', 'Q.F. Jorge Medicina', '987444555'),
('Proveedor Laboratorios Unidos', 'Distribuidor principal de medicamentos', 'Av. Industrial 2500, Los Olivos', -11.961851, -77.061924, 'supplier', 'Carlos Distribuidor', '987555666'),
('Centro de Distribución Farmacéutica', 'Centro de distribución regional', 'Av. República de Panamá 5000, Surco', -12.106050, -76.999031, 'warehouse', 'María Logística', '987666777');

-- ============================================
-- Insertar Proveedores Farmacéuticos
-- ============================================
INSERT INTO suppliers (name, contact_name, email, phone, address, city, tax_id, status) VALUES
('Laboratorios Bayer Perú SA', 'Dr. Ricardo Farmacia', 'ventas@bayer.com.pe', '987111000', 'Av. República de Panamá 5000', 'Lima', '20123456789', 'active'),
('Pfizer Perú SAC', 'Dra. Martha Medicamentos', 'contacto@pfizer.com.pe', '987222000', 'Av. El Derby 254, Surco', 'Lima', '20234567890', 'active'),
('Distribuidora Farmacéutica Nacional EIRL', 'Q.F. José Distribución', 'ventas@dfnacional.com', '987333000', 'Jr. Medicinas 500', 'La Victoria', '20345678901', 'active'),
('Droguería Especializada SAC', 'Q.F. Laura Drogas', 'info@drogueriaesp.com', '987444000', 'Av. Javier Prado 1500', 'San Isidro', '20456789012', 'active'),
('Laboratorios Naturales Unidos SA', 'Ing. Carlos Suplementos', 'contacto@naturalesunidos.com', '987555000', 'Av. Industrial 800', 'Lima', '20567890123', 'active');

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
-- Insertar Configuración del Sistema - Nova Salud
-- ============================================
INSERT INTO system_config (config_key, config_value, description) VALUES
('company_name', 'Botica Nova Salud', 'Nombre de la farmacia'),
('company_address', 'Av. Comercial 456, Lima - Perú', 'Dirección de la botica'),
('company_phone', '(01) 234-5678', 'Teléfono de contacto'),
('company_email', 'contacto@novasalud.com', 'Email de contacto'),
('tax_rate', '18', 'Tasa de impuesto IGV en porcentaje'),
('currency', 'PEN', 'Moneda del sistema (Soles Peruanos)'),
('low_stock_alert_enabled', 'true', 'Habilitar alertas de stock bajo'),
('expiration_alert_days', '30', 'Días antes del vencimiento para alertar'),
('controlled_substance_tracking', 'true', 'Habilitar seguimiento de sustancias controladas'),
('prescription_required_validation', 'true', 'Validar recetas médicas obligatorias'),
('email_notifications', 'true', 'Habilitar notificaciones por email'),
('default_language', 'es', 'Idioma por defecto del sistema'),
('pharmacy_license', 'DIGEMID-12345', 'Número de licencia farmacéutica'),
('pharmacist_name', 'Q.F. Ana María Rodríguez', 'Nombre del químico farmacéutico responsable'),
('business_hours', '08:00-22:00', 'Horario de atención'),
('emergency_contact', '987-654-321', 'Teléfono de emergencia');

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
