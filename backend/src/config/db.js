// db.js - Configuración de MariaDB
const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

// Función para obtener conexión
async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Error al conectar a la BD:', error);
    throw error;
  }
}

// Función de prueba de conexión
async function testConnection() {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.query("SELECT 1");
    console.log('✓ Conexión a MariaDB exitosa');
    return true;
  } catch (error) {
    console.error('✗ Error de conexión a MariaDB:', error.message);
    return false;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = {
  pool,
  getConnection,
  testConnection
};
