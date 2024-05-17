CREATE DATABASE  IF NOT EXISTS `voting_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `voting_system`;
-- MariaDB dump 10.19  Distrib 10.4.27-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: voting_system
-- ------------------------------------------------------
-- Server version	10.4.27-MariaDB

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
-- Table structure for table `blockchain`
--

DROP TABLE IF EXISTS `blockchain`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blockchain` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `block_hash` varchar(255) NOT NULL,
  `previous_hash` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `data` text DEFAULT NULL,
  `version` varchar(10) DEFAULT '1.0.0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blockchain`
--

LOCK TABLES `blockchain` WRITE;
/*!40000 ALTER TABLE `blockchain` DISABLE KEYS */;
INSERT INTO `blockchain` VALUES (1,'175429f17d253b38bb8eb697a516276f57115436e96b3a4477baa74aef6c98c4','0','2024-05-06 12:11:19','19 - 8LB43I; 19 - sdnPgf; 19 - vcre3C - Total: 3','1.0.0'),(2,'ec941d9cb0d2c9dd9340f9dab55da87b20107934a51dcbbfde10e4170f694227','175429f17d253b38bb8eb697a516276f57115436e96b3a4477baa74aef6c98c4','2024-05-06 12:12:37','20 - gaH81l; 20 - 7ReIaN; 20 - RiIONc - Total: 3','1.0.0'),(3,'ca8b127f32549a836ec7d20a9396d253a851426bd5e400cd60262f38605e00a6','ec941d9cb0d2c9dd9340f9dab55da87b20107934a51dcbbfde10e4170f694227','2024-05-07 15:36:07','21 - RSalLW; 21 - AQwuc6; 21 - 36IsXn - Total: 3','1.0.0'),(4,'0b4975c80e85aed5edb7ff3563227ba97ceea0c891570d04d1308902a787f44b','ca8b127f32549a836ec7d20a9396d253a851426bd5e400cd60262f38605e00a6','2024-05-07 15:41:37','22 - kIvHCg; 22 - gVLfHy; 22 - emxKN7 - Total: 3','1.0.0'),(5,'bd05c046a55c1fdc89436659a98a87e4da1245a71d55e738844110050baa8781','0b4975c80e85aed5edb7ff3563227ba97ceea0c891570d04d1308902a787f44b','2024-05-12 19:19:27','27 - 5u671i; 27 - 5ynoKF; 27 - UcoKyw - Total: 3','1.0.0');
/*!40000 ALTER TABLE `blockchain` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `question` text DEFAULT NULL,
  `answer` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (21,21,'Как проголосовать в доступном голосовании?','Требуется нажать на зеленую кнопку Проголосовать и после выбора кандидатов подтвердить свой выбор кнопкой Подтвердить'),(22,22,'Как посмотреть результаты голосования?',NULL),(23,21,'Как выйти из системы?','В нижней части экрана есть красная кнопка Выйти');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `firstname` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `thirdname` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `password` (`password`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (20,'admin','admin123321@test.com','$2b$10$EHd4Gn5iG/Wv5FldZKUtDe9F7bWAht3XK8p6orh0ZRcey8PfPUfm2','admin','Admin','Boss',''),(21,'test1','test1@test.ru','$2b$10$JTsVjttMUWEQe2yropNeW.W/VPsQ57EraJqBnIlnahxDy16bLGCpu','user','test','one',''),(22,'test2','test2@test.ru','$2b$10$SFRpXe4TrrU/tTjJtUoyr.Aob0QToh0V6fDd06XeE4b7eBvmhXFB6','user','test','two',''),(23,'test3','test3@test.ru','$2b$10$kKEvOws6JR2fQPxvjyggr.HBmgqpBERMXWQkdIm2Bk0eEeY8pyxhW','user','test','three',''),(31,'testOt','testOt@test.ru','$2b$10$pat85S53frKV4qyT3YHM2e6cHaMwO072BsGzBZOcCSgyyShYgjhK.','user','test1','test2','test3');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `votes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `voting_id` int(11) DEFAULT NULL,
  `user_key` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `votes_ibfk_1` (`voting_id`),
  CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`voting_id`) REFERENCES `votings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votes`
--

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;
INSERT INTO `votes` VALUES (1,12,'vMNulu'),(2,11,'5tXolf'),(3,11,'5tXolf'),(4,13,'lGfLsV'),(6,15,'fm6xB1'),(7,16,'rzVNdp'),(8,17,'mtvAyP'),(9,18,'wroz9K'),(10,19,'vcre3C'),(11,19,'sdnPgf'),(17,19,'8LB43I'),(18,20,'RiIONc'),(19,20,'7ReIaN'),(20,20,'gaH81l'),(21,21,'36IsXn'),(22,21,'AQwuc6'),(23,21,'RSalLW'),(24,22,'emxKN7'),(25,22,'gVLfHy'),(26,22,'kIvHCg'),(27,23,'LggyZK'),(28,23,'Utq3h9'),(29,24,'dxJZL0'),(30,27,'UcoKyw'),(31,27,'5ynoKF'),(32,27,'5u671i'),(33,28,'NMa5ST');
/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER generate_blockchain_record AFTER INSERT ON votes
FOR EACH ROW
BEGIN
    DECLARE vote_count INT;
    DECLARE data_string VARCHAR(1000);
    DECLARE data_hash VARCHAR(255);
    DECLARE last_block_hash VARCHAR(255);

    SELECT COUNT(*) INTO vote_count FROM votes WHERE voting_id = NEW.voting_id;

    IF vote_count % 3 = 0 THEN
        SET last_block_hash = COALESCE((SELECT block_hash FROM blockchain ORDER BY id DESC LIMIT 1), '0');

        SELECT CONCAT(GROUP_CONCAT(CONCAT_WS(' - ', voting_id, user_key) SEPARATOR '; '), ' - Total: ', vote_count) INTO data_string 
        FROM (SELECT voting_id, user_key FROM votes WHERE voting_id = NEW.voting_id ORDER BY id DESC LIMIT 3) AS subquery;

        SET data_hash = SHA2(CONCAT(data_string, last_block_hash), 256);

        INSERT INTO blockchain (block_hash, previous_hash, data) VALUES (data_hash, last_block_hash, data_string);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `voting_options`
--

DROP TABLE IF EXISTS `voting_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `voting_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `voting_id` int(11) DEFAULT NULL,
  `v_option` varchar(255) DEFAULT NULL,
  `votes` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `voting_options_ibfk_1` (`voting_id`),
  CONSTRAINT `voting_options_ibfk_1` FOREIGN KEY (`voting_id`) REFERENCES `votings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voting_options`
--

LOCK TABLES `voting_options` WRITE;
/*!40000 ALTER TABLE `voting_options` DISABLE KEYS */;
INSERT INTO `voting_options` VALUES (1,11,'123',0),(2,11,'234',0),(3,11,'345',0),(4,12,'123',0),(5,12,'321',0),(6,13,'1',0),(7,13,'2',0),(8,13,'3',0),(9,13,'45',1),(11,15,'1',0),(12,15,'2',0),(13,15,'3',0),(14,15,'4',0),(15,15,'5',1),(16,16,'1var',0),(17,16,'2var',0),(18,16,'3 var',0),(19,16,'4 var',1),(20,17,'1 вариант',0),(21,17,'2 вариант',0),(22,17,'3 вариант',1),(23,18,'1',0),(24,18,'2',0),(25,18,'3',0),(26,18,'',1),(27,19,'1',0),(28,19,'2',0),(29,19,'3',3),(30,20,'1',0),(31,20,'2',0),(32,20,'3',3),(33,21,'1',0),(34,21,'2',0),(35,21,'3',3),(36,22,'1',1),(37,22,'2',1),(38,22,'3',1),(39,22,'',0),(40,23,'1',2),(41,23,'2',0),(42,23,'3',0),(43,23,'4',0),(44,24,'1',0),(45,24,'2',1),(46,24,'3',0),(48,26,'1',0),(49,26,'2',0),(50,26,'3',0),(51,27,'Cand1',2),(52,27,'Cand2',1),(53,27,'Cand3',0),(54,28,'Кандидат 1',1),(55,28,'Кандидат 2',0),(56,28,'Кандидат 3',0);
/*!40000 ALTER TABLE `voting_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voting_participants`
--

DROP TABLE IF EXISTS `voting_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `voting_participants` (
  `voting_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `voted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`voting_id`,`user_id`),
  KEY `voting_participants_ibfk_2` (`user_id`),
  CONSTRAINT `voting_participants_ibfk_1` FOREIGN KEY (`voting_id`) REFERENCES `votings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `voting_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voting_participants`
--

LOCK TABLES `voting_participants` WRITE;
/*!40000 ALTER TABLE `voting_participants` DISABLE KEYS */;
INSERT INTO `voting_participants` VALUES (27,21,1),(27,22,1),(27,23,1),(28,21,1),(28,22,0),(28,23,0);
/*!40000 ALTER TABLE `voting_participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votings`
--

DROP TABLE IF EXISTS `votings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `votings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votings`
--

LOCK TABLES `votings` WRITE;
/*!40000 ALTER TABLE `votings` DISABLE KEYS */;
INSERT INTO `votings` VALUES (11,'test','2024-05-04 00:00:00','2024-05-05 00:00:00','2024-05-03 13:06:29','2024-05-03 13:06:29'),(12,'123','2024-05-24 00:00:00','2024-05-25 00:00:00','2024-05-03 13:09:09','2024-05-03 13:09:09'),(13,'testco','2024-05-24 00:00:00','2024-05-31 00:00:00','2024-05-03 15:19:59','2024-05-03 15:19:59'),(15,'qwerty','2024-05-04 00:00:00','2024-05-11 00:00:00','2024-05-03 15:30:52','2024-05-03 15:30:52'),(16,'testiruem','2024-05-04 00:00:00','2024-05-11 00:00:00','2024-05-03 15:33:59','2024-05-03 15:33:59'),(17,'Голосование','2024-05-04 00:00:00','2024-05-05 00:00:00','2024-05-03 15:46:23','2024-05-03 15:46:23'),(18,'123321','2024-05-07 00:00:00','2024-05-08 00:00:00','2024-05-06 11:35:49','2024-05-06 11:35:49'),(19,'blockchtest','2024-05-08 00:00:00','2024-05-09 00:00:00','2024-05-06 12:04:02','2024-05-06 12:04:02'),(20,'testbl2','2024-05-07 00:00:00','2024-05-08 00:00:00','2024-05-06 12:12:16','2024-05-06 12:12:16'),(21,'testbl3','2024-05-08 00:00:00','2024-05-09 00:00:00','2024-05-07 15:35:41','2024-05-07 15:35:41'),(22,'test2231','2024-05-08 00:00:00','2024-05-09 00:00:00','2024-05-07 15:41:02','2024-05-07 15:41:02'),(23,'tesi','2024-05-08 00:00:00','2024-05-09 00:00:00','2024-05-07 16:12:35','2024-05-07 16:12:35'),(24,'Test','2024-04-30 00:00:00','2024-05-09 00:00:00','2024-05-07 16:41:46','2024-05-07 16:41:46'),(26,'Scrin','2024-05-11 00:00:00','2024-05-15 00:00:00','2024-05-12 15:50:12','2024-05-12 15:50:12'),(27,'TestVoting','2024-05-11 00:00:00','2024-05-14 00:00:00','2024-05-12 19:09:44','2024-05-12 19:09:44'),(28,'Голосование за кандидатов','2024-05-10 00:00:00','2024-05-16 00:00:00','2024-05-13 09:28:08','2024-05-13 09:28:08');
/*!40000 ALTER TABLE `votings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'voting_system'
--

--
-- Dumping routines for database 'voting_system'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-13 15:37:08
