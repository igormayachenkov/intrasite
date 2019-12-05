-- MySQL dump 10.13  Distrib 5.7.27, for Linux (x86_64)
--
-- Host: localhost    Database: intrasite
-- ------------------------------------------------------
-- Server version	5.7.27-0ubuntu0.18.04.1

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
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `devices` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `serial` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `received` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='HiQ devices';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES (157,'Телефон Google HTC Nexus One','Ориг.коробка','S/n HT9CTP807542','Куплен 30.04.2010','2010-04-30'),(160,'Смартфон iPhone 3 GS','Ориг.коробка','S/n 83017XW93NP','Куплен 09.06.2010','2010-06-09'),(162,'Телефон BlackBerry Bold 9700','Ориг.коробка','IMEI: 352479049462500','Куплен 29.07.2010','2010-07-29'),(163,'iPad Wi-Fi 16GB-FRD','Ориг.коробка','S/n GB026XM6Z38','Куплен 05.08.2010','2010-08-05'),(164,'iPod  Touch 4G 8Gb','Ориг.коробка','S/n C3XDGEE3DCP7','Куплен 03.11.2010','2010-11-03'),(165,'Смартфон iPhone 4G 16 Gb','Ориг.коробка','S/n 7S04361XA4S','Куплен 19.11.2010','2010-11-19'),(169,'Смартфон Google Nexus S (Samsung)','Ориг.коробка','S/n R3YB194946F','Куплен 13.04.2011-04-13','2011-04-13');
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `owners`
--

DROP TABLE IF EXISTS `owners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `owners` (
  `time` bigint(20) NOT NULL,
  `device_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='device-people relations';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owners`
--

LOCK TABLES `owners` WRITE;
/*!40000 ALTER TABLE `owners` DISABLE KEYS */;
INSERT INTO `owners` VALUES (1430092800000,157,1),(1545609600000,160,2);
/*!40000 ALTER TABLE `owners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `people`
--

DROP TABLE IF EXISTS `people`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `people` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `position_id` int(11) NOT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `mail` varchar(100) DEFAULT NULL,
  `birthday_day` int(11) DEFAULT NULL,
  `birthday_month` int(11) DEFAULT NULL,
  `birthday_year` int(11) DEFAULT NULL,
  `fired` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=75 DEFAULT CHARSET=utf8 COMMENT='HiQ staff';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `people`
--

LOCK TABLES `people` WRITE;
/*!40000 ALTER TABLE `people` DISABLE KEYS */;
INSERT INTO `people` VALUES (1,'Igor','Mayachenkov',12,'+7(905)XXX-XX-XX','igor.mayachenkov@yandex.ru',27,10,1971,NULL),(2,'Ivan','Ivanov',1,'+7 (905) XXX-XX-XXX','ivan.ivanov@yandex.ru',26,8,NULL,NULL),(3,'Petr','Petrov',2,'+7 (905) XXX-XX-XX','petr.petrov@yandex.ru',29,10,NULL,'2019-03-25');
/*!40000 ALTER TABLE `people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `positions`
--

DROP TABLE IF EXISTS `positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `positions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COMMENT='HiQ positions';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `positions`
--

LOCK TABLES `positions` WRITE;
/*!40000 ALTER TABLE `positions` DISABLE KEYS */;
INSERT INTO `positions` VALUES (1,'Office Manager','administration'),(2,'Chief Accountant','administration'),(3,'System Administrator','administration'),(4,'Administrative Assistant','administration'),(10,'Team Leader','developers'),(11,'Expert Researcher','developers'),(12,'Qualified Developer','developers'),(13,'Junior Developer','developers'),(21,'Senior Test Engineer','testers'),(22,'Test Engineer','testers'),(14,'Graphic Designer','developers'),(5,'Accountant','administration');
/*!40000 ALTER TABLE `positions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-12-05 12:11:07
