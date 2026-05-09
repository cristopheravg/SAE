// routes/maestro.js
const express = require('express');
const router = express.Router();
const { verifyToken, isMaestroOrAdmin } = require('../middleware/auth');
const { getConnection } = require('../config/db');

// Obtener grupos del maestro
router.get('/grupos', verifyToken, isMaestroOrAdmin, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const grupos = await conn.query(`
      SELECT DISTINCT g.id, g.nombre, g.grado, g.seccion, g.turno
      FROM grupos g
      INNER JOIN asignaciones a ON g.id = a.grupo_id
      WHERE a.maestro_id = ?
      ORDER BY g.grado, g.nombre
    `, [req.user.id]);

    res.json(grupos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Obtener materias del maestro
/*router.get('/materias', verifyToken, isMaestroOrAdmin, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const materias = await conn.query(`
      SELECT DISTINCT m.id, m.nombre, m.codigo
      FROM materias m
      INNER JOIN asignaciones a ON m.id = a.materia_id
      WHERE a.maestro_id = ?
      ORDER BY m.nombre
    `, [req.user.id]);

    res.json(materias);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});*/

// Obtener materias del maestro (MODIFICADO)
router.get('/materias', verifyToken, isMaestroOrAdmin, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const materias = await conn.query(`
      SELECT DISTINCT m.id, m.nombre, m.codigo, m.grado
      FROM materias m
      INNER JOIN asignaciones a ON m.id = a.materia_id
      WHERE a.maestro_id = ?
      ORDER BY m.nombre
    `, [req.user.id]);

    res.json(materias);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});


// Obtener horarios del maestro
router.get('/horarios', verifyToken, isMaestroOrAdmin, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const horarios = await conn.query(`
      SELECT 
        a.id,
        g.nombre as grupo,
        g.grado,
        m.nombre as materia,
        a.horario_inicio,
        a.horario_fin,
        a.dia_semana
      FROM asignaciones a
      INNER JOIN grupos g ON a.grupo_id = g.id
      INNER JOIN materias m ON a.materia_id = m.id
      WHERE a.maestro_id = ?
      ORDER BY FIELD(a.dia_semana, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'), a.horario_inicio
    `, [req.user.id]);

    res.json(horarios);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});


