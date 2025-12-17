CREATE DATABASE  IF NOT EXISTS `swimming_club_shop` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `swimming_club_shop`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: swimming_club_shop
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `article_id` int NOT NULL AUTO_INCREMENT,
  `article_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` text COLLATE utf8mb4_unicode_ci,
  `file_url` text COLLATE utf8mb4_unicode_ci,
  `author` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `views` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`article_id`),
  UNIQUE KEY `article_code` (`article_code`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES (1,NULL,'Thành tích xuất sắc tại giải bơi trẻ 2025','Đội tuyển CLB HNT đã giành được 5 huy chương vàng.','<p>Trong khuôn khổ giải bơi lội trẻ toàn quốc diễn ra tại Đà Nẵng...</p><p>Các vận động viên đã thi đấu hết mình và giành được nhiều giải thưởng lớn!</p>','../sp_home/images/bao1.png',NULL,'Ban Truyền Thông','giai-thuong','2025-12-07 17:00:00',1000,'2025-12-10 16:02:29','2025-12-14 20:04:13'),(2,NULL,'HNT Chiến Thắng Áp Đảo Tại Giải Vô Địch Quốc Gia 2024','Các vận động viên đã mang về tổng cộng 15 huy chương vàng, thiết lập kỷ lục mới cho Câu lạc bộ.','Câu lạc bộ bơi lội HNT đã có màn trình diễn xuất sắc tại Giải Vô Địch Quốc Gia 2024, giành được tổng cộng 25 huy chương các loại, trong đó có 15 huy chương vàng, 7 huy chương bạc và 3 huy chương đồng.\n\nĐây là thành tích tốt nhất trong lịch sử của câu lạc bộ, vượt qua kỷ lục 12 huy chương vàng của năm trước. Đặc biệt, vận động viên Trần Thị B đã phá kỷ lục quốc gia ở nội dung 200m bơi bướm với thành tích 2 phút 08 giây.\n\nHuấn luyện viên trưởng Nguyễn Văn A chia sẻ: \"Chúng tôi rất tự hào về các em. Thành tích này là kết quả của cả một năm tập luyện chăm chỉ và kỷ luật. Đây là bước đệm quan trọng cho SEA Games sắp tới.\"\n\nCâu lạc bộ cũng vinh dự nhận Cúp Vô địch toàn đoàn và danh hiệu \"Đội tuyển xuất sắc nhất giải\".','../sp_home/images/thang.jpg',NULL,'Ban Biên Tập','Giải Đấu','2024-11-20 02:00:00',1250,'2025-12-10 16:02:29','2025-12-14 20:04:10'),(3,NULL,'Trần Thị B Chia Sẻ: \"Tất cả là nhờ sự khổ luyện\"','Buổi phỏng vấn độc quyền với kình ngư trẻ tuổi Trần Thị B sau thành tích ấn tượng tại SEA Games 33.','Trong buổi phỏng vấn độc quyền với phóng viên Thanh Hà, vận động viên Trần Thị B - người vừa giành 3 huy chương vàng tại SEA Games 33 - đã chia sẻ về hành trình của mình.\n\n\"Từ nhỏ, tôi đã yêu thích bơi lội. Mỗi ngày, tôi dành ít nhất 5 giờ tập luyện tại bể bơi. Có những ngày mệt mỏi, muốn bỏ cuộc, nhưng nghĩ đến ước mơ đứng trên bục vinh quang, tôi lại có thêm động lực.\"\n\nTrần Thị B hiện đang là sinh viên năm 2 Đại học Thể dục Thể thao. Cô cho biết việc cân bằng giữa học tập và tập luyện rất khó khăn, nhưng nhờ sự hỗ trợ của gia đình và câu lạc bộ, cô đã vượt qua.\n\n\"Thành công không phải ngẫu nhiên mà có. Đó là kết quả của hàng nghìn giờ tập luyện, của những giọt mồ hôi và đôi khi là nước mắt. Tôi muốn nhắn nhủ đến các bạn trẻ rằng: hãy theo đuổi đam mê và không ngừng cố gắng.\"\n\nHuấn luyện viên của cô, ông Lê Văn C, nhận xét: \"B là một vận động viên rất kỷ luật và quyết tâm. Tôi tin rằng cô ấy còn tiến xa hơn nữa trong tương lai.\"','../tuyenthu/B.png',NULL,'Thanh Hà','Phỏng Vấn','2024-11-15 07:30:00',980,'2025-12-10 16:02:29','2025-12-14 20:04:03'),(4,NULL,'Gương mặt trẻ: Khám phá tài năng của Võ Văn C','Giới thiệu chi tiết về quá trình tập luyện và mục tiêu tương lai của vận động viên triển vọng Võ Văn C.','Võ Văn C, 18 tuổi, được xem là \"ngôi sao đang lên\" của làng bơi lội Việt Nam. Xuất thân từ một gia đình nghèo ở miền Tây, C đã vượt qua nhiều khó khăn để theo đuổi đam mê bơi lội.\n\n\"Lần đầu tiên tôi tiếp xúc với bơi lội là khi 10 tuổi, qua một lớp học bơi miễn phí do địa phương tổ chức. Ngay lập tức, tôi cảm thấy mình sinh ra là để bơi.\"\n\nNăm 16 tuổi, C được phát hiện bởi tuyển trạch viên của HNT Swim Club và được đưa về đào tạo. Chỉ sau 2 năm, cậu đã giành huy chương vàng giải trẻ toàn quốc.\n\nMục tiêu của C trong năm tới là được tham dự SEA Games và giành huy chương. \"Tôi muốn chứng minh rằng, dù xuất phát điểm có thế nào, chỉ cần có đam mê và nỗ lực, chúng ta đều có thể thành công.\"\n\nNgoài tập luyện, C còn tham gia các hoạt động thiện nguyện, dạy bơi miễn phí cho trẻ em vùng sông nước. \"Tôi muốn giúp các em nhỏ có kỹ năng bơi lội để phòng tránh đuối nước.\"','../tuyenthu/C.png',NULL,'Phương Nghi','Phỏng Vấn','2024-11-01 03:15:00',760,'2025-12-10 16:02:29','2025-12-10 16:14:05'),(5,NULL,'HNT Nhận Danh Hiệu \"Câu lạc bộ bơi lội xuất sắc nhất năm\"','Buổi lễ vinh danh Câu lạc bộ HNT với những đóng góp to lớn cho nền bơi lội nước nhà.','Tại Lễ trao giải Thể thao Việt Nam 2024 diễn ra tối qua, Câu lạc bộ bơi lội HNT đã vinh dự nhận danh hiệu \"Câu lạc bộ bơi lội xuất sắc nhất năm\".\n\nĐây là năm thứ 3 liên tiếp HNT nhận được danh hiệu này, khẳng định vị thế dẫn đầu trong làng bơi lội nước nhà.\n\nÔng Nguyễn Văn D, Chủ tịch Câu lạc bộ, phát biểu: \"Đây là niềm vinh dự lớn không chỉ của ban lãnh đạo mà còn của toàn thể vận động viên, huấn luyện viên và nhân viên câu lạc bộ. Thành tích này là minh chứng cho sự nỗ lực không ngừng nghỉ của tất cả mọi người.\"\n\nTrong năm qua, HNT đã đạt được nhiều thành tích ấn tượng:\n- 25 huy chương tại Giải Vô địch Quốc gia\n- 8 huy chương tại SEA Games\n- 2 kỷ lục quốc gia được xác lập\n- Tổ chức 5 khóa đào tạo bơi lội miễn phí cho 500 trẻ em\n\n\"Ngoài thành tích thi đấu, chúng tôi còn chú trọng đến việc phát triển cộng đồng. Câu lạc bộ đã tổ chức nhiều hoạt động thiện nguyện, góp phần phổ cập bơi lội và phòng chống đuối nước.\"\n\nBuổi lễ cũng vinh danh các cá nhân xuất sắc của câu lạc bộ, trong đó có huấn luyện viên Nguyễn Văn A và vận động viên Trần Thị B.','../sk/TT.png',NULL,'Cát Tường','Giải Thưởng','2024-10-25 09:45:00',890,'2025-12-10 16:02:29','2025-12-10 16:14:05'),(6,NULL,'HNT Tổ Chức Giải Bơi Từ Thiện \"Vì Nụ Cười Trẻ Thơ\"','Giải bơi từ thiện quy tụ hơn 200 vận động viên, gây quỹ 500 triệu đồng cho trẻ em nghèo.','Ngày 10/11 vừa qua, Câu lạc bộ bơi lội HNT đã tổ chức thành công Giải bơi từ thiện \"Vì Nụ Cười Trẻ Thơ\" tại bể bơi Quận 1, TP.HCM.\n\nGiải đấu quy tụ hơn 200 vận động viên chuyên và không chuyên tham gia ở các cự ly 50m, 100m và 200m. Toàn bộ số tiền đăng ký và đóng góp từ các nhà tài trợ đã được chuyển đến Quỹ Bảo trợ Trẻ em Việt Nam.\n\n\"Chúng tôi tổ chức sự kiện này với mong muốn kết nối cộng đồng yêu thích bơi lội và cùng nhau làm những việc có ích cho xã hội. Thể thao không chỉ là thi đấu mà còn là sự sẻ chia.\" - Ông Trần Văn E, Trưởng ban tổ chức cho biết.\n\nNgoài phần thi đấu, sự kiện còn có nhiều hoạt động thú vị như: trình diễn bơi nghệ thuật, hướng dẫn kỹ năng cứu đuối, và gian hàng ẩm thực.\n\nGiải đấu đã nhận được sự ủng hộ nhiệt tình từ cộng đồng và hứa hẹn sẽ trở thành sự kiện thường niên của câu lạc bộ.','../sp_home/images/kid.jpg',NULL,'Anh Tuấn','Giải Đấu','2024-10-15 04:20:00',540,'2025-12-10 16:02:29','2025-12-10 16:22:06'),(7,NULL,'Phương Pháp Tập Luyện Hiện Đại Tại HNT Swim Club','Ứng dụng công nghệ cao trong huấn luyện giúp vận động viên cải thiện thành tích.','Câu lạc bộ bơi lội HNT mới đây đã đầu tư hệ thống công nghệ cao phục vụ công tác huấn luyện, bao gồm:\n\n1. Hệ thống phân tích chuyển động Underwater Camera: Ghi lại và phân tích từng động tác bơi dưới nước\n2. Thiết bị đo lực cản nước: Giúp tối ưu hóa tư thế bơi\n3. Phần mềm phân tích dữ liệu AI: Đưa ra gợi ý tập luyện cá nhân hóa\n\nHuấn luyện viên khoa học thể thao Phạm Thị F chia sẻ: \"Với công nghệ mới, chúng tôi có thể phân tích chi tiết từng động tác của vận động viên, phát hiện những điểm cần cải thiện mà mắt thường không nhìn thấy được.\"\n\nVận động viên Trần Thị B cho biết: \"Nhờ hệ thống camera dưới nước, tôi đã điều chỉnh được kỹ thuật vung tay, giúp cải thiện thành tích đáng kể.\"\n\nĐây là bước đi quan trọng trong chiến lược hiện đại hóa công tác đào tạo của HNT, hướng đến chuẩn quốc tế.\n\n\"Chúng tôi tin rằng đầu tư vào công nghệ là đầu tư vào tương lai của thể thao Việt Nam.\" - Ông Nguyễn Văn D khẳng định.','../sp_home/images/banner.png',NULL,'Hoàng Nam','Giải Đấu','2024-10-10 01:45:00',670,'2025-12-10 16:02:29','2025-12-10 16:22:06');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `athlete_awards`
--

DROP TABLE IF EXISTS `athlete_awards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `athlete_awards` (
  `award_id` int NOT NULL AUTO_INCREMENT,
  `athlete_id` int NOT NULL,
  `award_type` enum('gold','silver','bronze','record','other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'other',
  `award_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `competition_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`award_id`),
  KEY `athlete_id` (`athlete_id`),
  CONSTRAINT `athlete_awards_ibfk_1` FOREIGN KEY (`athlete_id`) REFERENCES `athletes` (`athlete_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `athlete_awards`
--

LOCK TABLES `athlete_awards` WRITE;
/*!40000 ALTER TABLE `athlete_awards` DISABLE KEYS */;
INSERT INTO `athlete_awards` VALUES (1,1,'gold','Huy chương Vàng','SEA Games 31 - 50m Tự do',2022,NULL,'2025-12-08 09:15:45'),(2,1,'silver','Huy chương Bạc','Vô địch Châu Á - 100m Tự do',2023,NULL,'2025-12-08 09:15:45'),(3,1,'record','Kỷ lục Câu lạc bộ','Giải Vô địch Quốc gia',2024,NULL,'2025-12-08 09:15:45'),(4,1,'gold','Huy chương Vàng','Cúp Quốc tế Hà Nội',2023,NULL,'2025-12-08 09:15:45'),(5,2,'gold','Huy chương Vàng','Vô địch Quốc gia - 100m Ngửa',2025,NULL,'2025-12-08 09:15:45'),(6,2,'record','Kỷ lục Quốc gia','100m Ngửa',2025,NULL,'2025-12-08 09:15:45'),(7,2,'silver','Huy chương Bạc','SEA Games 31 - 200m Ngửa',2022,NULL,'2025-12-08 09:15:45'),(8,2,'bronze','Huy chương Đồng','SEA Games 33 - 100m Ngửa',2025,NULL,'2025-12-08 09:15:45'),(9,3,'other','Tham dự Olympic','Thế vận hội Tokyo 2020',2021,NULL,'2025-12-08 09:15:45'),(10,3,'gold','Huy chương Vàng','SEA Games 32 - 400m Bơi Sải',2023,NULL,'2025-12-08 09:15:45'),(11,3,'bronze','Huy chương Đồng','Vô địch Đông Nam Á',2024,NULL,'2025-12-08 09:15:45'),(12,3,'gold','Huy chương Vàng','Giải Mở rộng Toàn quốc',2024,NULL,'2025-12-08 09:15:45');
/*!40000 ALTER TABLE `athlete_awards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `athletes`
--

DROP TABLE IF EXISTS `athletes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `athletes` (
  `athlete_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `achievements` text COLLATE utf8mb4_unicode_ci,
  `image_url` text COLLATE utf8mb4_unicode_ci,
  `nickname` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialty` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `age` int DEFAULT NULL,
  `detail_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `hometown` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `height_cm` int DEFAULT NULL,
  `weight_kg` int DEFAULT NULL,
  `contract_start` date DEFAULT NULL,
  `contract_end` date DEFAULT NULL,
  `competition_history` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`athlete_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `athletes`
--

LOCK TABLES `athletes` WRITE;
/*!40000 ALTER TABLE `athletes` DISABLE KEYS */;
INSERT INTO `athletes` VALUES (1,'Nguyễn Văn A','Đội trưởng đội tuyển, chuyên gia bơi tự do cự ly ngắn. Với phong cách bơi mạnh mẽ và kỹ thuật xuất sắc, anh là trụ cột không thể thiếu của đội.','Huy chương Vàng SEA Games 31 (50m Tự do)\nHuy chương Bạc Vô địch Châu Á (100m Tự do)\nKỷ lục Câu lạc bộ (50m Tự do)','A.png','The Anchor','Đội trưởng','Bơi Tự do 50m & 100m',25,'chitiet_tt1.html','2000-08-15','Hà Nội',185,80,'2023-01-01','2027-12-31',NULL),(2,'Trần Thị B','Nữ tuyển thủ xuất sắc chuyên bơi ngửa. Cô được mệnh danh là \"cơn sóng\" nhờ khả năng bơi nhịp nhàng và ổn định.','Huy chương Vàng Vô địch Quốc gia (100m Ngửa)\nHuy chương Bạc SEA Games 31 (200m Ngửa)\nKỷ lục Quốc gia 100m Ngửa','B.png','The Wave','Tuyển thủ chính','Bơi Ngửa 100m & 200m',22,'chitiet_tt2.html','2003-03-03','Đà Nẵng',170,58,'2022-07-01','2027-06-30',NULL),(3,'Lê Văn C','Tuyển thủ từng tham dự Olympic, chuyên gia bơi sải cự ly trung bình. Kinh nghiệm thi đấu quốc tế phong phú.','Tham gia Olympic Tokyo 2020\nHuy chương Vàng SEA Games 32 (400m Bơi Sải)\nHuy chương Đồng Vô địch Đông Nam Á','C.png','The Shark','Tuyển thủ Olympic','Bơi Sải 200m & 400m',25,'chitiet_tt3.html','1999-11-20','TP. Hồ Chí Minh',178,72,'2024-01-15','2027-01-14',NULL);
/*!40000 ALTER TABLE `athletes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `cart_item_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`cart_item_id`),
  UNIQUE KEY `uk_user_product` (`user_id`,`product_id`),
  KEY `fk_cartitems_products` (`product_id`),
  CONSTRAINT `fk_cartitems_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `fk_cartitems_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (28,7,3,1);
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `event_date` datetime NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `event_time` time DEFAULT '00:00:00',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Giải Bơi Mở Rộng Toàn Quốc 2025','Giải đấu lớn nhất năm với sự góp mặt của các vận động viên hàng đầu.','2026-01-17 00:00:00','Hồ bơi Yết Kiêu, TP.HCM','../sk/sk1.png','2025-12-07 13:27:06','08:00:00','2025-12-07 13:55:04'),(2,'Chương Trình Tập Huấn Kỹ Thuật Bơi Ngửa','Cập nhật: Giải đấu sẽ có thêm phần bơi tiếp sức.','2025-12-28 00:00:00','Hồ bơi Phú Thọ','../sk/sk2.png','2025-12-07 13:27:06','14:00:00','2025-12-10 16:49:22'),(3,'Giao Lưu Cộng Đồng Hè Vui Khỏe','Hoạt động bơi lội và trò chơi dưới nước dành cho các gia đình.','2025-06-01 00:00:00','Công viên Nước Hồ Tây, Hà Nội','../sk/sk3.png','2025-12-07 13:27:06','09:00:00','2025-12-07 13:28:14'),(4,'Giải Bơi Vô Địch CLB HNT Lần 1/2024','Giải đấu nội bộ chọn ra đội hình cho năm mới.','2024-12-15 00:00:00','Hồ bơi HNT','../sk/sk4.png','2025-12-07 13:27:06','08:30:00','2025-12-07 13:28:14'),(5,'Hội Thảo Dinh Dưỡng Cho VĐV Bơi Lội','Hội thảo về chế độ dinh dưỡng tối ưu cho vận động viên.','2024-11-05 00:00:00','Online qua Zoom','../sk/sk5.png','2025-12-07 13:27:06','19:00:00','2025-12-07 13:28:14'),(6,'Chương Trình Tập Huấn Kỹ Thuật Bơi Tự do','Buổi tập huấn chuyên sâu về kỹ thuật bơi Tự do với kỷ lục gia Nguyễn Văn A.','2026-01-20 00:00:00','CLB HNT, Thủ Đức','../sk/sk6.jpg','2025-12-09 13:27:06','14:00:00','2025-12-09 13:30:06');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `order_detail_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_detail_id`),
  KEY `fk_orderdetails_orders` (`order_id`),
  KEY `fk_orderdetails_products` (`product_id`),
  CONSTRAINT `fk_orderdetails_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `fk_orderdetails_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (1,1,1,2,350000.00),(2,2,1,1,350000.00),(3,3,1,1,350000.00),(4,3,2,1,150000.00),(5,4,5,1,600000.00),(6,5,5,1,600000.00),(7,6,1,1,350000.00),(8,6,4,1,180000.00),(9,7,1,1,350000.00),(10,8,1,1,350000.00);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,3,1,2,250000.00,'2025-12-07 19:07:34'),(2,3,2,1,200000.00,'2025-12-07 19:07:34');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `order_date` date NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','shipped','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `shipping_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `fk_orders_users` (`user_id`),
  CONSTRAINT `fk_orders_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,'2025-11-12',730000.00,'completed','Tên Mới Đổi','Địa chỉ mới 123','0999888777'),(2,1,'2025-11-13',380000.00,'completed','Test User Dat Hang','123 Duong ABC, Quan 1, TPHCM','0909090909'),(3,3,'2025-12-07',530000.00,'completed','yido','7698451 hn','12345678'),(4,3,'2025-12-08',630000.00,'pending','oko','7698451 hn','12345678'),(5,3,'2025-12-08',630000.00,'confirmed','jwj','7698451 hn','12345678'),(6,4,'2025-12-11',560000.00,'confirmed','phgngi','769 sg','0123456789'),(7,3,'2025-12-12',380000.00,'shipped','yido','7698451 hn','0123456789'),(8,7,'2025-12-14',380000.00,'pending','Trà My','909 tạ quang bửu','0934153165');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `payment_method` enum('momo','bank_transfer','cash') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_status` enum('pending','success','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`payment_id`),
  KEY `fk_payments_orders` (`order_id`),
  CONSTRAINT `fk_payments_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price_vnd` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `image_url` text COLLATE utf8mb4_unicode_ci,
  `image_url_2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Áo Thun CLB Mẫu Mới 2025','Áo','Áo thun thể thao thoáng khí, thấm hút tốt, màu sắc nhận diện của CLB. Form năng động, phù hợp cả khi tập luyện lẫn sinh hoạt hằng ngày.',350000.00,77,'images/ao1.jpg','images/ao2.jpg'),(2,'Nón bơi CLB HNT','Mũ','Nón silicone ôm sát đầu, giảm cản nước, bền và khó rách. In logo CLB sắc nét, giúp nhận diện đội trong các giải đấu.',150000.00,99,'images/non1.png','images/non.jpg'),(3,'Khăn tắm CLB HNT','Khăn','Khăn sợi microfiber mềm, thấm nước nhanh, khô nhanh. Thiết kế tối giản với điểm nhấn logo HNT, tiện cho thi đấu và tập luyện.',100000.00,100,'images/khan.jpg','images/khan2.png'),(4,'Bình nước CLB HNT - dung tích 1L','Bình Nước','Bình nhựa dung tích lớn 1 lít - Thiết kế thể thao, chống rò nước, có họa tiết HNT tạo cảm hứng cho mỗi buổi tập.',180000.00,99,'images/binh2.png','images/binh.jpg'),(5,'Áo Hoodie CLB HNT - mẫu mới 2025','Áo','Hoodie nỉ nhẹ, ấm nhưng không bí, in logo HNT nổi bật. Phù hợp mặc sau buổi bơi hoặc khi đi sự kiện, tạo cảm giác đồng đội mạnh mẽ.',600000.00,98,'images/hoodie.jpg','images/hoodie2.png');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `review_date` date NOT NULL DEFAULT (curdate()),
  PRIMARY KEY (`review_id`),
  KEY `fk_reviews_users` (`user_id`),
  KEY `fk_reviews_products` (`product_id`),
  CONSTRAINT `fk_reviews_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `fk_reviews_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `avatar_url` text COLLATE utf8mb4_unicode_ci,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT '1',
  `email_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testuser1@gmail.com','$2b$10$/4MlBcszH0aUwhIyUpFSiuDAhUYuAesEQ920/kFquSimhHZT.Wfqu','Test User',NULL,NULL,NULL,NULL,NULL,'user',1,0,'2025-12-07 16:28:13','2025-12-07 16:28:13'),(2,'admin@gmail.com','$2b$10$/VWpTh/hPzF0mP1RTcU70Oed4nOrL6YywREilBRSiKyrG7gHy7D3m','Test Admin',NULL,NULL,NULL,NULL,NULL,'admin',1,0,'2025-12-07 16:28:13','2025-12-07 16:28:13'),(3,'user@gmail.com','$2b$10$qwsNjZdrj3wTIOdA9Mc9.uB3S4WrZR9bOZDRjIIT5ubZ6qlh163K.','meo','0123456789','male',NULL,'Test Address',NULL,'user',1,0,'2025-12-07 16:28:13','2025-12-11 18:47:19'),(4,'phgngi.428@gmail.com','$2b$10$BVDimX.oqRxR0N8lKI1kZeMNp9WExLP53sugGa3MACjB64NOfDReq','Phuong Nghi Phan','0123456789','female',NULL,'',NULL,'user',1,0,'2025-12-07 16:28:13','2025-12-10 17:10:32'),(5,'user3@gmail.com','$2b$10$kkdjKDoXvOt7r1NYF2uy3OLKe0ijY5G20Y9V4fb4Yd550LJobsH.u','pn',NULL,NULL,NULL,NULL,NULL,'user',1,0,'2025-12-09 09:00:44','2025-12-09 09:40:14'),(6,'n23dcpt037@student.ptithcm.edu.vn','$2b$10$xKeDzX6lgWCx0KOkbzS3nubs81cFZoeLeSwRlgMGjk8iClmWKx72q','D23CQPT01-N PHAN PHUONG NGHI',NULL,NULL,NULL,NULL,NULL,'user',1,0,'2025-12-09 09:55:12','2025-12-09 09:55:12'),(7,'dothitramy33@gmail.com','$2b$10$3ne0qnMWdWXDekwNJn7bveK2xm8Do7eCEE1S/zwuRZfXJBbdnrI9G','Trà My',NULL,NULL,NULL,NULL,NULL,'user',1,0,'2025-12-14 10:31:17','2025-12-14 10:31:17');
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

-- Dump completed on 2025-12-15  3:46:46
