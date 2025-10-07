import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';

// Importar configuración de base de datos
import { testConnection } from './config/database.js';

// Importar rutas
import productRoutes from './routes/productRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import locationRoutes from './routes/locationRoutes.js';

// Importar middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Importar Socket.io handlers
import { setupSocketHandlers } from './socket/socketHandler.js';

// Importar query para dashboard
import { query } from './config/database.js';

// Cargar variables de entorno
dotenv.config();

// Configuración
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Crear aplicación Express
const app = express();
const httpServer = createServer(app);

// Configurar Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
  }
});

// Configurar Socket.io handlers
setupSocketHandlers(io);

// Middleware para hacer io accesible en las rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middlewares globales
app.use(helmet()); // Seguridad
app.use(compression()); // Compresión de respuestas
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 API de Sistema de Gestión de Inventario',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      sales: '/api/sales',
      customers: '/api/customers',
      alerts: '/api/alerts',
      locations: '/api/locations',
      dashboard: '/api/dashboard'
    }
  });
});

// Ruta de health check
app.get('/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    success: true,
    status: 'online',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Ruta de dashboard
app.get('/api/dashboard', async (req, res) => {
  try {
    // Obtener estadísticas generales
    const [stats] = await query('CALL sp_dashboard_stats()');
    
    // Obtener alertas activas
    const activeAlerts = await query(`
      SELECT COUNT(*) as count FROM stock_alerts WHERE is_resolved = FALSE
    `);
    
    // Obtener ventas de hoy
    const todaySales = await query(`
      SELECT 
        COUNT(*) as count,
        COALESCE(SUM(final_amount), 0) as total
      FROM sales 
      WHERE DATE(sale_date) = CURDATE()
      AND payment_status = 'completed'
    `);
    
    // Obtener ventas de los últimos 7 días
    const weekSales = await query(`
      SELECT 
        DATE(sale_date) as date,
        COUNT(*) as sales_count,
        SUM(final_amount) as total_amount
      FROM sales
      WHERE sale_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      AND payment_status = 'completed'
      GROUP BY DATE(sale_date)
      ORDER BY date DESC
    `);
    
    // Productos más vendidos
    const [topProducts] = await query('CALL sp_top_selling_products(?)', [5]);
    
    res.json({
      success: true,
      data: {
        stats: stats[0],
        activeAlerts: activeAlerts[0].count,
        todaySales: todaySales[0],
        weekSales,
        topProducts
      }
    });
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos del dashboard',
      error: error.message
    });
  }
});

// Rutas de la API
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/locations', locationRoutes);

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      console.log('⚠️  Por favor verifica tu configuración en el archivo .env');
      process.exit(1);
    }
    
    // Iniciar servidor HTTP
    httpServer.listen(PORT, () => {
      console.log('\n╔═══════════════════════════════════════════════════════════╗');
      console.log('║                                                           ║');
      console.log('║   🚀 SERVIDOR INICIADO CORRECTAMENTE                     ║');
      console.log('║                                                           ║');
      console.log('╠═══════════════════════════════════════════════════════════╣');
      console.log(`║   📡 API REST:        http://localhost:${PORT}              ║`);
      console.log(`║   🔌 Socket.io:       ws://localhost:${PORT}               ║`);
      console.log(`║   🌍 Entorno:         ${process.env.NODE_ENV || 'development'}                    ║`);
      console.log(`║   🗄️  Base de Datos:  MySQL (${process.env.DB_NAME})       ║`);
      console.log('║                                                           ║');
      console.log('╠═══════════════════════════════════════════════════════════╣');
      console.log('║   📌 ENDPOINTS DISPONIBLES:                               ║');
      console.log('║      - GET  /api/products                                 ║');
      console.log('║      - GET  /api/sales                                    ║');
      console.log('║      - GET  /api/customers                                ║');
      console.log('║      - GET  /api/alerts                                   ║');
      console.log('║      - GET  /api/locations                                ║');
      console.log('║      - GET  /api/dashboard                                ║');
      console.log('║                                                           ║');
      console.log('╚═══════════════════════════════════════════════════════════╝\n');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err);
  httpServer.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido. Cerrando servidor...');
  httpServer.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

// Iniciar el servidor
startServer();

export default app;