// Obtener alumnos y calificaciones por materia y período
router.get('/materia/:materiaId/calificaciones', verifyToken, isMaestroOrAdmin, async (req, res) => {
  const { materiaId } = req.params;
  const { periodo } = req.query;
  
  let conn;
  
  try {
    conn = await getConnection();
    
    // 1. Verificar que el maestro tiene acceso a esta materia
    const asignacion = await conn.query(
      `SELECT a.id, a.grupo_id, m.grado 
       FROM asignaciones a
       INNER JOIN materias m ON a.materia_id = m.id
       WHERE a.materia_id = ? AND a.maestro_id = ?`,
      [materiaId, req.user.id]
    );
    
    if (!asignacion.length) {
      return res.status(403).json({ error: 'No tienes acceso a esta materia' });
    }
    
    const grupoId = asignacion[0].grupo_id;
    const grado = asignacion[0].grado;
    
    // 2. Obtener alumnos del grupo con sus calificaciones
    const alumnos = await conn.query(
      `SELECT 
        al.id as alumno_id,
        al.nombre,
        al.apellido_paterno,
        al.apellido_materno,
        al.matricula,
        al.grado,
        c.calificacion,
        c.id as calificacion_id
      FROM alumnos al
      INNER JOIN inscripciones i ON al.id = i.alumno_id
      LEFT JOIN calificaciones c ON al.id = c.alumno_id 
        AND c.materia_id = ? 
        AND c.grupo_id = ? 
        AND c.periodo = ?
      WHERE i.grupo_id = ? AND al.estado = 'activo'
      ORDER BY al.apellido_paterno, al.nombre`,
      [materiaId, grupoId, periodo, grupoId]
    );
    
    // Formatear la respuesta
    const resultado = alumnos.map(alumno => ({
      alumno_id: alumno.alumno_id,
      nombre: alumno.nombre,
      apellido_paterno: alumno.apellido_paterno,
      apellido_materno: alumno.apellido_materno,
      matricula: alumno.matricula,
      grado: alumno.grado,
      calificacion: alumno.calificacion ? parseFloat(alumno.calificacion) : null,
      calificacion_id: alumno.calificacion_id,
      guardando: false
    }));
    
    res.json(resultado);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});



// Obtener lista de alumnos por materia [relacionado grado]
router.get('/materia/:materiaId/alumnos', verifyToken, isMaestroOrAdmin, async (req, res) => {

  const { materiaId } = req.params;

  let conn;

  try {
    conn = await getConnection();

    // 1. obtener grado de la materia
    const materia = await conn.query(
      'SELECT grado FROM materias WHERE id = ?',
      [materiaId]
    );

    if (!materia.length) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }

    const grado = materia[0].grado;

    // 2. obtener alumnos por grado
    const alumnos = await conn.query(
      `SELECT id, nombre, apellido_paterno, apellido_materno, matricula, grado
       FROM alumnos
       WHERE grado = ? AND estado = 'activo'
       ORDER BY apellido_paterno, nombre`,
      [grado]
    );

    res.json({
      grado,
      alumnos
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en servidor' });
  } finally {
    if (conn) conn.release();
  }
});



// Obtener alumnos de un grupo para calificar
router.get('/grupo/:grupoId/alumnos', verifyToken, isMaestroOrAdmin, async (req, res) => {
  const { grupoId } = req.params;
  let conn;
  try {
    conn = await getConnection();
    const alumnos = await conn.query(`
      SELECT DISTINCT
        al.id,
        al.nombre,
        al.apellido_paterno,
        al.apellido_materno,
        al.matricula,
        al.grado
      FROM alumnos al
      INNER JOIN inscripciones i ON al.id = i.alumno_id
      WHERE i.grupo_id = ? AND al.estado = 'activo'
      ORDER BY al.apellido_paterno, al.nombre
    `, [grupoId]);

    res.json(alumnos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Obtener calificaciones de un grupo por materia y período
router.get('/calificaciones/:grupoId/:materiaId/:periodo', verifyToken, isMaestroOrAdmin, async (req, res) => {
  const { grupoId, materiaId, periodo } = req.params;
  let conn;
  try {
    conn = await getConnection();
    const calificaciones = await conn.query(`
      SELECT 
        c.id,
        c.alumno_id,
        al.nombre,
        al.apellido_paterno,
        al.matricula,
        c.calificacion,
        c.observaciones
      FROM alumnos al
      LEFT JOIN calificaciones c ON al.id = c.alumno_id 
        AND c.materia_id = ? 
        AND c.grupo_id = ? 
        AND c.periodo = ?
      INNER JOIN inscripciones i ON al.id = i.alumno_id AND i.grupo_id = ?
      WHERE al.estado = 'activo'
      ORDER BY al.apellido_paterno, al.nombre
    `, [materiaId, grupoId, periodo, grupoId]);

    res.json(calificaciones);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Agregar o actualizar calificación
// Agregar o actualizar calificación (MODIFICADO - grupo_id opcional)
router.post('/calificaciones', verifyToken, isMaestroOrAdmin, async (req, res) => {
  const { alumno_id, materia_id, periodo, calificacion, observaciones } = req.body;
  
  // grupo_id ya no es obligatorio
  if (!alumno_id || !materia_id || !periodo || calificacion === undefined) {
    return res.status(400).json({ error: 'Campos requeridos faltantes' });
  }

  if (calificacion < 0 || calificacion > 10) {
    return res.status(400).json({ error: 'La calificación debe estar entre 0 y 10' });
  }

  let conn;
  try {
    conn = await getConnection();
    
    // Obtener grupo_id de la asignación del maestro
    const asignacion = await conn.query(
      'SELECT grupo_id FROM asignaciones WHERE materia_id = ? AND maestro_id = ?',
      [materia_id, req.user.id]
    );
    
    const grupo_id = asignacion.length > 0 ? asignacion[0].grupo_id : null;

    // Verificar si ya existe
    const existe = await conn.query(
      'SELECT id FROM calificaciones WHERE alumno_id = ? AND materia_id = ? AND periodo = ?',
      [alumno_id, materia_id, periodo]
    );

    if (existe.length > 0) {
      // Actualizar
      await conn.query(
        'UPDATE calificaciones SET calificacion = ?, observaciones = ? WHERE id = ?',
        [calificacion, observaciones || null, existe[0].id]
      );
    } else {
      // Insertar
      await conn.query(
        'INSERT INTO calificaciones (alumno_id, materia_id, grupo_id, maestro_id, periodo, calificacion, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [alumno_id, materia_id, grupo_id, req.user.id, periodo, calificacion, observaciones || null]
      );
    }

    res.json({ success: true, message: 'Calificación guardada correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});


// Obtener alumnos por grado con sus calificaciones
router.get('/grado/:grado/alumnos-calificaciones', verifyToken, isMaestroOrAdmin, async (req, res) => {
  const { grado } = req.params;
  const { materiaId, periodo } = req.query;
  
  let conn;
  
  try {
    conn = await getConnection();
    
    const alumnos = await conn.query(
      `SELECT 
        al.id as alumno_id,
        al.nombre,
        al.apellido_paterno,
        al.apellido_materno,
        al.matricula,
        al.grado,
        c.calificacion,
        c.id as calificacion_id
      FROM alumnos al
      LEFT JOIN calificaciones c ON al.id = c.alumno_id 
        AND c.materia_id = ? 
        AND c.periodo = ?
      WHERE al.grado = ? AND al.estado = 'activo'
      ORDER BY al.apellido_paterno, al.nombre`,
      [materiaId, periodo, grado]
    );
    
    const resultado = alumnos.map(alumno => ({
      alumno_id: alumno.alumno_id,
      nombre: alumno.nombre,
      apellido_paterno: alumno.apellido_paterno,
      apellido_materno: alumno.apellido_materno,
      matricula: alumno.matricula,
      grado: alumno.grado,
      calificacion: alumno.calificacion ? parseFloat(alumno.calificacion) : null,
      calificacion_id: alumno.calificacion_id,
      guardando: false
    }));
    
    res.json(resultado);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});


module.exports = router;
