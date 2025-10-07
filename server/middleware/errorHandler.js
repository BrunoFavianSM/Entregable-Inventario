// Middleware para manejo de errores
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.errors
    });
  }

  // Error de MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'El registro ya existe',
      error: err.message
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Referencia inválida',
      error: err.message
    });
  }

  // Error general del servidor
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

// Middleware para rutas no encontradas
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`
  });
};
