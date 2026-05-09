/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.14-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: sae
-- ------------------------------------------------------
-- Server version	10.11.14-MariaDB-0+deb12u2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alumnos`
--

DROP TABLE IF EXISTS `alumnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumnos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `apellido_paterno` varchar(255) NOT NULL,
  `apellido_materno` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `matricula` varchar(50) NOT NULL,
  `grado` int(11) NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `matricula` (`matricula`),
  KEY `idx_email` (`email`),
  KEY `idx_matricula` (`matricula`),
  KEY `idx_grado` (`grado`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumnos`
--

LOCK TABLES `alumnos` WRITE;
/*!40000 ALTER TABLE `alumnos` DISABLE KEYS */;
INSERT INTO `alumnos` VALUES
(1,'Ashley Giselle','Angulo','Garcia','ashley.angulo@xochilhuitl.edu.mx','$2a$10$h6ghKBZVc9yR2nkV4vcNQu/zkBtWXpShIqmfUcNojW.b/z1y4ls0e','IEX-102',1,'activo','2026-05-04 23:28:48','2026-05-08 04:23:37'),
(2,'Diego Isaac','Arrollo','Rubio','diego.arrollo@xochilhuitl.edu.mx','$2a$10$h6ghKBZVc9yR2nkV4vcNQu/zkBtWXpShIqmfUcNojW.b/z1y4ls0e','IEX-103',1,'activo','2026-05-04 23:28:48','2026-05-08 04:23:53'),
(3,'Laila Renata ','Diaz ','Medina','laila.diaz@xochilhuitl.edu.mx','$2a$10$h6ghKBZVc9yR2nkV4vcNQu/zkBtWXpShIqmfUcNojW.b/z1y4ls0e','IEX-106',1,'activo','2026-05-04 23:28:48','2026-05-08 04:24:22'),
(4,'Ernesto','Blancas','Morales','ernesto.blancas@xochilhuitl.edu.mx','$2a$10$xf55GneJNpCSDVXuq1vD6OQN1yv2DRXmK3TqIw5vg35DgBi/HLagi','IEX-104',1,'activo','2026-05-06 17:49:41','2026-05-08 04:24:06'),
(5,'Ian Rodrigo','Alva','Hernández','rodrigo.alva@xochilhuitl.com','$2a$10$sdMXldHMgDK90L.u4rUi6.XYxtITo8PqQwJXUUoerSP/ZOh5kDQzq','IEX-101',1,'activo','2026-05-08 04:20:53','2026-05-08 04:20:53'),
(6,'Santiago Gael','Casas','Ayala','santiago.casa@xochilhuitl.edu.mx','$2a$10$lsJtlCj77jEL/wgkGrrdROahoArRsaOc7Uw89AuXm02yne.P55xTu','IEX-105',1,'activo','2026-05-08 04:22:26','2026-05-08 04:22:26'),
(7,'Sebastián','Guitiérrez','Jaime','sebastian.guitierrez@xochilhuitl.edu.mx','$2a$10$.tXIMKmRz5TNknHWa6PSn.Q9xUiM9ohKnE4jPmsxZ3duFZwerwO86','IEX-107',1,'activo','2026-05-08 04:23:10','2026-05-08 04:23:10'),
(8,'Samantha','Herón','López','samantha.heron@xochilhuitl.edu.mx','$2a$10$.sVTr3u0g8n3RcmgV1yGMexY7kCOzaybunYff7zZzTStyRSidr7VS','IEX-108',1,'activo','2026-05-08 04:25:07','2026-05-08 04:25:07'),
(9,'Sharon Zurisadai','Jaimes','Pineda','sharon.jaimes@xochilhuitl.edu.mx','$2a$10$xK9vJR6KlqXUsa8Dg/PzL.cDhI7Knrf18fbxPJmhdBT8JqNfhyUm2','IEX-109',1,'activo','2026-05-08 04:25:45','2026-05-08 04:25:45'),
(10,'Marcos Jorge','López','Carranza','marcos.lopez@xochilhuitl.edu.mx','$2a$10$37dkhG109f2liAerarEhX..jLmB1h4th4Z.9J6QHfNr856dK.0nYO','IEX-110',1,'activo','2026-05-08 04:26:31','2026-05-08 04:26:31'),
(11,'Tomás Emmanuel','López','Nápoles','emmanuel.lopez@xochilhuitl.edu.mx','$2a$10$0xNruZBvu/Qr7yuI37h5OeZ2MNJMvv606ulFN8odB8byH0rM7R4ki','IEX-111',1,'activo','2026-05-08 04:27:06','2026-05-08 04:27:06'),
(12,'Josué','Martínez','Suárez','josue.martinez@xochilhuitl.edu.mx','$2a$10$C0jn55aaZvVfKF36dYf2tOxyvoan9fyxB7ogHhoSdWv.fknY2s70u','IEX-112',1,'activo','2026-05-08 04:27:41','2026-05-08 04:27:41'),
(13,'Oscar Gael','Nava ','Moral','oscar.nava@xochilhuitl.edu.mx','$2a$10$l/sqZyjWyB2UP.HaELzNKu1lcbMX4pFdyNyjaZdVBckKyrj7AbP5u','IEX-113',1,'activo','2026-05-08 04:28:13','2026-05-08 04:28:13'),
(14,'Luz Bryanna','Peña','Ángel','bryanna.pena@xochilhuitl.edu.mx','$2a$10$Busuc0fkpa7QxfcZ3qv8h.IVa37BHwO9me1O2doI3S8WHQiE6ch/q','IEX-114',1,'activo','2026-05-08 04:29:03','2026-05-08 04:29:03'),
(15,'Ángel Leonel','Rentería','Barajas','angel.renteria@xochilhuitl.edu.mx','$2a$10$/448X8eIkux.7zE4Ith5PuEqm46WU/EF66UDd6FNhuFzaH9orjW0O','IEX-115',1,'activo','2026-05-08 04:29:44','2026-05-08 04:29:44'),
(16,'Melanie Zoe','Castro','Santillan','melanie.castro@xochilhuitl.edu.mx','$2a$10$PUr8zNBB3PRxj1PXFDuzbeoDS6aOUCGmrASzdJ29Yon4i0SgHM6sy','IEX-201',2,'activo','2026-05-08 04:31:15','2026-05-08 04:31:15'),
(17,'Liliana','Chavarría','Alarcón','liliana.chavarria@xochilhuitl.edu.mx','$2a$10$R994hN2ZmSkpACmsXFWaju370a2I4BiTzb4S.3ZPiNSInWaHF56d.','IEX-202',2,'activo','2026-05-08 04:31:48','2026-05-08 04:31:48'),
(18,'Fátima Camila','Guerra','Suárez','fatima.guerra@xochilhuitl.edu.mx','$2a$10$LH.S5.EZdu.DvVyWbrQIUeR3LY3lfznX4Y8REQzF.GGrLELKYOy4K','IEX-203',2,'activo','2026-05-08 04:32:36','2026-05-08 04:32:36'),
(19,'Gustavo','Hernández','MIranda','gustavo.hernandez@xochilhuitl.edu.mx','$2a$10$Hq14np2A9YJYBHxns0QKFuhLMOR5wgmNjhpHjgartyXGi7jrq0xiu','IEX-204',2,'activo','2026-05-08 04:33:54','2026-05-08 04:33:54'),
(22,'Isabella Guillith','Medina','Barragán','isabella.medina@xochilhuitl.edu.mx','$2a$10$TNZEh5EGzRMiysfUwMBBk.Fspx3mNAhjTSM/TEmLxA3nTGCwwk9HS','IEX-205',2,'activo','2026-05-08 04:34:49','2026-05-08 04:34:49'),
(23,'Ariel Maximiliano','Mendoza','Alpizar','maximiliano.mendoza@xochilhuitl.edu.mx','$2a$10$AwBwuq1gZBAkF7TG/7B.e.A2VhRvKtFDg5buNWG9Sv5QFp.Wd8qFy','IEX-206',2,'activo','2026-05-08 04:35:34','2026-05-08 04:35:34'),
(24,'Yoalli Sofía','Ortega','Alonso','yoalli.ortega@xochilhuitl.edu.mx','$2a$10$R/f/EZnKu7RW8zVjl/x8nuQ1a0Sf1xP6UJtAPTU7NspE5Bk3N/SrO','IEX-207',2,'activo','2026-05-08 04:36:14','2026-05-08 04:36:14'),
(25,'Dorian Natzanael','Pineda','Gordillo','dorian.pineda@xochilhuitl.edu.mx','$2a$10$WHF99C/plmh6YpkPgBpnO.cES9FIQPfa4tgQwcO.TZMz.WIslRCVy','IEX-208',2,'activo','2026-05-08 04:36:51','2026-05-08 04:36:51'),
(26,'Tamara','Vanegas','Galicia','tamara.vanegas@xochilhuitl.edu.mx','$2a$10$19OsbiClKlBDS02TXEbFoeGgS/OUEQQwT4w7X5LXRutQ1RD29uplG','IEX-209',2,'activo','2026-05-08 04:37:21','2026-05-08 04:37:21'),
(27,'André','Arenas','Loza','andre.arenas@xochilhuitl.edu.mx','$2a$10$aMaZaqCssVhIKJ4COyL.auemcPx7beyVlvE/0KEAh9rfD.lfXEJjC','IEX-301',3,'activo','2026-05-08 04:39:34','2026-05-08 04:39:34'),
(28,'Ibraim Santiago','Castro','Balbuena','santiago.castro@xochilhuitl.edu.mx','$2a$10$Ypgb1psa4wR2ohF89ikoP.YfsnuLocxMKM7ICFGWGtHOJzH0agYTi','IEX-302',3,'activo','2026-05-08 04:40:04','2026-05-08 04:40:04'),
(29,'Fernanda Lucía','Chavarría','Alarcón','fernanda.chavarria@xochilhuitl.edu.mx','$2a$10$ZbVU.5xEWgXIP4jRi5elmuN2xWZehexbo9wQHbm/RQratbIEs8ew2','IEX-303',3,'activo','2026-05-08 04:40:54','2026-05-08 04:40:54'),
(30,'Fernanda','González','Romero','fernanda.gonzalez@xochilhuitl.edu.mx','$2a$10$OA4DQwUtkR0aXGn3jeipiuambY6/RyzFrX5cq0Nx2AS4V0/dhzULG','IEX-304',3,'activo','2026-05-08 04:41:30','2026-05-08 04:41:30'),
(31,'Fryda','Gutiérrez','Jaime','fryda.guitierrez@xochilhuitl.edu.mx','$2a$10$iJiHxKgWMoHpwMxpmgbL8eghxASJ7NhSbAM/9/S67MdzzQcfUFt2a','IEX-305',3,'activo','2026-05-08 04:42:11','2026-05-08 04:42:11'),
(32,'Cristian Noel','Hernández ','Constantino','noel.hernandez@xochilhuitl.edu.mx','$2a$10$5EHpItWjv/wwbYeDAp7CDO.76RngESL/cCPlsv5p8Muel852tQ79K','IEX-306',3,'activo','2026-05-08 04:42:46','2026-05-08 04:42:46'),
(33,'Alejandro','Medina','Martínez','alejandro.medina@xochilhuitl.edu.mx','$2a$10$/IuB54v60V/xIMH4bfTct.4eXs7E5Rcd8o7zGR0gSkb07Yl4z6d.m','IEX-307',3,'activo','2026-05-08 04:43:18','2026-05-08 04:43:18'),
(34,'Vanessa','Méndez','Contreras','vanessa.mendez@xochilhuitl.edu.mx','$2a$10$ZSbF1G23B9DIxKaEAVnQxuWdvVTF5Pb.u43T3AN4vc948DXB3KhlS','IEX-308',3,'activo','2026-05-08 04:43:58','2026-05-08 04:43:58'),
(35,'Bruno','Ortega','Galarza','bruno.ortega@xochilhuitl.edu.mx','$2a$10$grUWAfS5Uq1wYow0VaY0dOed4PbsTrAWXbrFhZQK7ueVk91.BaONG','IEX-309',3,'activo','2026-05-08 04:44:25','2026-05-08 04:44:25'),
(36,'Camila','Pineda','Jurado','camila.pineda@xochilhuitl.edu.mx','$2a$10$x6UO4JbG4zdtZ2OJYQVsn.CHB1qtcchI56dLLQCPQzxuz3uhMtxLC','IEX-310',3,'activo','2026-05-08 04:44:50','2026-05-08 04:44:50'),
(37,'Abner Emmanuel','Retana','Montaño','abner.retana@xochilhuitl.edu.mx','$2a$10$A4.xbXqP8xOfWTv5mssLkuAriZU7Z3fnvQcHyQfOGefFOqMv.ttFm','IEX-311',3,'activo','2026-05-08 04:45:24','2026-05-08 04:45:24'),
(38,'Zamanta','Romero','Arellano','zamanta.romero@xochilhuitl.edu.mx','$2a$10$d5dG5x4Mzm0ksX9/JK83aOnKrbrVX7Ujrm20lBT.QQFKdii1N/xhq','IEX-312',3,'activo','2026-05-08 04:45:55','2026-05-08 04:48:52'),
(39,'Luis Ángel','Tepalcapa','Núñez','luis.tepalcapa@xochilhuitl.edu.mx','$2a$10$evfTVj2Nj6F4CN2Iag3HHeWtu/HLcO9U56.9aXbaYbdkiKv7iF3S.','IEX-313',3,'activo','2026-05-08 04:46:42','2026-05-08 04:46:42');
/*!40000 ALTER TABLE `alumnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asignaciones`
--

DROP TABLE IF EXISTS `asignaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `asignaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `maestro_id` int(11) NOT NULL,
  `grupo_id` int(11) NOT NULL,
  `materia_id` int(11) NOT NULL,
  `horario_inicio` time DEFAULT NULL,
  `horario_fin` time DEFAULT NULL,
  `dia_semana` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_asignacion` (`maestro_id`,`grupo_id`,`materia_id`,`dia_semana`,`horario_inicio`,`horario_fin`),
  KEY `materia_id` (`materia_id`),
  KEY `idx_maestro` (`maestro_id`),
  KEY `idx_grupo` (`grupo_id`),
  CONSTRAINT `asignaciones_ibfk_1` FOREIGN KEY (`maestro_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asignaciones_ibfk_2` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asignaciones_ibfk_3` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignaciones`
--

LOCK TABLES `asignaciones` WRITE;
/*!40000 ALTER TABLE `asignaciones` DISABLE KEYS */;
INSERT INTO `asignaciones` VALUES
(12,8,1,16,'11:40:00','12:30:00','Jueves','2026-05-06 07:12:55'),
(13,8,1,16,'10:00:00','10:50:00','Viernes','2026-05-06 07:13:13'),
(15,8,1,19,'11:40:00','12:30:00','Viernes','2026-05-06 07:13:36'),
(18,8,3,17,'12:30:00','13:20:00','Lunes','2026-05-06 07:14:52'),
(19,8,3,20,'10:50:00','11:40:00','Viernes','2026-05-06 07:15:07'),
(20,8,3,17,'12:30:00','13:20:00','Viernes','2026-05-06 07:15:24'),
(21,8,4,18,'13:20:00','14:10:00','Lunes','2026-05-06 07:16:13'),
(22,8,4,18,'10:00:00','10:50:00','Jueves','2026-05-06 07:16:29'),
(23,8,4,21,'13:20:00','14:10:00','Viernes','2026-05-06 07:16:43'),
(24,12,1,12,'07:50:00','08:40:00','Lunes','2026-05-06 23:24:11'),
(25,12,1,12,'07:50:00','08:40:00','Martes','2026-05-06 23:24:17'),
(26,12,1,12,'07:50:00','08:40:00','Miércoles','2026-05-06 23:24:23'),
(27,12,1,12,'07:50:00','08:40:00','Jueves','2026-05-06 23:24:29'),
(28,12,1,12,'08:40:00','09:30:00','Viernes','2026-05-06 23:24:42'),
(29,12,1,25,'07:00:00','07:50:00','Miércoles','2026-05-06 23:25:09'),
(30,12,1,25,'10:00:00','10:50:00','Martes','2026-05-06 23:25:20'),
(31,12,1,25,'07:50:00','08:40:00','Viernes','2026-05-06 23:25:31'),
(32,12,1,25,'11:40:00','12:30:00','Jueves','2026-05-06 23:25:48'),
(33,12,3,13,'07:00:00','07:50:00','Lunes','2026-05-06 23:26:27'),
(34,12,3,13,'07:00:00','07:50:00','Martes','2026-05-06 23:26:33'),
(35,12,3,13,'07:00:00','07:50:00','Miércoles','2026-05-06 23:26:45'),
(36,12,3,13,'08:40:00','09:30:00','Jueves','2026-05-06 23:26:54'),
(37,12,3,13,'07:00:00','07:50:00','Viernes','2026-05-06 23:27:02'),
(38,12,4,14,'07:00:00','07:50:00','Jueves','2026-05-06 23:27:56'),
(39,12,4,14,'08:40:00','09:30:00','Martes','2026-05-06 23:28:06'),
(40,12,4,14,'08:40:00','09:30:00','Miércoles','2026-05-06 23:28:12'),
(41,12,4,14,'11:40:00','12:30:00','Lunes','2026-05-06 23:28:28'),
(42,12,4,14,'10:00:00','10:50:00','Viernes','2026-05-06 23:28:40'),
(43,9,1,15,'08:40:00','09:30:00','Lunes','2026-05-06 23:33:06'),
(44,9,1,15,'08:40:00','09:30:00','Martes','2026-05-06 23:33:12'),
(45,9,1,15,'08:40:00','09:30:00','Miércoles','2026-05-06 23:33:17'),
(46,9,1,15,'08:40:00','09:30:00','Jueves','2026-05-06 23:33:21'),
(47,9,1,15,'10:00:00','10:50:00','Jueves','2026-05-06 23:33:37'),
(48,9,3,34,'07:50:00','08:40:00','Lunes','2026-05-06 23:34:06'),
(49,9,3,34,'07:50:00','08:40:00','Martes','2026-05-06 23:34:09'),
(50,9,3,34,'07:50:00','08:40:00','Miércoles','2026-05-06 23:34:13'),
(51,9,3,34,'07:00:00','07:50:00','Jueves','2026-05-06 23:34:21'),
(52,9,3,34,'08:40:00','09:30:00','Viernes','2026-05-06 23:34:30'),
(53,9,3,34,'10:00:00','10:50:00','Viernes','2026-05-06 23:34:40'),
(54,9,4,35,'07:00:00','07:50:00','Lunes','2026-05-06 23:34:58'),
(55,9,4,35,'07:00:00','07:50:00','Martes','2026-05-06 23:35:01'),
(56,9,4,35,'07:00:00','07:50:00','Miércoles','2026-05-06 23:35:06'),
(57,9,4,35,'07:50:00','08:40:00','Jueves','2026-05-06 23:35:16'),
(58,9,4,35,'10:50:00','11:40:00','Viernes','2026-05-06 23:35:27'),
(59,9,4,35,'11:40:00','12:30:00','Viernes','2026-05-06 23:35:30'),
(64,11,1,22,'13:20:00','14:10:00','Lunes','2026-05-06 23:37:07'),
(65,11,1,22,'11:40:00','12:30:00','Lunes','2026-05-06 23:37:22'),
(66,11,1,22,'11:40:00','12:30:00','Martes','2026-05-06 23:37:36'),
(67,11,1,22,'11:40:00','12:30:00','Miércoles','2026-05-06 23:37:42'),
(68,11,1,22,'10:50:00','11:40:00','Jueves','2026-05-06 23:37:51'),
(69,11,1,22,'10:50:00','11:40:00','Viernes','2026-05-06 23:38:03'),
(70,11,1,22,'12:30:00','13:20:00','Viernes','2026-05-06 23:38:11'),
(71,11,3,23,'10:00:00','10:50:00','Lunes','2026-05-06 23:52:46'),
(72,11,3,23,'10:50:00','11:40:00','Martes','2026-05-06 23:52:56'),
(73,11,3,23,'12:30:00','13:20:00','Martes','2026-05-06 23:53:02'),
(74,11,3,23,'10:50:00','11:40:00','Miércoles','2026-05-06 23:53:15'),
(75,11,3,23,'12:30:00','13:20:00','Jueves','2026-05-06 23:53:31'),
(76,11,3,23,'13:20:00','14:10:00','Viernes','2026-05-06 23:53:43'),
(78,11,3,23,'11:40:00','12:30:00','Viernes','2026-05-06 23:55:14'),
(79,11,4,24,'08:40:00','09:30:00','Lunes','2026-05-06 23:55:51'),
(80,11,4,24,'10:50:00','11:40:00','Lunes','2026-05-06 23:55:57'),
(81,11,4,24,'13:20:00','14:10:00','Miércoles','2026-05-06 23:56:12'),
(82,11,4,24,'10:00:00','10:50:00','Jueves','2026-05-06 23:56:23'),
(83,11,4,24,'11:40:00','12:30:00','Jueves','2026-05-06 23:56:29'),
(84,11,4,24,'07:00:00','07:50:00','Viernes','2026-05-06 23:56:40'),
(85,11,4,24,'07:50:00','08:40:00','Viernes','2026-05-06 23:56:57'),
(86,13,1,9,'07:00:00','07:50:00','Lunes','2026-05-06 23:57:31'),
(87,13,1,9,'07:00:00','07:50:00','Martes','2026-05-06 23:57:36'),
(89,13,1,9,'07:00:00','07:50:00','Jueves','2026-05-06 23:57:50'),
(90,13,1,9,'07:00:00','07:50:00','Viernes','2026-05-06 23:57:54'),
(91,13,1,9,'10:00:00','10:50:00','Miércoles','2026-05-06 23:58:11'),
(92,13,1,36,'10:00:00','10:50:00','Viernes','2026-05-06 23:58:29'),
(93,13,1,36,'13:20:00','14:10:00','Viernes','2026-05-06 23:58:34'),
(94,13,3,10,'08:40:00','09:30:00','Lunes','2026-05-06 23:59:18'),
(95,13,3,10,'08:40:00','09:30:00','Martes','2026-05-06 23:59:23'),
(96,13,3,10,'08:40:00','09:30:00','Miércoles','2026-05-06 23:59:27'),
(97,13,3,10,'07:50:00','08:40:00','Jueves','2026-05-06 23:59:31'),
(98,13,3,10,'07:50:00','08:40:00','Viernes','2026-05-06 23:59:35'),
(99,13,3,37,'13:20:00','14:10:00','Lunes','2026-05-07 00:01:00'),
(100,13,3,37,'11:40:00','12:30:00','Lunes','2026-05-07 00:01:08'),
(101,13,3,37,'12:30:00','13:20:00','Martes','2026-05-07 00:01:27'),
(102,13,3,37,'12:30:00','13:20:00','Jueves','2026-05-07 00:01:38'),
(103,13,4,11,'07:50:00','08:40:00','Lunes','2026-05-07 00:02:29'),
(104,13,4,11,'07:50:00','08:40:00','Martes','2026-05-07 00:02:33'),
(105,13,4,11,'07:50:00','08:40:00','Miércoles','2026-05-07 00:02:38'),
(106,13,4,11,'08:40:00','09:30:00','Jueves','2026-05-07 00:02:45'),
(107,13,4,11,'08:40:00','09:30:00','Viernes','2026-05-07 00:02:50'),
(108,13,4,38,'12:30:00','13:20:00','Lunes','2026-05-07 00:02:59'),
(109,13,4,38,'13:20:00','14:10:00','Martes','2026-05-07 00:03:08'),
(110,13,4,38,'13:20:00','14:10:00','Jueves','2026-05-07 00:03:27'),
(111,13,4,38,'12:30:00','13:20:00','Viernes','2026-05-07 00:03:34');
/*!40000 ALTER TABLE `asignaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calificaciones`
--

DROP TABLE IF EXISTS `calificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `calificaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alumno_id` int(11) NOT NULL,
  `materia_id` int(11) NOT NULL,
  `grupo_id` int(11) NOT NULL,
  `maestro_id` int(11) NOT NULL,
  `periodo` int(11) NOT NULL COMMENT '1=Primer trimestre, 2=Segundo trimestre, 3=Tercer trimestre',
  `calificacion` decimal(5,2) NOT NULL CHECK (`calificacion` >= 0 and `calificacion` <= 10),
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_calificacion` (`alumno_id`,`materia_id`,`grupo_id`,`periodo`),
  KEY `grupo_id` (`grupo_id`),
  KEY `idx_alumno` (`alumno_id`),
  KEY `idx_materia` (`materia_id`),
  KEY `idx_maestro` (`maestro_id`),
  KEY `idx_periodo` (`periodo`),
  CONSTRAINT `calificaciones_ibfk_1` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `calificaciones_ibfk_2` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`) ON DELETE CASCADE,
  CONSTRAINT `calificaciones_ibfk_3` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `calificaciones_ibfk_4` FOREIGN KEY (`maestro_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calificaciones`
--

LOCK TABLES `calificaciones` WRITE;
/*!40000 ALTER TABLE `calificaciones` DISABLE KEYS */;
INSERT INTO `calificaciones` VALUES
(1,2,19,1,8,1,10.00,NULL,'2026-05-08 04:09:00','2026-05-08 04:09:00'),
(2,4,19,1,8,1,10.00,NULL,'2026-05-08 04:09:02','2026-05-08 04:09:02'),
(3,3,19,1,8,1,10.00,NULL,'2026-05-08 04:09:04','2026-05-08 04:50:08'),
(4,2,19,1,8,2,8.00,NULL,'2026-05-08 04:10:02','2026-05-08 04:10:02'),
(5,4,19,1,8,2,8.00,NULL,'2026-05-08 04:10:03','2026-05-08 04:10:03'),
(6,3,19,1,8,2,8.00,NULL,'2026-05-08 04:10:04','2026-05-08 04:10:04'),
(7,2,19,1,8,3,10.00,NULL,'2026-05-08 04:13:30','2026-05-08 04:13:30'),
(8,4,19,1,8,3,10.00,NULL,'2026-05-08 04:13:31','2026-05-08 04:13:31'),
(9,3,19,1,8,3,10.00,NULL,'2026-05-08 04:13:32','2026-05-08 04:13:32'),
(10,1,19,1,8,1,10.00,NULL,'2026-05-08 04:14:34','2026-05-08 04:50:11'),
(11,1,19,1,8,2,7.00,NULL,'2026-05-08 04:14:38','2026-05-08 04:14:38'),
(12,1,19,1,8,3,7.00,NULL,'2026-05-08 04:14:41','2026-05-08 17:53:22'),
(13,5,19,1,8,3,10.00,NULL,'2026-05-08 17:53:19','2026-05-08 17:53:19'),
(14,6,19,1,8,3,10.00,NULL,'2026-05-08 17:53:26','2026-05-08 17:53:26'),
(15,5,19,1,8,1,10.00,NULL,'2026-05-08 18:21:15','2026-05-08 18:21:15'),
(16,6,19,1,8,1,8.00,NULL,'2026-05-08 18:21:21','2026-05-08 18:21:21'),
(17,7,19,1,8,1,8.00,NULL,'2026-05-08 18:21:24','2026-05-08 18:21:24'),
(18,8,19,1,8,1,8.00,NULL,'2026-05-08 18:21:24','2026-05-08 18:21:24'),
(19,9,19,1,8,1,8.00,NULL,'2026-05-08 18:21:24','2026-05-08 18:21:24'),
(20,10,19,1,8,1,8.00,NULL,'2026-05-08 18:21:25','2026-05-08 18:21:25'),
(21,11,19,1,8,1,9.00,NULL,'2026-05-08 18:21:26','2026-05-08 18:21:26'),
(22,12,19,1,8,1,10.00,NULL,'2026-05-08 18:21:28','2026-05-08 18:21:28'),
(23,13,19,1,8,1,10.00,NULL,'2026-05-08 18:21:28','2026-05-08 18:21:31'),
(24,14,19,1,8,1,10.00,NULL,'2026-05-08 18:21:28','2026-05-08 18:21:32'),
(25,15,19,1,8,1,10.00,NULL,'2026-05-08 18:22:11','2026-05-08 18:22:11'),
(26,1,9,1,13,1,8.00,NULL,'2026-05-09 00:08:53','2026-05-09 00:08:53');
/*!40000 ALTER TABLE `calificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grupos`
--

DROP TABLE IF EXISTS `grupos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `grado` int(11) NOT NULL,
  `seccion` varchar(50) DEFAULT NULL,
  `turno` enum('matutino','vespertino') NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_grado` (`grado`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupos`
--

LOCK TABLES `grupos` WRITE;
/*!40000 ALTER TABLE `grupos` DISABLE KEYS */;
INSERT INTO `grupos` VALUES
(1,'1 A',1,'A','matutino','2026-05-04 23:28:48','2026-05-06 04:29:25'),
(3,'2 A',2,'A','matutino','2026-05-04 23:28:48','2026-05-06 04:29:34'),
(4,'3 A',3,'A','matutino','2026-05-04 23:28:48','2026-05-06 04:29:39');
/*!40000 ALTER TABLE `grupos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscripciones`
--

DROP TABLE IF EXISTS `inscripciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscripciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alumno_id` int(11) NOT NULL,
  `grupo_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `grado` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_inscripcion` (`alumno_id`,`grupo_id`),
  UNIQUE KEY `unique_alumno_grado` (`alumno_id`,`grado`),
  KEY `idx_alumno` (`alumno_id`),
  KEY `idx_grupo` (`grupo_id`),
  CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscripciones`
--

LOCK TABLES `inscripciones` WRITE;
/*!40000 ALTER TABLE `inscripciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `inscripciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materias`
--

DROP TABLE IF EXISTS `materias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `materias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `grado` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `idx_codigo` (`codigo`),
  KEY `grado` (`grado`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materias`
--

LOCK TABLES `materias` WRITE;
/*!40000 ALTER TABLE `materias` DISABLE KEYS */;
INSERT INTO `materias` VALUES
(9,'Español 1','ESP01','Español 1 ','2026-05-05 07:00:11',1),
(10,'Español 2','ESP02','Español 2','2026-05-05 07:00:50',2),
(11,'Español 3','ESP03','Español 3','2026-05-05 07:01:05',3),
(12,'Matemáticas 1','MAT01','Matemáticas 1','2026-05-05 07:02:35',1),
(13,'Matemáticas 2','MAT02','Matemáticas 2','2026-05-05 07:02:58',2),
(14,'Matemáticas 3','MAT03','Matemáticas 3','2026-05-05 07:03:17',3),
(15,'Biología','BIO01','BIología','2026-05-05 07:04:32',1),
(16,'Robótica 1','ROB01','Robótica 1','2026-05-05 07:05:28',1),
(17,'Robótica 2','ROB02','Robótica 2','2026-05-05 07:05:43',2),
(18,'Robótica 3','ROB03','Robótica 3','2026-05-05 07:05:57',3),
(19,'Informática 1','INF01','Informática 1','2026-05-05 07:06:22',1),
(20,'Informática 2','INF02','Informática 2','2026-05-05 07:06:32',2),
(21,'Informática 3','INF03','Informática 3','2026-05-05 07:06:41',3),
(22,'Inglés 1','ING01','Inglés 1','2026-05-05 07:07:22',1),
(23,'Inglés 2','ING02','Inglés 2','2026-05-05 07:07:30',2),
(24,'Inglés 3','ING03','Inglés 3','2026-05-05 07:07:41',3),
(25,'Geografía ','GEO01','Geografía','2026-05-05 07:08:20',1),
(26,'Formación Cívica y Ética 1','FYC01','Formación Cívica y Ética 1','2026-05-05 07:08:42',1),
(27,'Formación Cívica y Ética 2','FYC02','Formación Cívica y Ética 2','2026-05-05 07:08:51',2),
(28,'Formación Cívica y Ética 3','FYC03','Formación Cívica y Ética 3','2026-05-05 07:09:00',3),
(29,'Educación Física','EDF01','Educación Física 1','2026-05-05 07:09:48',1),
(30,'Artes','ART01','Artes 1','2026-05-05 07:10:12',1),
(31,'Música ','MUS01','Música 1','2026-05-05 07:10:26',1),
(32,'Danza','DAN01','Danza 1','2026-05-05 07:10:50',1),
(33,'Ajedrez','AJE01','Ajedrez 1','2026-05-05 07:11:16',1),
(34,'Física','FIS02','Física','2026-05-05 07:11:38',2),
(35,'Química','QUI03','Química','2026-05-05 07:12:00',3),
(36,'Historia 1','HIS01','Historia 1','2026-05-05 07:12:18',1),
(37,'Historia 2','HIS02','Historia 2','2026-05-05 07:12:27',2),
(38,'Historia 3','HIS03','Historia 3','2026-05-05 07:12:36',3),
(40,'Danza','DAN02','Danza 2','2026-05-07 03:09:58',2),
(41,'Danza','DAN03','Danza 3','2026-05-07 03:10:16',3);
/*!40000 ALTER TABLE `materias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','maestro') NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_rol` (`rol`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES
(1,'Admin Sistema','admin@secundaria.edu','$2a$10$h6ghKBZVc9yR2nkV4vcNQu/zkBtWXpShIqmfUcNojW.b/z1y4ls0e','admin','activo','2026-05-04 23:28:48','2026-05-05 00:54:55'),
(8,'Cristopher Avila','cristopher.avila@xochilhuitl.edu.mx','$2a$10$pn1bj7qX0xa3kYiMyt4u2.LGRRqXt4HrfedGYNOyZ0R14Ly5aVKLS','maestro','activo','2026-05-05 06:51:14','2026-05-05 15:15:44'),
(9,'Enrique Pineda ','enrique.pineda@xochilhuitl.edu.mx','$2a$10$OG/WqRmoMTNSEaWEQ9FOqOzlJ9IHWahh/fUhmPbtNwIpoDKHOvPnq','maestro','activo','2026-05-05 06:52:23','2026-05-05 15:15:54'),
(10,'Gerardo Aldair Vázquez ','gerardo.vazquez@xochilhuitl.edu.mx','$2a$10$BHkkl5vaPfjJnkzkK0hlvOMBmcLH1gZo36YXV884BWz0BzMC0x2JG','maestro','activo','2026-05-05 06:53:40','2026-05-05 15:16:07'),
(11,'Nelly Gabriela Arenas','gabriela.arenas@xochiluitl.edu.mx','$2a$10$VPc2v9dKfPVjEuWbCorjj.BX5dd8cv1e5aPjJ4gKUxXzNocDSGMRm','maestro','activo','2026-05-05 06:55:42','2026-05-05 15:16:26'),
(12,'Jessica Alva','jessica.alva@xochilhuitl.edu.mx','$2a$10$jnWU9puEzyDYSo0VwMW.aespmWFZSGJG5J2kYI9cndJBUmyLrIdAq','maestro','activo','2026-05-05 06:57:57','2026-05-05 15:16:18'),
(13,'Elishai Martinez','elishai.martinez@xochilhuitl.edu.mx','$2a$10$i9ACirs4x8GpAPI46tNVsOy08IyqVd3zD/4F4213NW./UHjn5OWyi','maestro','activo','2026-05-05 15:15:31','2026-05-05 15:15:31');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-09  0:08:28
