-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 12, 2023 at 08:53 AM
-- Server version: 5.7.36
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ariana-gym`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
CREATE TABLE IF NOT EXISTS `attendance` (
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `uid` bigint(16) NOT NULL,
  PRIMARY KEY (`time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`time`, `uid`) VALUES
('2023-01-07 00:45:38', 1633887156299076),
('2023-01-07 01:05:29', 1633887156299076),
('2023-01-07 01:19:55', 1633887156299076),
('2023-01-07 01:30:27', 1633887156299076),
('2023-01-07 04:30:45', 1633887156299076),
('2023-01-08 01:06:35', 1633887156299076),
('2023-01-08 01:17:18', 1633887156299076),
('2023-01-08 01:48:45', 1633887156299076),
('2023-01-08 02:15:02', 1633887156299076),
('2023-01-08 02:27:24', 1633887156299076),
('2023-01-08 02:43:33', 1633887156299076),
('2023-01-08 02:54:44', 1633887156299076),
('2023-01-08 02:54:54', 1633887156299076),
('2023-01-08 02:57:01', 1633887156299076),
('2023-01-08 02:57:29', 1633887156299076),
('2023-01-08 02:57:38', 1633887156299076),
('2023-01-08 02:58:57', 1633887156299076),
('2023-01-08 03:00:03', 1633887156299076),
('2023-01-08 03:11:51', 1633887156299076),
('2023-01-08 03:24:10', 1633887156299076),
('2023-01-08 03:30:32', 1672990502431943),
('2023-01-08 03:49:51', 1672990502431943),
('2023-01-08 03:55:03', 1633887156299076),
('2023-01-08 04:03:19', 1672990502431943),
('2023-01-08 04:08:00', 1633887156299076),
('2023-01-08 04:20:24', 1672990502431943);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `uid` bigint(16) NOT NULL,
  `username` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dp` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `surname` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `last_payment` date NOT NULL,
  `expires` date NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `role` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'user',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `username`, `password`, `dp`, `surname`, `name`, `last_payment`, `expires`, `active`, `role`) VALUES
(1673228934942296, 'a.rambaranmishre', NULL, '1673228934942296.jpg', 'Rambaran Mishre', 'Anish', '2023-01-09', '2023-12-01', 1, 'user'),
(1673228696304400, 'w.ganesh', NULL, '1673228696304400.png', 'Ganesh', 'Wirash', '2023-01-09', '2023-02-01', 1, 'user');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
