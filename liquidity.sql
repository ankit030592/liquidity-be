-- MySQL dump 10.13  Distrib 5.7.27, for Linux (x86_64)
--
-- Host: localhost    Database: liquidity
-- ------------------------------------------------------
-- Server version	5.7.27-0ubuntu0.19.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `department` (
  `department_id` int(11) NOT NULL AUTO_INCREMENT,
  `department` varchar(100) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,'IT','2019-10-29 05:51:05','2019-10-29 05:51:05');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `f_name` varchar(50) NOT NULL,
  `m_name` varchar(45) DEFAULT NULL,
  `l_name` varchar(45) DEFAULT NULL,
  `phone` bigint(20) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `user_role_id` int(11) DEFAULT NULL,
  `token` varchar(45) DEFAULT NULL,
  `token_issued_on` datetime DEFAULT NULL,
  `token_expires_on` datetime DEFAULT NULL,
  `is_blocked` tinyint(1) DEFAULT '0',
  `verified` tinyint(1) DEFAULT NULL,
  `email_verification` tinyint(1) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`created`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `fk_user_user_role_idx` (`user_role_id`),
  KEY `fk_user_department_idx` (`department_id`),
  CONSTRAINT `fk_user_department` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_user_role` FOREIGN KEY (`user_role_id`) REFERENCES `user_role` (`user_role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4829 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (4822,'ankit.kapsime1@gmail.com','d6124b9d34be470dd0387dff9170c825cf8934ed','ankit','kumar','kapsime',7406185795,1,2,'S57GX0EfysN6yy4E','2019-11-01 08:58:19','2020-11-01 07:00:00',0,NULL,NULL,'2019-10-31 20:44:54','2019-10-31 20:42:27'),(4824,'ankit.kapsime+1@gmail.com','d6124b9d34be470dd0387dff9170c825cf8934ed','ankit',NULL,'kumar',1234567890,1,2,'x5h73faXQm4n8cjO','2019-10-31 20:45:30','2020-10-31 07:00:00',0,NULL,NULL,'2019-10-31 20:45:30','2019-10-31 20:45:30'),(4825,'ankit.kapsime+2@gmail.com','d6124b9d34be470dd0387dff9170c825cf8934ed','ankit',NULL,'kumar',1234567890,1,2,'KEzXhVI7iLpckGl9','2019-10-31 20:45:40','2020-10-31 07:00:00',0,NULL,NULL,'2019-10-31 20:45:40','2019-10-31 20:45:40'),(4826,'ankit.kapsime+3@gmail.com','d6124b9d34be470dd0387dff9170c825cf8934ed','ankit',NULL,'kumar',1234567890,1,2,'t6fJ5nLq2EJnHkHM','2019-10-31 20:45:47','2020-10-31 07:00:00',0,NULL,NULL,'2019-10-31 20:45:47','2019-10-31 20:45:47'),(4828,'admin@liquidity.com','e6655ddafa91f3a5416e730403d42d6ca9ac08dc','admin',NULL,NULL,NULL,NULL,5,'alTbKHlmpaBajaqy','2019-11-01 08:57:06','2020-11-01 07:00:00',0,NULL,1,'2019-11-01 07:46:56','2019-11-01 07:46:56');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_role` (
  `user_role_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_role` varchar(15) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (2,'USER','2019-10-29 06:09:01','2019-10-29 06:09:01'),(3,NULL,'2019-11-01 07:34:21','2019-11-01 07:34:21'),(4,NULL,'2019-11-01 07:37:18','2019-11-01 07:37:18'),(5,'ADMIN','2019-11-01 07:39:30','2019-11-01 07:39:30');
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-11-01 11:49:51
