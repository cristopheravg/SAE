// routes/alumno.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getConnection } = require('../config/db');

// Obtener calificaciones del alumno por período
router.get('/calificaciones/:periodo', verifyToken, async (req, res) => {
  const { periodo } = req.params;
  let conn;
  try {
    conn = await getConnection();
    
    // Obtener grado del alumno
    const alumno = await conn.query(
      'SELECT grado FROM alumnos WHERE id = ?',
      [req.user.id]
    );
    
    const grado = alumno[0].grado;
    
    // Obtener TODAS las materias del grado
    const materiasGrado = await conn.query(`
      SELECT id, nombre, codigo
      FROM materias
      WHERE grado = ?
      ORDER BY nombre
    `, [grado]);
    
    // Obtener calificaciones existentes
    const calificacionesExistentes = await conn.query(`
      SELECT 
        c.id,
        c.materia_id,
        c.calificacion,
        c.observaciones,
        c.periodo,
        u.nombre as maestro
      FROM calificaciones c
      INNER JOIN usuarios u ON c.maestro_id = u.id
      WHERE c.alumno_id = ? AND c.periodo = ?
    `, [req.user.id, periodo]);
    
    // Crear mapa de calificaciones
    const califMap = new Map();
    calificacionesExistentes.forEach(cal => {
      califMap.set(Number(cal.materia_id), {
        id: Number(cal.id),
        calificacion: parseFloat(cal.calificacion),
        observaciones: cal.observaciones,
        periodo: Number(cal.periodo),
        maestro: cal.maestro
      });
    });
    
    // Combinar materias con calificaciones
    const resultado = materiasGrado.map(materia => {
      const cal = califMap.get(Number(materia.id));
      return {
        id: cal?.id || null,
        materia: materia.nombre,
        codigo: materia.codigo,
        calificacion: cal?.calificacion !== undefined ? cal.calificacion : null,
        observaciones: cal?.observaciones || null,
        periodo: Number(periodo),
        maestro: cal?.maestro || 'Sin asignar',
        tiene_calificacion: !!cal
      };
    });
    
    res.json(resultado);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Obtener resumen de calificaciones del alumno
router.get('/resumen', verifyToken, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    
    // Obtener información del alumno
    const alumno = await conn.query(
      'SELECT id, nombre, apellido_paterno, apellido_materno, matricula, grado FROM alumnos WHERE id = ?',
      [req.user.id]
    );
    
    const grado = Number(alumno[0].grado);
    
    // Obtener total de materias del grado
    const totalMaterias = await conn.query(
      'SELECT COUNT(*) as total FROM materias WHERE grado = ?',
      [grado]
    );
    const totalMateriasCount = Number(totalMaterias[0].total);
    
    // Obtener resumen por período
    const calificaciones = await conn.query(`
      SELECT 
        periodo,
        COUNT(*) as materias_calificadas,
        AVG(calificacion) as promedio,
        MIN(calificacion) as calificacion_minima,
        MAX(calificacion) as calificacion_maxima
      FROM calificaciones
      WHERE alumno_id = ?
      GROUP BY periodo
      ORDER BY periodo
    `, [req.user.id]);
    
    // Crear array con los 3 períodos
    const periodosCompletos = [1, 2, 3].map(periodoNum => {
      const data = calificaciones.find(c => Number(c.periodo) === periodoNum);
      if (data) {
        return {
          periodo: periodoNum,
          total_materias: totalMateriasCount,
          materias_calificadas: Number(data.materias_calificadas),
          promedio: parseFloat(data.promedio) || 0,
          calificacion_minima: parseFloat(data.calificacion_minima) || 0,
          calificacion_maxima: parseFloat(data.calificacion_maxima) || 0
        };
      }
      return {
        periodo: periodoNum,
        total_materias: totalMateriasCount,
        materias_calificadas: 0,
        promedio: 0,
        calificacion_minima: 0,
        calificacion_maxima: 0
      };
    });
    
    res.json({
      alumno: {
        id: Number(alumno[0].id),
        nombre: alumno[0].nombre,
        apellido_paterno: alumno[0].apellido_paterno,
        apellido_materno: alumno[0].apellido_materno,
        matricula: alumno[0].matricula,
        grado: grado
      },
      calificaciones: periodosCompletos
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;