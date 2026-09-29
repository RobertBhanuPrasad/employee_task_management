-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: employee_task_management
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.24.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `employee_task_management`
--

/*!40000 DROP DATABASE IF EXISTS `employee_task_management`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `employee_task_management` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `employee_task_management`;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `task_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `type` enum('TASK_ASSIGNED','TASK_COMPLETED','TASK_DUE') NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  KEY `idx_notification_user` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (2,1,6,'Task Assigned','You have been assigned a new task.','TASK_ASSIGNED',1,'2026-07-04 17:03:06'),(3,1,7,'Task Assigned','You have been assigned a new task.','TASK_ASSIGNED',1,'2026-07-04 17:06:31'),(4,1,8,'Task Assigned','You have been assigned a new task.','TASK_ASSIGNED',0,'2026-07-05 05:35:00');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `priority` enum('LOW','MEDIUM','HIGH') DEFAULT 'MEDIUM',
  `status` enum('PENDING','IN_PROGRESS','COMPLETED') DEFAULT 'PENDING',
  `start_date` date NOT NULL,
  `due_date` date NOT NULL,
  `assigned_employee_id` int NOT NULL,
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_task_employee` (`assigned_employee_id`),
  KEY `idx_task_status` (`status`),
  KEY `idx_task_due_date` (`due_date`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assigned_employee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_due_date` CHECK ((`due_date` >= `start_date`))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (2,'Test Task','desc','LOW','COMPLETED','2026-07-03','2026-07-04',1,1,'2026-07-03 16:55:25','2026-07-04 12:02:09'),(3,'interview','fjfkfk','MEDIUM','PENDING','2026-07-04','2026-07-05',2,3,'2026-07-04 14:10:00','2026-07-04 14:29:01'),(4,'take a technical','oof','HIGH','PENDING','2026-07-04','2026-07-05',3,2,'2026-07-04 14:29:34','2026-07-04 14:29:34'),(5,'testing task','jfjfk','MEDIUM','PENDING','2026-07-04','2026-07-05',1,2,'2026-07-04 14:52:40','2026-07-04 14:52:40'),(6,'notify','testing the notification','MEDIUM','PENDING','2026-07-04','2026-07-05',1,2,'2026-07-04 17:03:06','2026-07-04 17:03:06'),(7,'test notify','test notify now','MEDIUM','PENDING','2026-07-04','2026-07-05',1,2,'2026-07-04 17:06:31','2026-07-04 17:06:31'),(8,'sido','diep','MEDIUM','COMPLETED','2026-07-05','2026-07-06',1,2,'2026-07-05 05:35:00','2026-07-05 05:35:00');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uploads`
--

DROP TABLE IF EXISTS `uploads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uploads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_type` varchar(100) NOT NULL,
  `file_size` int NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `uploads_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uploads`
--

LOCK TABLES `uploads` WRITE;
/*!40000 ALTER TABLE `uploads` DISABLE KEYS */;
INSERT INTO `uploads` VALUES (1,2,'1783097751393_test.pdf','test.pdf','/home/robert/employee-task-management/employee_task_management/backend/uploads/1783097751393_test.pdf','application/pdf',18,'2026-07-03 16:55:51'),(3,2,'1783150255401_sushma__1_.pdf','sushma (1).pdf','/home/robert/employee-task-management/employee_task_management/backend/uploads/1783150255401_sushma__1_.pdf','application/pdf',22803,'2026-07-04 07:30:55'),(4,2,'1783169125214_sushma__2_.pdf','sushma (2).pdf','/home/robert/employee-task-management/employee_task_management/backend/uploads/1783169125214_sushma__2_.pdf','application/pdf',22803,'2026-07-04 12:45:25');
/*!40000 ALTER TABLE `uploads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','EMPLOYEE') NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(250) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `profile_picture` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Robert Bhanu Prasad','robert@example.com','$2b$10$67ONGPbiLUAvaus2UKEYKeectoFjJCB/qHsOE/0CKvsFR9KLQ8PFu','EMPLOYEE','Engineering','Software Developer','2026-07-03 13:29:07','2026-07-03 13:29:07',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'bhanu','bhanu@gmail.com','$2b$10$y5pZXZgYyQxBouoohQbv/.feyggfc8jDDLRWOx1WAAjCiDir3gJ1.','ADMIN','Frontend Department','Software Developer','2026-07-04 02:59:07','2026-07-04 13:20:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'Swapna','dasarinagaswapna30@gmail.com','$2b$10$2UJvffv8Q8QIt.TTV5ewOOHnjuky.TIFlqA6AOHYuQGrDdhVdJ/Ry','ADMIN','Abcccc','Efg','2026-07-04 12:42:08','2026-07-04 12:42:08',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'bhanu','bhanu1@gmail.com','$2b$10$t.MGAUSYz18zzQTZ1Iyw.ebiUqQD1CUWgmBrXebeoJAyKW..KN7x2','ADMIN','Ab','Efg','2026-07-04 15:11:00','2026-07-04 15:11:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'employee_task_management'
--

--
-- Dumping routines for database 'employee_task_management'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-05 12:14:43
