DROP DATABASE IF EXISTS `q_a_db`;

DROP USER IF EXISTS 'q_a_db_admin'@'localhost';

CREATE DATABASE `q_a_db`;

CREATE USER 'q_a_db_admin'@'localhost' IDENTIFIED BY 'securepass';

GRANT ALL PRIVILEGES ON `q_a_db`.* TO 'q_a_db_admin'@'localhost';

FLUSH PRIVILEGES;

