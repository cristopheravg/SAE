// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./config/db.js');

// Importar rutas
const authRoutes = require('./routes/auth');
const maestroRoutes = require('./routes/maestro');
const alumnoRoutes = require('./routes/alumno');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/maestro', maestroRoutes);
app.use('/api/alumno', alumnoRoutes);
app.use('/api/admin', adminRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'Sistema en línea' });
});

// Iniciar servidor
const startServer = async () => {
  const dbConnected = await testConnection();
  
  if (dbConnected) {
    app.listen(PORT, () => {
      console.log(`✓ Servidor corriendo en puerto ${PORT}`);
    });
  } else {
    console.error('✗ No se pudo iniciar el servidor - error de conexión a BD');
    process.exit(1);
  }
};

startServer();
