// middleware/auth.js
const jwt = require('jsonwebtoken');

// Verificar token JWT
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}



// Verificar que el usuario es administrador
function isAdmin(req, res, next) {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
  }
  next();
}

// Verificar que el usuario es maestro o admin
function isMaestroOrAdmin(req, res, next) {
  if (req.user.rol !== 'maestro' && req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
}

// Verificar que el usuario es alumno
function isAlumno(req, res, next) {
  if (req.user.rol !== 'alumno') {
    return res.status(403).json({ error: 'Acceso denegado: se requiere rol de alumno' });
  }
  next();
}

module.exports = {
  verifyToken,
  isAdmin,
  isMaestroOrAdmin,
  isAlumno
};
