-- Crear base de datos
CREATE DATABASE IF NOT EXISTS sae;
USE sae;

-- Tabla de usuarios (maestros, administradores)
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'maestro') NOT NULL,
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_rol (rol)
);

-- Tabla de alumnos
CREATE TABLE alumnos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  apellido_paterno VARCHAR(255) NOT NULL,
  apellido_materno VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  matricula VARCHAR(50) UNIQUE NOT NULL,
  grado INT NOT NULL,
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_matricula (matricula),
  INDEX idx_grado (grado)
);

-- Tabla de materias
CREATE TABLE materias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_codigo (codigo)
);

-- Tabla de grupos
CREATE TABLE grupos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  grado INT NOT NULL,
  seccion VARCHAR(50),
  turno ENUM('matutino', 'vespertino') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_grado (grado)
);

-- Tabla de asignaciones: maestro-grupo-materia
CREATE TABLE asignaciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  maestro_id INT NOT NULL,
  grupo_id INT NOT NULL,
  materia_id INT NOT NULL,
  horario_inicio TIME,
  horario_fin TIME,
  dia_semana VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (maestro_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE,
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
  UNIQUE KEY unique_asignacion (maestro_id, grupo_id, materia_id),
  INDEX idx_maestro (maestro_id),
  INDEX idx_grupo (grupo_id)
);

-- Tabla de inscripción: alumno-grupo
CREATE TABLE inscripciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alumno_id INT NOT NULL,
  grupo_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE,
  UNIQUE KEY unique_inscripcion (alumno_id, grupo_id),
  INDEX idx_alumno (alumno_id),
  INDEX idx_grupo (grupo_id)
);

-- Tabla de calificaciones
CREATE TABLE calificaciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alumno_id INT NOT NULL,
  materia_id INT NOT NULL,
  grupo_id INT NOT NULL,
  maestro_id INT NOT NULL,
  periodo INT NOT NULL COMMENT '1=Primer trimestre, 2=Segundo trimestre, 3=Tercer trimestre',
  calificacion DECIMAL(5,2) NOT NULL CHECK (calificacion >= 0 AND calificacion <= 10),
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE,
  FOREIGN KEY (maestro_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY unique_calificacion (alumno_id, materia_id, grupo_id, periodo),
  INDEX idx_alumno (alumno_id),
  INDEX idx_materia (materia_id),
  INDEX idx_maestro (maestro_id),
  INDEX idx_periodo (periodo)
);

-- Insertar datos de ejemplo
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Admin Sistema', 'admin@secundaria.edu', '$2a$10$YourHashedPasswordHere', 'admin'),
('Juan Pérez', 'juan.perez@secundaria.edu', '$2a$10$YourHashedPasswordHere', 'maestro'),
('María García', 'maria.garcia@secundaria.edu', '$2a$10$YourHashedPasswordHere', 'maestro');

INSERT INTO materias (nombre, codigo, descripcion) VALUES
('Matemáticas', 'MAT101', 'Cálculo y álgebra'),
('Español', 'ESP101', 'Lengua y literatura'),
('Inglés', 'ING101', 'Idioma extranjero'),
('Ciencias Naturales', 'CIN101', 'Biología y química'),
('Historia', 'HIS101', 'Historia de México'),
('Educación Física', 'EDF101', 'Deportes y actividad física');

INSERT INTO grupos (nombre, grado, seccion, turno) VALUES
('1A', 1, 'A', 'matutino'),
('1B', 1, 'B', 'matutino'),
('2A', 2, 'A', 'matutino'),
('3A', 3, 'A', 'matutino');

INSERT INTO alumnos (nombre, apellido_paterno, apellido_materno, email, password, matricula, grado) VALUES
('Carlos', 'López', 'Rodríguez', 'carlos.lopez@estudiante.edu', '$2a$10$YourHashedPasswordHere', 'MAT001', 1),
('Ana', 'Martínez', 'González', 'ana.martinez@estudiante.edu', '$2a$10$YourHashedPasswordHere', 'MAT002', 1),
('Pedro', 'Sánchez', 'Flores', 'pedro.sanchez@estudiante.edu', '$2a$10$YourHashedPasswordHere', 'MAT003', 1);
