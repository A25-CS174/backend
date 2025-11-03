-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 21, 2025
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `student_learning_db`
--

CREATE DATABASE IF NOT EXISTS `student_learning_db`;
USE `student_learning_db`;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(60) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `order_sequence` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `chapters`
--

CREATE TABLE `chapters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `order_sequence` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `subchapters`
--

CREATE TABLE `subchapters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `content_html` longtext NOT NULL,
  `content_css` text DEFAULT NULL,
  `is_editable` boolean DEFAULT false,
  `order_sequence` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_module_progress`
--

CREATE TABLE `user_module_progress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `progress` int(11) NOT NULL DEFAULT 0,
  `status` enum('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_module_unique` (`user_id`, `module_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `progress_history`
--

CREATE TABLE `progress_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `percentage` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `user_progress`
--

CREATE TABLE `user_progress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `subchapter_id` int(11) NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_subchapter_unique` (`user_id`, `subchapter_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subchapter_id`) REFERENCES `subchapters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `langganan`
-- --------------------------------------------------------

CREATE TABLE `langganan` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `deskripsi` TEXT,
  `status` ENUM('aktif', 'tidak_aktif') NOT NULL DEFAULT 'tidak_aktif',
  `valid_until` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Sample data
-- --------------------------------------------------------

INSERT INTO `users` (`name`, `city`, `email`, `password`)
VALUES ('firda', 'Depok', 'firda@example.com', '$2a$10$dummyhash');

INSERT INTO `langganan` (`user_id`, `title`, `deskripsi`, `status`, `valid_until`)
VALUES (1, 'Paket Premium', 'Akses penuh semua modul selama 30 hari', 'aktif', DATE_ADD(NOW(), INTERVAL 30 DAY));


-- --------------------------------------------------------

--
-- Sample Data for modules table
--

INSERT INTO `modules` (`title`, `description`, `order_sequence`) VALUES
('Pengenalan Web Development', 'Pelajari dasar-dasar pengembangan web dan teknologi yang digunakan.', 1),
('HTML dan CSS Fundamental', 'Kuasai fundamental HTML5 dan CSS3 untuk membangun website.', 2),
('JavaScript Dasar', 'Pelajari bahasa pemrograman JavaScript dan DOM manipulation.', 3),
('Responsive Web Design', 'Buat website yang responsif untuk berbagai ukuran layar.', 4),
('Web Performance & Optimization', 'Optimalkan performa website dan pengalaman pengguna.', 5),
('Web Accessibility', 'Buat website yang dapat diakses oleh semua pengguna.', 6);

--
-- Sample Data for chapters table
--

INSERT INTO `chapters` (`module_id`, `title`, `description`, `order_sequence`) VALUES
(1, 'Pengenalan Internet', 'Memahami cara kerja internet dan web', 1),
(1, 'Web Browser dan Web Server', 'Mengenal komponen utama web', 2),
(1, 'Tools Development', 'Persiapan alat pengembangan', 3),

(2, 'Struktur Dasar HTML', 'Mempelajari struktur dan sintaks HTML', 1),
(2, 'Semantic HTML', 'Penggunaan tag HTML yang bermakna', 2),
(2, 'CSS Styling', 'Dasar-dasar styling dengan CSS', 3),

(6, 'Pengantar Aksesibilitas', 'Memahami pentingnya aksesibilitas web', 1),
(6, 'ARIA dan HTML Semantik', 'Implementasi ARIA dan HTML yang aksesibel', 2),
(6, 'Pengujian Aksesibilitas', 'Cara menguji aksesibilitas website', 3);

--
-- Sample Data for subchapters table
--

INSERT INTO `subchapters` (`module_id`, `chapter_id`, `title`, `content`, `content_html`, `content_css`, `order_sequence`) VALUES
(6, 7, 'Apa Itu Aksesibilitas', 'Aksesibilitas web adalah praktik membuat website yang dapat diakses oleh semua orang, termasuk penyandang disabilitas.', 
'<div class="content">
  <h1>Apa Itu Aksesibilitas Web?</h1>
  <p>Aksesibilitas web mengacu pada praktik, pedoman, dan tools yang digunakan untuk membuat konten web dapat diakses oleh semua orang, termasuk:</p>
  <ul>
    <li>Penyandang tunanetra dan low vision</li>
    <li>Penyandang tunarungu</li>
    <li>Penyandang disabilitas motorik</li>
    <li>Penyandang disabilitas kognitif</li>
  </ul>
</div>',
'.content { padding: 20px; line-height: 1.6; }
.content h1 { color: #2c3e50; margin-bottom: 20px; }
.content ul { margin-left: 20px; }
.content li { margin: 10px 0; }',
1),

(6, 7, 'Mengapa Aksesibilitas Penting', 'Pentingnya membuat web yang inklusif dan dapat diakses semua orang',
'<div class="content">
  <h2>Mengapa Aksesibilitas Web Penting?</h2>
  <p>Ada beberapa alasan mengapa aksesibilitas web sangat penting:</p>
  <ol>
    <li>Kesetaraan akses informasi</li>
    <li>Kepatuhan hukum</li>
    <li>Manfaat bisnis</li>
    <li>Pengalaman pengguna yang lebih baik</li>
  </ol>
</div>',
'.content { padding: 20px; }
.content h2 { color: #34495e; }
.content ol { margin: 20px 0; }
.content li { margin: 10px 0; }',
2),

(6, 8, 'Pengenalan ARIA', 'Accessible Rich Internet Applications dan implementasinya',
'<div class="content">
  <h2>Pengenalan ARIA (Accessible Rich Internet Applications)</h2>
  <p>ARIA adalah spesifikasi teknis yang membantu membuat konten web dan aplikasi lebih aksesibel.</p>
  <div class="code-example">
    <pre><code>
&lt;button aria-label="Close dialog" aria-expanded="false"&gt;
  &lt;span class="icon"&gt;×&lt;/span&gt;
&lt;/button&gt;
    </code></pre>
  </div>
</div>',
'.content { padding: 20px; }
.code-example { background: #f8f9fa; padding: 15px; border-radius: 5px; }
pre { margin: 0; }
code { color: #e83e8c; }',
1);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;