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
-- Table structure for table `event_approvals`
--

DROP TABLE IF EXISTS `event_approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_approvals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `approved_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `event_approvals_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `event_approvals_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_approvals`
--

LOCK TABLES `event_approvals` WRITE;
/*!40000 ALTER TABLE `event_approvals` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_drafts`
--

DROP TABLE IF EXISTS `event_drafts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_drafts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `event_data` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_drafts`
--

LOCK TABLES `event_drafts` WRITE;
/*!40000 ALTER TABLE `event_drafts` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_drafts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_date` date NOT NULL,
  `time_slot` varchar(255) NOT NULL,
  `program` text NOT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `online_room_link` varchar(255) DEFAULT NULL,
  `speaker` varchar(255) DEFAULT NULL,
  `theme` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `keynote_image` varchar(255) DEFAULT NULL,
  `invited_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'2024-03-01','09:00 AM - 11:00 AM','Tech Talk on AI and Future Trends','Auditorium','','John Doe',NULL,NULL,NULL,NULL,NULL),(2,'2024-03-01','01:00 PM - 03:00 PM','Cybersecurity Workshop','Room 301','','Jane Smith',NULL,NULL,NULL,NULL,NULL),(3,'2024-03-01','04:00 PM - 06:00 PM','Product Launch: New Features','Main Hall','','Sarah Johnson',NULL,NULL,NULL,NULL,NULL),(4,'2024-03-02','10:00 AM - 12:00 PM','AI for Business: Panel Discussion','Room 205','','Michael Brown',NULL,NULL,NULL,NULL,NULL),(5,'2024-03-02','01:00 PM - 03:00 PM','Digital Marketing Strategies','Conference Room B','','Rachel Green',NULL,NULL,NULL,NULL,NULL),(6,'2024-03-02','04:00 PM - 06:00 PM','VR & AR in Education','Online','https://zoom.us/j/123456789','Emily Davis',NULL,NULL,NULL,NULL,NULL),(7,'2024-03-03','09:00 AM - 10:30 AM','Product Development Roadmap','Auditorium','','Steven Harris',NULL,NULL,NULL,NULL,NULL),(8,'2024-03-03','11:00 AM - 12:30 PM','Leadership in Technology','Room 101','','Laura Clark',NULL,NULL,NULL,NULL,NULL),(9,'2024-03-03','01:30 PM - 03:00 PM','AI Research Forum','Main Hall','','John Doe',NULL,NULL,NULL,NULL,NULL),(10,'2025-03-20','10:00 AM - 12:00 PM','Live Coding Session','Online','https://zoom.us/j/123456789','Emily Davis',NULL,NULL,NULL,NULL,NULL),(11,'2025-03-20','12:30 PM - 02:30 PM','Product Management Techniques','Room 402','','Michael Brown',NULL,NULL,NULL,NULL,NULL),(12,'2025-03-20','03:00 PM - 05:00 PM','Marketing Strategy Workshop','Conference Room B','','Sarah Johnson',NULL,NULL,NULL,NULL,NULL),(13,'2025-03-25','09:00 AM - 11:00 AM','AI in Business: A Workshop','Room 402','','David Williams',NULL,NULL,NULL,NULL,NULL),(14,'2025-03-25','11:30 AM - 01:00 PM','Blockchain Technology Deep Dive','Online','https://zoom.us/j/987654321','Rachel Green',NULL,NULL,NULL,NULL,NULL),(15,'2025-03-25','02:00 PM - 04:00 PM','Product Design Trends','Main Hall','','Michael Brown',NULL,NULL,NULL,NULL,NULL),(16,'2025-03-25','04:30 PM - 06:00 PM','Digital Transformation in Healthcare','Room 205','','Steven Harris',NULL,NULL,NULL,NULL,NULL),(17,'2025-03-26','10:00 AM - 12:00 PM','Cybersecurity in the Cloud','Room 301','','John Doe',NULL,NULL,NULL,NULL,NULL),(18,'2025-03-26','01:00 PM - 03:00 PM','Entrepreneurship & Innovation','Auditorium','','Sarah Johnson',NULL,NULL,NULL,NULL,NULL),(19,'2025-03-26','03:30 PM - 05:00 PM','AI for Healthcare','Online','https://zoom.us/j/123456789','Laura Clark',NULL,NULL,NULL,NULL,NULL),(20,'2025-03-27','09:00 AM - 11:00 AM','Cloud Computing Conference','Main Hall','','Emily Davis',NULL,NULL,NULL,NULL,NULL),(21,'2025-03-27','11:30 AM - 01:00 PM','Blockchain & Cryptocurrency Workshop','Room 302','','Michael Brown',NULL,NULL,NULL,NULL,NULL),(22,'2025-03-27','02:00 PM - 04:00 PM','Data Science & Big Data','Room 101','','David Williams',NULL,NULL,NULL,NULL,NULL),(23,'2025-03-28','11:00 AM - 01:00 PM','Networking Event','Cafeteria','','Rachel Green',NULL,NULL,NULL,NULL,NULL),(24,'2025-03-28','02:00 PM - 04:00 PM','Web Development Bootcamp','Room 402','','Sarah Johnson',NULL,NULL,NULL,NULL,NULL),(25,'2025-03-28','04:30 PM - 06:00 PM','Digital Art and Animation','Room 205','','John Doe',NULL,NULL,NULL,NULL,NULL),(26,'2025-04-01','09:00 AM - 11:00 AM','Future of AI and Robotics','Auditorium','','Steven Harris',NULL,NULL,NULL,NULL,NULL),(27,'2025-04-01','11:30 AM - 01:00 PM','Startup Ideas: Pitching to Investors','Room 301','','Rachel Green',NULL,NULL,NULL,NULL,NULL),(28,'2025-04-01','02:00 PM - 04:00 PM','Advanced Machine Learning','Online','https://zoom.us/j/987654321','Emily Davis',NULL,NULL,NULL,NULL,NULL),(29,'2025-04-01','04:30 PM - 06:00 PM','Innovations in Marketing','Main Hall','','Michael Brown',NULL,NULL,NULL,NULL,NULL),(30,'2025-04-02','10:00 AM - 12:00 PM','Cloud Security Conference','Conference Room B','https://zoom.us/j/987654321','David Williams',NULL,NULL,NULL,NULL,NULL),(31,'2025-04-02','12:30 PM - 02:00 PM','Digital Currency in the Modern Economy','Room 205','https://zoom.us/j/987654321','Laura Clark',NULL,NULL,NULL,NULL,NULL),(32,'2025-04-02','02:30 PM - 04:00 PM','AI for E-Commerce','Room 402','','Sarah Johnson',NULL,NULL,NULL,NULL,NULL),(33,'2025-04-02','04:30 PM - 06:00 PM','Data Privacy Laws and Compliance','Online','https://zoom.us/j/123456789','Steven Harris',NULL,NULL,NULL,NULL,NULL),(34,'2025-04-15','09:00 AM - 11:00 AM','Next-Gen Web Security','Auditorium A','https://zoom.us/j/123456789','Alice Robertson',NULL,NULL,NULL,NULL,NULL),(35,'2025-04-22','11:30 AM - 01:00 PM','Quantum Computing & AI','Conference Room C','','Michael Brown',NULL,NULL,NULL,NULL,NULL),(36,'2025-05-05','02:00 PM - 03:30 PM','Cyber Threat Intelligence','Room 101','https://meet.google.com/xyz-abc','Daniel Martinez',NULL,NULL,NULL,NULL,NULL),(37,'2025-05-18','10:00 AM - 12:00 PM','Blockchain in Finance','Online','https://zoom.us/j/987654321','Sophia Carter',NULL,NULL,NULL,NULL,NULL),(38,'2025-06-02','03:00 PM - 04:30 PM','Deep Learning in Healthcare','Room 502','','Emma Johnson',NULL,NULL,NULL,NULL,NULL),(39,'2025-06-15','01:00 PM - 03:00 PM','Ethical Hacking Workshop','Training Room 3','https://meet.google.com/hack-workshop','Robert Wilson',NULL,NULL,NULL,NULL,NULL),(40,'2025-07-01','04:00 PM - 05:30 PM','Future of 5G Networks','Online','https://zoom.us/j/543219876','David Lee',NULL,NULL,NULL,NULL,NULL),(41,'2025-07-20','09:30 AM - 11:00 AM','Cloud Security & Zero Trust','Room 308','','Jessica Anderson',NULL,NULL,NULL,NULL,NULL),(42,'2025-08-05','11:00 AM - 12:30 PM','AI in Game Development','Auditorium B','https://meet.google.com/game-ai','Chris Evans',NULL,NULL,NULL,NULL,NULL),(43,'2025-08-22','02:00 PM - 03:30 PM','Privacy in Social Media','Room 214','https://zoom.us/j/321654987','Natalie Brooks',NULL,NULL,NULL,NULL,NULL),(44,'2025-04-15','09:00 AM - 11:00 AM','Next-Gen Web Security','Auditorium A','https://zoom.us/j/123456789','Alice Robertson',NULL,NULL,NULL,NULL,NULL),(45,'2025-04-15','11:30 AM - 01:00 PM','Machine Learning in Finance','Room 203','','Ethan Carter',NULL,NULL,NULL,NULL,NULL),(46,'2025-04-15','02:00 PM - 03:30 PM','Cloud Infrastructure for Startups','Online','https://meet.google.com/cloud-101','Sophia Davis',NULL,NULL,NULL,NULL,NULL),(47,'2025-04-15','04:00 PM - 05:30 PM','Cybersecurity Best Practices','Room 404','https://zoom.us/j/987654321','David Miller',NULL,NULL,NULL,NULL,NULL),(48,'2025-04-15','06:00 PM - 07:30 PM','Tech Trends for 2025','Main Hall','','Emma Thompson',NULL,NULL,NULL,NULL,NULL),(49,'2025-04-22','09:00 AM - 11:00 AM','Quantum Computing & AI','Conference Room C','','Michael Brown',NULL,NULL,NULL,NULL,NULL),(50,'2025-04-22','11:30 AM - 01:00 PM','Data Science for Beginners','Online','https://zoom.us/j/222333444','Olivia Parker',NULL,NULL,NULL,NULL,NULL),(51,'2025-04-22','02:00 PM - 03:30 PM','Blockchain in the Supply Chain','Room 502','https://meet.google.com/block-2025','James Wilson',NULL,NULL,NULL,NULL,NULL),(52,'2025-04-22','04:00 PM - 05:30 PM','AI Ethics and Responsibility','Room 301','','Sarah Lee',NULL,NULL,NULL,NULL,NULL),(53,'2025-04-22','06:00 PM - 07:30 PM','Future of IoT Security','Auditorium B','https://zoom.us/j/556677889','Ethan Clark',NULL,NULL,NULL,NULL,NULL),(54,'2025-05-05','09:00 AM - 11:00 AM','Cyber Threat Intelligence','Room 101','https://meet.google.com/xyz-abc','Daniel Martinez',NULL,NULL,NULL,NULL,NULL),(55,'2025-05-05','11:30 AM - 01:00 PM','Introduction to NLP','Online','https://zoom.us/j/987654321','Laura Anderson',NULL,NULL,NULL,NULL,NULL),(56,'2025-05-05','02:00 PM - 03:30 PM','Virtual Reality in Education','Room 407','','Ryan Cooper',NULL,NULL,NULL,NULL,NULL),(57,'2025-05-05','04:00 PM - 05:30 PM','Deepfake Detection Techniques','Room 606','https://zoom.us/j/444555666','Jessica Hall',NULL,NULL,NULL,NULL,NULL),(58,'2025-05-05','06:00 PM - 07:30 PM','5G and Smart Cities','Main Hall','','Kevin White',NULL,NULL,NULL,NULL,NULL),(59,'2025-05-18','09:00 AM - 11:00 AM','Blockchain in Finance','Online','https://zoom.us/j/987654321','Sophia Carter',NULL,NULL,NULL,NULL,NULL),(60,'2025-05-18','11:30 AM - 01:00 PM','Hacking and Ethical Security','Room 310','','Liam Harris',NULL,NULL,NULL,NULL,NULL),(61,'2025-05-18','02:00 PM - 03:30 PM','Metaverse and Business','Auditorium C','https://meet.google.com/meta-2025','Emily Robinson',NULL,NULL,NULL,NULL,NULL),(62,'2025-05-18','04:00 PM - 05:30 PM','Digital Marketing AI','Online','https://zoom.us/j/777888999','Benjamin Moore',NULL,NULL,NULL,NULL,NULL),(63,'2025-05-18','06:00 PM - 07:30 PM','AR/VR in Healthcare','Room 205','','Chloe Nelson',NULL,NULL,NULL,NULL,NULL),(64,'2025-06-02','09:00 AM - 11:00 AM','Deep Learning in Healthcare','Room 502','','Emma Johnson',NULL,NULL,NULL,NULL,NULL),(65,'2025-06-02','11:30 AM - 01:00 PM','Big Data in Government','Room 401','https://zoom.us/j/111222333','Daniel Clark',NULL,NULL,NULL,NULL,NULL),(66,'2025-06-02','02:00 PM - 03:30 PM','AI-Powered Chatbots','Online','https://meet.google.com/chatbot-2025','Sophia Williams',NULL,NULL,NULL,NULL,NULL),(67,'2025-06-02','04:00 PM - 05:30 PM','Privacy in the Age of AI','Room 303','','Ethan Garcia',NULL,NULL,NULL,NULL,NULL),(68,'2025-06-02','06:00 PM - 07:30 PM','Wearable Tech & Health','Main Hall','https://zoom.us/j/444555666','Olivia Martin',NULL,NULL,NULL,NULL,NULL),(69,'2025-06-15','09:00 AM - 11:00 AM','Ethical Hacking Workshop','Training Room 3','https://meet.google.com/hack-workshop','Robert Wilson',NULL,NULL,NULL,NULL,NULL),(70,'2025-06-15','11:30 AM - 01:00 PM','AI-Generated Art & Copyrights','Room 215','','Liam Carter',NULL,NULL,NULL,NULL,NULL),(71,'2025-06-15','02:00 PM - 03:30 PM','Cybercrime Prevention Strategies','Online','https://zoom.us/j/789101112','Natalie Scott',NULL,NULL,NULL,NULL,NULL),(72,'2025-06-15','04:00 PM - 05:30 PM','Sustainable Tech Innovations','Room 510','','Ella Hernandez',NULL,NULL,NULL,NULL,NULL),(73,'2025-06-15','06:00 PM - 07:30 PM','Smart Homes & Automation','Auditorium D','https://meet.google.com/smart-home','Mason Gonzalez',NULL,NULL,NULL,NULL,NULL),(74,'2025-07-01','09:00 AM - 11:00 AM','Future of 5G Networks','Online','https://zoom.us/j/543219876','David Lee',NULL,NULL,NULL,NULL,NULL),(75,'2025-07-01','11:30 AM - 01:00 PM','Automating Workflows with AI','Room 611','','Emily Martinez',NULL,NULL,NULL,NULL,NULL),(76,'2025-07-01','02:00 PM - 03:30 PM','Zero Trust Architecture','Conference Room A','https://meet.google.com/zero-trust','Owen Parker',NULL,NULL,NULL,NULL,NULL),(77,'2025-07-01','04:00 PM - 05:30 PM','AI & Journalism','Online','https://zoom.us/j/112233445','Victoria Wright',NULL,NULL,NULL,NULL,NULL),(78,'2025-07-01','06:00 PM - 07:30 PM','Smart Contracts & Legal Tech','Room 107','','Lucas Ramirez',NULL,NULL,NULL,NULL,NULL),(79,'2025-07-20','09:00 AM - 11:00 AM','Cloud Security & Zero Trust','Room 308','','Jessica Anderson',NULL,NULL,NULL,NULL,NULL),(80,'2025-07-20','11:30 AM - 01:00 PM','AI in Game Development','Auditorium B','https://meet.google.com/game-ai','Chris Evans',NULL,NULL,NULL,NULL,NULL),(81,'2025-07-20','02:00 PM - 03:30 PM','AI in Education','Online','https://zoom.us/j/998877665','Hannah Roberts',NULL,NULL,NULL,NULL,NULL),(82,'2025-07-20','04:00 PM - 05:30 PM','Privacy in Social Media','Room 214','https://zoom.us/j/321654987','Natalie Brooks',NULL,NULL,NULL,NULL,NULL),(83,'2025-07-20','06:00 PM - 07:30 PM','Neural Networks Explained','Room 420','','Henry Adams',NULL,NULL,NULL,NULL,NULL),(84,'2025-04-12','08:30','I am the event here','Cafeteria','','Rajeesh Kumar, Kumar','Black','Workshop','keynoteImage-1743854158881.png',NULL,NULL),(85,'2025-04-11','23:23','IAsddasd','Auditorium','','Rajeesh Kumar, Kumar','Black','Conference','keynoteImage-1743855678204.png',NULL,NULL),(86,'2025-04-11','09:50 AM - 08:29 PM','I am an event HEHE','Cafeteria','this is a zoom link','Rajeesh Kumar, Kumar','Black','Conference','keynoteImage-1743856201521.png',NULL,NULL);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
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
  `account_type` enum('super_admin','admin') NOT NULL DEFAULT 'admin',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@example.com','$2b$10$iWZDXlDAjldfgs8QjboYFudFmACPodWWyrSqoblLXLcAZDB2j9YeO','2025-03-18 01:06:12','super_admin'),(2,'dummyadmin@example.com','$2b$10$iWZDXlDAjldfgs8QjboYFudFmACPodWWyrSqoblLXLcAZDB2j9YeO','2025-04-02 22:31:46','admin');
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

-- Dump completed on 2025-04-07  8:14:25
