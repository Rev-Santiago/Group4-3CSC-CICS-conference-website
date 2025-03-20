-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: conference_db
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `conference_publications`
--

DROP TABLE IF EXISTS `conference_publications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conference_publications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `publication_date` date DEFAULT NULL,
  `publication_description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conference_publications`
--

LOCK TABLES `conference_publications` WRITE;
/*!40000 ALTER TABLE `conference_publications` DISABLE KEYS */;
INSERT INTO `conference_publications` VALUES (1,'2025-03-01','Exploring AI in Healthcare: Innovations and Challenges'),(2,'2025-02-15','Big Data Analytics in Academic Research'),(3,'2025-02-01','Cybersecurity Trends in the Age of Remote Work'),(4,'2025-01-20','The Role of Blockchain in Higher Education'),(5,'2025-01-05','Machine Learning for Climate Change Prediction'),(6,'2024-12-22','Advancements in Quantum Computing: A Research Perspective'),(7,'2024-12-05','Digital Transformation Strategies in Universities'),(8,'2024-11-18','The Future of 5G and its Impact on Education'),(9,'2024-11-01','Ethical Considerations in AI Research'),(10,'2024-10-15','Data Privacy Laws: What Researchers Need to Know'),(11,'2025-03-01','Exploring AI in Healthcare: Innovations and Challenges'),(12,'2025-02-15','Big Data Analytics in Academic Research'),(13,'2025-02-01','Cybersecurity Trends in the Age of Remote Work'),(14,'2025-01-20','The Role of Blockchain in Higher Education'),(15,'2025-01-05','Machine Learning for Climate Change Prediction'),(16,'2024-12-22','Advancements in Quantum Computing: A Research Perspective'),(17,'2024-12-05','Digital Transformation Strategies in Universities'),(18,'2024-11-18','The Future of 5G and its Impact on Education'),(19,'2024-11-01','Ethical Considerations in AI Research'),(20,'2024-10-15','Data Privacy Laws: What Researchers Need to Know');
/*!40000 ALTER TABLE `conference_publications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events_history`
--

DROP TABLE IF EXISTS `events_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_date` date NOT NULL,
  `time_slot` varchar(255) NOT NULL,
  `program` text NOT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `online_room_link` varchar(255) DEFAULT NULL,
  `speaker` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events_history`
--

LOCK TABLES `events_history` WRITE;
/*!40000 ALTER TABLE `events_history` DISABLE KEYS */;
INSERT INTO `events_history` VALUES (1,'2024-03-01','09:00 AM - 11:00 AM','Tech Talk on AI and Future Trends','Auditorium','','John Doe'),(2,'2024-03-01','01:00 PM - 03:00 PM','Cybersecurity Workshop','Room 301','','Jane Smith'),(3,'2024-03-01','04:00 PM - 06:00 PM','Product Launch: New Features','Main Hall','','Sarah Johnson'),(4,'2024-03-02','10:00 AM - 12:00 PM','AI for Business: Panel Discussion','Room 205','','Michael Brown'),(5,'2024-03-02','01:00 PM - 03:00 PM','Digital Marketing Strategies','Conference Room B','','Rachel Green'),(6,'2024-03-02','04:00 PM - 06:00 PM','VR & AR in Education','Online','https://zoom.us/j/123456789','Emily Davis'),(7,'2024-03-03','09:00 AM - 10:30 AM','Product Development Roadmap','Auditorium','','Steven Harris'),(8,'2024-03-03','11:00 AM - 12:30 PM','Leadership in Technology','Room 101','','Laura Clark'),(9,'2024-03-03','01:30 PM - 03:00 PM','AI Research Forum','Main Hall','','John Doe'),(10,'2025-03-20','10:00 AM - 12:00 PM','Live Coding Session','Online','https://zoom.us/j/123456789','Emily Davis'),(11,'2025-03-20','12:30 PM - 02:30 PM','Product Management Techniques','Room 402','','Michael Brown'),(12,'2025-03-20','03:00 PM - 05:00 PM','Marketing Strategy Workshop','Conference Room B','','Sarah Johnson'),(13,'2025-03-25','09:00 AM - 11:00 AM','AI in Business: A Workshop','Room 402','','David Williams'),(14,'2025-03-25','11:30 AM - 01:00 PM','Blockchain Technology Deep Dive','Online','https://zoom.us/j/987654321','Rachel Green'),(15,'2025-03-25','02:00 PM - 04:00 PM','Product Design Trends','Main Hall','','Michael Brown'),(16,'2025-03-25','04:30 PM - 06:00 PM','Digital Transformation in Healthcare','Room 205','','Steven Harris'),(17,'2025-03-26','10:00 AM - 12:00 PM','Cybersecurity in the Cloud','Room 301','','John Doe'),(18,'2025-03-26','01:00 PM - 03:00 PM','Entrepreneurship & Innovation','Auditorium','','Sarah Johnson'),(19,'2025-03-26','03:30 PM - 05:00 PM','AI for Healthcare','Online','https://zoom.us/j/123456789','Laura Clark'),(20,'2025-03-27','09:00 AM - 11:00 AM','Cloud Computing Conference','Main Hall','','Emily Davis'),(21,'2025-03-27','11:30 AM - 01:00 PM','Blockchain & Cryptocurrency Workshop','Room 302','','Michael Brown'),(22,'2025-03-27','02:00 PM - 04:00 PM','Data Science & Big Data','Room 101','','David Williams'),(23,'2025-03-28','11:00 AM - 01:00 PM','Networking Event','Cafeteria','','Rachel Green'),(24,'2025-03-28','02:00 PM - 04:00 PM','Web Development Bootcamp','Room 402','','Sarah Johnson'),(25,'2025-03-28','04:30 PM - 06:00 PM','Digital Art and Animation','Room 205','','John Doe'),(26,'2025-04-01','09:00 AM - 11:00 AM','Future of AI and Robotics','Auditorium','','Steven Harris'),(27,'2025-04-01','11:30 AM - 01:00 PM','Startup Ideas: Pitching to Investors','Room 301','','Rachel Green'),(28,'2025-04-01','02:00 PM - 04:00 PM','Advanced Machine Learning','Online','https://zoom.us/j/987654321','Emily Davis'),(29,'2025-04-01','04:30 PM - 06:00 PM','Innovations in Marketing','Main Hall','','Michael Brown'),(30,'2025-04-02','10:00 AM - 12:00 PM','Cloud Security Conference','Conference Room B','https://zoom.us/j/987654321','David Williams'),(31,'2025-04-02','12:30 PM - 02:00 PM','Digital Currency in the Modern Economy','Room 205','https://zoom.us/j/987654321','Laura Clark'),(32,'2025-04-02','02:30 PM - 04:00 PM','AI for E-Commerce','Room 402','','Sarah Johnson'),(33,'2025-04-02','04:30 PM - 06:00 PM','Data Privacy Laws and Compliance','Online','https://zoom.us/j/123456789','Steven Harris');
/*!40000 ALTER TABLE `events_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@example.com','$2b$10$iWZDXlDAjldfgs8QjboYFudFmACPodWWyrSqoblLXLcAZDB2j9YeO','2025-03-18 01:06:12');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-20 15:27:22
