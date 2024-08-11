/*
SQLyog Trial v13.1.9 (64 bit)
MySQL - 8.0.30 : Database - users
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`users` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `users`;

/*Table structure for table `doctrine_migration_versions` */

DROP TABLE IF EXISTS `doctrine_migration_versions`;

CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8mb3_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Data for the table `doctrine_migration_versions` */

insert  into `doctrine_migration_versions`(`version`,`executed_at`,`execution_time`) values 
('DoctrineMigrations\\Version20240806204549','2024-08-06 23:46:16',9),
('DoctrineMigrations\\Version20240810153815','2024-08-10 18:38:31',34);

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `email` varchar(155) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `roles` json NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_8D93D649F85E0677` (`username`),
  UNIQUE KEY `UNIQ_8D93D649E7927C74` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Data for the table `user` */

insert  into `user`(`id`,`username`,`password`,`email`,`roles`) values 
(1,'ilya','$2y$13$HE4nnuCGhXyenWCN1CD0texRY/iA/r1jQRddB7GXwMLWS8Mxey1ku','ilya@example.com','[\"ROLE_USER\", \"ROLE_ADMIN\"]'),
(2,'test','$2y$10$4fMpxBHjIF3p3V/1mQU/Mey.8MfwS6BBja7OZtEr3GnQlkJIDB3fG','test@example.com','[\"ROLE_USER\"]'),
(7,'test2','$2y$13$AMFHzbJM42IIZ1805fjubuMUX33CVX0Piw2zJ1qzQ9ihbFgdSOkXy','test2@example.com','[\"ROLE_USER\"]'),
(8,'test3@example.com','$2y$13$eNq8jAJnz32Xq3OfkJfeS.A3x5uZzly1trIXUDsP8kLFCpawpI7QS','test3@example.com','[\"ROLE_USER\"]'),
(9,'test4','$2y$13$Zg/Z./ZyddCkPesF4SL6iexE9wn4FPVHWGm9NnMd8U175IDrs1ed.','test4@example.com','[\"ROLE_USER\"]');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
