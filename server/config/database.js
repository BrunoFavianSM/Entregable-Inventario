import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la conexión a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_inventario',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Convertir pool a promesas
const promisePool = pool.promise();

// Función para probar la conexión
export const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Conexión exitosa a MySQL');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error.message);
    return false;
  }
};

// Función para ejecutar queries
export const query = async (sql, params) => {
  try {
    const [results] = await promisePool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error ejecutando query:', error);
    throw error;
  }
};

// Función para ejecutar procedimientos almacenados
export const callProcedure = async (procedureName, params = []) => {
  try {
    const placeholders = params.map(() => '?').join(',');
    const sql = `CALL ${procedureName}(${placeholders})`;
    const [results] = await promisePool.execute(sql, params);
    return results[0]; // Los procedimientos retornan un array, tomamos el primer resultado
  } catch (error) {
    console.error(`Error llamando procedimiento ${procedureName}:`, error);
    throw error;
  }
};

export default promisePool;
