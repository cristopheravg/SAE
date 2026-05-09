// routes/admin.js
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const { getConnection } = require('../config/db');
const bcrypt = require('bcryptjs');




// ===================== MAESTROS =====================

// Obtener todos los maestros
router.get('/maestros', verifyToken, isAdmin, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const maestros = await conn.query(
      'SELECT id, nombre, email, estado, created_at FROM usuarios WHERE rol = "maestro" ORDER BY nombre'
    );
    res.json(maestros);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Crear maestro
router.post('/maestros', verifyToken, isAdmin, async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Campos requeridos: nombre, email, password' });
  }

  let conn;
  try {
    conn = await getConnection();
    const hashedPassword = await bcrypt.hash(password, 10);

    await conn.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, 'maestro']
    );

    res.status(201).json({ success: true, message: 'Maestro creado correctamente' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El email ya existe' });
    }
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Actualizar maestro
router.put('/maestros/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { nombre, email, estado } = req.body;

  let conn;
  try {
    conn = await getConnection();
    await conn.query(
      'UPDATE usuarios SET nombre = ?, email = ?, estado = ? WHERE id = ? AND rol = "maestro"',
      [nombre, email, estado, id]
    );
    res.json({ success: true, message: 'Maestro actualizado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Eliminar maestro
router.delete('/maestros/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  let conn;
  try {
    conn = await getConnection();
    await conn.query('DELETE FROM usuarios WHERE id = ? AND rol = "maestro"', [id]);
    res.json({ success: true, message: 'Maestro eliminado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});







// ===================== ALUMNOS =====================

// Obtener todos los alumnos
router.get('/alumnos', verifyToken, isAdmin, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const alumnos = await conn.query(
      'SELECT id, nombre, apellido_paterno, apellido_materno, email, matricula, grado, estado, created_at FROM alumnos ORDER BY apellido_paterno, nombre'
    );
    res.json(alumnos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Crear alumno
router.post('/alumnos', verifyToken, isAdmin, async (req, res) => {
  const { nombre, apellido_paterno, apellido_materno, email, password, matricula, grado } = req.body;

  if (!nombre || !apellido_paterno || !email || !password || !matricula || !grado) {
    return res.status(400).json({ error: 'Campos requeridos faltantes' });
  }

  let conn;
  try {
    conn = await getConnection();
    const hashedPassword = await bcrypt.hash(password, 10);

    await conn.query(
      'INSERT INTO alumnos (nombre, apellido_paterno, apellido_materno, email, password, matricula, grado) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellido_paterno, apellido_materno, email, hashedPassword, matricula, grado]
    );

    res.status(201).json({ success: true, message: 'Alumno creado correctamente' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El email o matrícula ya existen' });
    }
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Actualizar alumno
router.put('/alumnos/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido_paterno, apellido_materno, email, matricula, grado, estado } = req.body;

  let conn;
  try {
    conn = await getConnection();
    await conn.query(
      'UPDATE alumnos SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, email = ?, matricula = ?, grado = ?, estado = ? WHERE id = ?',
      [nombre, apellido_paterno, apellido_materno, email, matricula, grado, estado, id]
    );
    res.json({ success: true, message: 'Alumno actualizado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Eliminar alumno
router.delete('/alumnos/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  let conn;
  try {
    conn = await getConnection();
    await conn.query('DELETE FROM alumnos WHERE id = ?', [id]);
    res.json({ success: true, message: 'Alumno eliminado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});


// Obtener alumnos por grado
router.get('/alumnos/grado/:grado', verifyToken, async (req, res) => {

  const { grado } = req.params
  let conn

  try {
    conn = await getConnection()

    const alumnos = await conn.query(`
      SELECT 
        id,
        nombre,
        apellido_paterno,
        apellido_materno,
        matricula,
        email,
        grado
      FROM alumnos
      WHERE grado = ?
      AND estado = 'activo'
      ORDER BY apellido_paterno, nombre
    `, [grado])

    res.json(alumnos)

  } catch (error) {

    console.error('Error:', error)

    res.status(500).json({
      error: 'Error en el servidor'
    })

  } finally {

    if (conn) conn.release()
  }
})




// ===================== GRUPOS =====================

// Obtener todos los grupos
router.get('/grupos', verifyToken, isAdmin, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const grupos = await conn.query(
      'SELECT id, nombre, grado, seccion, turno FROM grupos ORDER BY grado, nombre'
    );
    res.json(grupos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Crear grupo
router.post('/grupos', verifyToken, isAdmin, async (req, res) => {
  const { nombre, grado, seccion, turno } = req.body;

  if (!nombre || !grado || !turno) {
    return res.status(400).json({ error: 'Campos requeridos: nombre, grado, turno' });
  }

  let conn;
  try {
    conn = await getConnection();
    await conn.query(
      'INSERT INTO grupos (nombre, grado, seccion, turno) VALUES (?, ?, ?, ?)',
      [nombre, grado, seccion, turno]
    );
    res.status(201).json({ success: true, message: 'Grupo creado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Actualizar grupo
router.put('/grupos/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { nombre, grado, seccion, turno } = req.body;

  let conn;
  try {
    conn = await getConnection();
    await conn.query(
      'UPDATE grupos SET nombre = ?, grado = ?, seccion = ?, turno = ? WHERE id = ?',
      [nombre, grado, seccion, turno, id]
    );
    res.json({ success: true, message: 'Grupo actualizado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Eliminar grupo
router.delete('/grupos/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  let conn;
  try {
    conn = await getConnection();
    await conn.query('DELETE FROM grupos WHERE id = ?', [id]);
    res.json({ success: true, message: 'Grupo eliminado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});






// ===================== MATERIAS =====================

// Obtener todas las materias
router.get('/materias', verifyToken, isAdmin, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const materias = await conn.query(
      'SELECT id, nombre, codigo, descripcion,grado FROM materias ORDER BY nombre'
    );
    res.json(materias);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Crear materia
router.post('/materias', verifyToken, isAdmin, async (req, res) => {

  const { nombre, codigo, descripcion, grado } = req.body;

  if (!nombre || !codigo || !grado) {
    return res.status(400).json({
      error: 'Campos requeridos: nombre, codigo, grado'
    });
  }

  let conn;

  try {
    conn = await getConnection();

    await conn.query(
      `INSERT INTO materias (nombre, codigo, descripcion, grado)
       VALUES (?, ?, ?, ?)`,
      [nombre, codigo, descripcion, grado]
    );

    res.status(201).json({
      success: true,
      message: 'Materia creada correctamente'
    });

  } catch (error) {

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        error: 'El código de materia ya existe'
      });
    }

    console.error('Error:', error);

    res.status(500).json({ error: 'Error en el servidor' });

  } finally {
    if (conn) conn.release();
  }
});
// Actualizar materia
router.put('/materias/:id', verifyToken, isAdmin, async (req, res) => {

  const { id } = req.params;
  const { nombre, codigo, descripcion, grado } = req.body;

  let conn;

  try {
    conn = await getConnection();

    await conn.query(
      `UPDATE materias 
       SET nombre = ?, codigo = ?, descripcion = ?, grado = ?
       WHERE id = ?`,
      [nombre, codigo, descripcion, grado, id]
    );

    res.json({
      success: true,
      message: 'Materia actualizada correctamente'
    });

  } catch (error) {

    console.error('Error:', error);

    res.status(500).json({ error: 'Error en el servidor' });

  } finally {
    if (conn) conn.release();
  }
});

// Eliminar materia
router.delete('/materias/:id', verifyToken, isAdmin, async (req, res) => {

  const { id } = req.params;

  let conn;

  try {
    conn = await getConnection();

    await conn.query(
      'DELETE FROM materias WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Materia eliminada correctamente'
    });

  } catch (error) {

    console.error('Error:', error);

    res.status(500).json({ error: 'Error en el servidor' });

  } finally {
    if (conn) conn.release();
  }
});






// ===================== ASIGNACIONES (Maestro-Grupo-Materia) =====================

// Obtener todas las asignaciones
router.get('/asignaciones', verifyToken, isAdmin, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const asignaciones = await conn.query(`
      SELECT 
        a.id,
        u.nombre as maestro,
        g.nombre as grupo,
        m.nombre as materia,
        a.horario_inicio,
        a.horario_fin,
        a.dia_semana
      FROM asignaciones a
      INNER JOIN usuarios u ON a.maestro_id = u.id
      INNER JOIN grupos g ON a.grupo_id = g.id
      INNER JOIN materias m ON a.materia_id = m.id
      ORDER BY u.nombre, g.nombre
    `);
    res.json(asignaciones);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Crear asignación
router.post('/asignaciones', verifyToken, isAdmin, async (req, res) => {
  const { maestro_id, grupo_id, materia_id, horario_inicio, horario_fin, dia_semana } = req.body;

  if (!maestro_id || !grupo_id || !materia_id) {
    return res.status(400).json({ error: 'Campos requeridos: maestro_id, grupo_id, materia_id' });
  }

  let conn;
  try {
    conn = await getConnection();
    await conn.query(
      'INSERT INTO asignaciones (maestro_id, grupo_id, materia_id, horario_inicio, horario_fin, dia_semana) VALUES (?, ?, ?, ?, ?, ?)',
      [maestro_id, grupo_id, materia_id, horario_inicio, horario_fin, dia_semana]
    );
    res.status(201).json({ success: true, message: 'Asignación creada correctamente' });
  } catch (error) {
//    console.error('Error:', error);
//    res.status(500).json({ error: 'Error en el servidor' });


    console.error('Error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        error: 'Ya existe una asignación con ese maestro, grupo, materia, día y horario'
      });
    }


  } finally {
      if (conn) conn.release();
    }
  });

// Eliminar asignación
router.delete('/asignaciones/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  let conn;
  try {
    conn = await getConnection();
    await conn.query('DELETE FROM asignaciones WHERE id = ?', [id]);
    res.json({ success: true, message: 'Asignación eliminada correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});






// ===================== INSCRIPCIONES (Alumno-Grupo) =====================

// Obtener inscripciones
router.get('/inscripciones', verifyToken, isAdmin, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const inscripciones = await conn.query(`
      SELECT 
        i.id,
        i.grupo_id,
        i.created_at,
        al.nombre,
        al.apellido_paterno,
        al.apellido_materno,
        al.matricula,
        g.nombre as grupo,
        g.grado
      FROM inscripciones i
      INNER JOIN alumnos al ON i.alumno_id = al.id
      INNER JOIN grupos g ON i.grupo_id = g.id
      ORDER BY g.grado, g.nombre, al.apellido_paterno
    `);
    res.json(inscripciones);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});



// ===================== INSCRIPCIONES =====================

// Crear inscripción (CORREGIDO)
router.post('/inscripciones', verifyToken, isAdmin, async (req, res) => {
  const { alumno_id, grupo_id } = req.body;

  if (!alumno_id || !grupo_id) {
    return res.status(400).json({ error: 'Campos requeridos: alumno_id, grupo_id' });
  }

  let conn;
  try {
    conn = await getConnection();

    // Obtener grado del grupo
    const [grupoInfo] = await conn.query(
      'SELECT grado FROM grupos WHERE id = ?',
      [grupo_id]
    );

    if (!grupoInfo) {
      return res.status(404).json({ error: 'El grupo no existe' });
    }

    // 🔥 INSERT o UPDATE automático
    await conn.query(`
      INSERT INTO inscripciones (alumno_id, grupo_id, grado)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE grupo_id = VALUES(grupo_id)
    `, [alumno_id, grupo_id, grupoInfo.grado]);

    res.json({ 
      success: true, 
      message: 'Alumno asignado correctamente (insertado o actualizado)' 
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Obtener alumnos disponibles para un grupo (excluyendo los que ya están inscritos en grupos del mismo grado)
router.get('/grupos/:id/alumnos-disponibles', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await getConnection();

    const [grupoInfo] = await conn.query(
      'SELECT grado FROM grupos WHERE id = ?',
      [id]
    );

    if (!grupoInfo) {
      return res.status(404).json({ error: 'El grupo no existe' });
    }

    const alumnos = await conn.query(`
      SELECT 
        al.id,
        al.nombre,
        al.apellido_paterno,
        al.apellido_materno,
        al.matricula,
        al.grado
      FROM alumnos al
      WHERE al.estado = 'activo'
      AND al.grado = ?
      AND al.id NOT IN (
        SELECT alumno_id FROM inscripciones WHERE grado = ?
      )
      ORDER BY al.apellido_paterno, al.nombre
    `, [grupoInfo.grado, grupoInfo.grado]);

    res.json(alumnos);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});


// Eliminar inscripción
router.get('/grupos/:id/alumnos-disponibles', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await getConnection();

    const [grupoInfo] = await conn.query(
      'SELECT grado FROM grupos WHERE id = ?',
      [id]
    );

    if (!grupoInfo) {
      return res.status(404).json({ error: 'El grupo no existe' });
    }

    const alumnos = await conn.query(`
      SELECT 
        al.id,
        al.nombre,
        al.apellido_paterno,
        al.apellido_materno,
        al.matricula,
        al.grado
      FROM alumnos al
      WHERE al.estado = 'activo'
      AND al.grado = ?
      AND al.id NOT IN (
        SELECT alumno_id FROM inscripciones WHERE grado = ?
      )
      ORDER BY al.apellido_paterno, al.nombre
    `, [grupoInfo.grado, grupoInfo.grado]);

    res.json(alumnos);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});




// Agregar este endpoint después de tus endpoints existentes

// ===================== ASIGNACIONES POR MAESTRO =====================

// Obtener asignaciones de un maestro específico [DASHBOARD ADMIN :Muestra las materias en el horario]
router.get('/maestros/:id/asignaciones', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await getConnection();
    
    console.log('Obteniendo asignaciones para maestro:', id); // Debug
    
    const asignaciones = await conn.query(`
      SELECT 
        a.id,
        a.maestro_id,
        a.grupo_id,
        a.materia_id,
        a.horario_inicio,
        a.horario_fin,
        a.dia_semana,
        g.nombre as grupo,
        g.grado,
        g.seccion,
        m.nombre as materia,
        m.codigo
      FROM asignaciones a
      INNER JOIN grupos g ON a.grupo_id = g.id
      INNER JOIN materias m ON a.materia_id = m.id
      WHERE a.maestro_id = ?
      ORDER BY g.nombre, m.nombre
    `, [id]);
    
    console.log('Asignaciones encontradas:', asignaciones.length); // Debug
    res.json(asignaciones);
  } catch (error) {
    console.error('Error en GET /maestros/:id/asignaciones:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Obtener materias disponibles para un maestro (no asignadas aún)
/*router.get('/maestros/:id/materias-disponibles', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await getConnection();
    
    const materias = await conn.query(`
      SELECT m.* 
      FROM materias m
      WHERE m.id NOT IN (
        SELECT DISTINCT materia_id 
        FROM asignaciones 
        WHERE maestro_id = ?
      )
      ORDER BY m.nombre
    `, [id]);
    
    res.json(materias);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});*/

// Obtener grupos disponibles para un maestro y materia específica
router.get('/asignaciones/grupos-disponibles', verifyToken, isAdmin, async (req, res) => {
  const { maestro_id, materia_id } = req.query;
  let conn;
  try {
    conn = await getConnection();
    
    let query = `
      SELECT g.* 
      FROM grupos g
      WHERE g.id NOT IN (
        SELECT grupo_id 
        FROM asignaciones 
        WHERE maestro_id = ? AND materia_id = ?
      )
    `;
    const grupos = await conn.query(query, [maestro_id, materia_id]);
    res.json(grupos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Crear asignación (ya lo tienes, pero verifica que esté así)
router.post('/asignaciones', verifyToken, isAdmin, async (req, res) => {
  const { maestro_id, grupo_id, materia_id, horario_inicio, horario_fin, dia_semana } = req.body;

  if (!maestro_id || !grupo_id || !materia_id) {
    return res.status(400).json({ error: 'Campos requeridos: maestro_id, grupo_id, materia_id' });
  }

  let conn;
  try {
    conn = await getConnection();
    
    // Verificar si ya existe la asignación
    const existe = await conn.query(
      'SELECT id FROM asignaciones WHERE maestro_id = ? AND grupo_id = ? AND materia_id = ?',
      [maestro_id, grupo_id, materia_id]
    );
    
    if (existe.length > 0) {
      return res.status(400).json({ error: 'Esta asignación ya existe' });
    }
    
    await conn.query(
      'INSERT INTO asignaciones (maestro_id, grupo_id, materia_id, horario_inicio, horario_fin, dia_semana) VALUES (?, ?, ?, ?, ?, ?)',
      [maestro_id, grupo_id, materia_id, horario_inicio || null, horario_fin || null, dia_semana || null]
    );
    
    res.status(201).json({ success: true, message: 'Asignación creada correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Eliminar asignación (ya lo tienes, verifica)
router.delete('/asignaciones/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  let conn;
  try {
    conn = await getConnection();
    await conn.query('DELETE FROM asignaciones WHERE id = ?', [id]);
    res.json({ success: true, message: 'Asignación eliminada correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});



// ===================== INSCRIPCIONES =====================

// Obtener alumnos de un grupo específico
router.get('/grupos/:id/alumnos', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await getConnection();
    const alumnos = await conn.query(`
      SELECT 
        i.id as inscripcion_id,
        al.id,
        al.nombre,
        al.apellido_paterno,
        al.apellido_materno,
        al.matricula,
        al.email,
        al.grado
      FROM inscripciones i
      INNER JOIN alumnos al ON i.alumno_id = al.id
      WHERE i.grupo_id = ?
      ORDER BY al.apellido_paterno, al.nombre
    `, [id]);
    res.json(alumnos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Obtener alumnos disponibles para inscribir en un grupo
router.get('/grupos/:id/alumnos-disponibles', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await getConnection();
    const alumnos = await conn.query(`
      SELECT 
        al.id,
        al.nombre,
        al.apellido_paterno,
        al.apellido_materno,
        al.matricula,
        al.grado
      FROM alumnos al
      WHERE al.estado = 'activo'
      AND al.id NOT IN (
        SELECT alumno_id 
        FROM inscripciones 
        WHERE grupo_id = ?
      )
      ORDER BY al.apellido_paterno, al.nombre
    `, [id]);
    res.json(alumnos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
  }
});



module.exports = router;
