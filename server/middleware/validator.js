import { body, validationResult } from 'express-validator';

// Middleware para validar resultados
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next();
};

// Validaciones para productos
export const productValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('sku').trim().notEmpty().withMessage('El SKU es requerido'),
  body('price').isFloat({ min: 0 }).withMessage('El precio debe ser mayor a 0'),
  body('cost').isFloat({ min: 0 }).withMessage('El costo debe ser mayor a 0'),
  body('min_stock_level').optional().isInt({ min: 0 }).withMessage('El stock mínimo debe ser mayor o igual a 0'),
  body('max_stock_level').optional().isInt({ min: 1 }).withMessage('El stock máximo debe ser mayor a 0'),
  validate
];

// Validaciones para clientes
export const customerValidation = [
  body('first_name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('last_name').trim().notEmpty().withMessage('El apellido es requerido'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('document_number').optional().trim().notEmpty().withMessage('El número de documento es requerido'),
  validate
];

// Validaciones para ventas
export const saleValidation = [
  body('items').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
  body('items.*.product_id').isInt().withMessage('ID de producto inválido'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('La cantidad debe ser mayor a 0'),
  body('items.*.unit_price').isFloat({ min: 0 }).withMessage('El precio unitario debe ser mayor a 0'),
  body('payment_method').optional().isIn(['cash', 'card', 'transfer', 'credit']).withMessage('Método de pago inválido'),
  validate
];

// Validaciones para ubicaciones
export const locationValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitud inválida'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitud inválida'),
  body('location_type').optional().isIn(['warehouse', 'store', 'customer', 'supplier', 'other']).withMessage('Tipo de ubicación inválido'),
  validate
];

// Validaciones para alertas
export const alertValidation = [
  body('product_id').isInt().withMessage('ID de producto inválido'),
  body('alert_type').isIn(['low_stock', 'out_of_stock', 'overstock']).withMessage('Tipo de alerta inválido'),
  body('message').trim().notEmpty().withMessage('El mensaje es requerido'),
  validate
];
