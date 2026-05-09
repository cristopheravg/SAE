// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getConnection } = require('../config/db');

// LOGIN ALUMNO
router.post('/alumno/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  let conn;
  try {
    conn = await getConnection();
    const alumno = await conn.query(
      'SELECT id, nombre, apellido_paterno, email, password, matricula, grado FROM alumnos WHERE email = ? AND estado = "activo"',
      [email]
    );

    if (alumno.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = alumno[0];
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: 'alumno',
        matricula: user.matricula
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nombre: `${user.nombre} ${user.apellido_paterno}`,
        email: user.email,
        rol: 'alumno',
        matricula: user.matricula,
        grado: user.grado
      }
    });
  } catch (error) {
    console.error('Error en login alumno:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// LOGIN MAESTRO / ADMIN
router.post('/maestro/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  let conn;
  try {
    conn = await getConnection();
    const usuario = await conn.query(
      'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ? AND estado = "activo"',
      [email]
    );

    if (usuario.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = usuario[0];
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('Error en login maestro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
