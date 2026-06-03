-- ============================================
-- Podcast Admin Dashboard - Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS podcast_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE podcast_admin;

CREATE TABLE IF NOT EXISTS podcasts (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255)  NOT NULL,
    description TEXT          NOT NULL,
    thumbnail   VARCHAR(500)  NOT NULL,
    audio_file  VARCHAR(500)  NOT NULL,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample seed data
INSERT INTO podcasts (title, description, thumbnail, audio_file, created_at) VALUES
('The Wildlife Trusts - Wild About Wellbeing', 'Wild About Wellbeing is a podcast by The Wildlife Trusts. Here, we talk about all things to do with nature and health.', 'uploads/thumbnails/ima_03.png', 'uploads/audio/sample.mp3', '2026-09-12 10:00:00'),
('Surrey Wildlife Trust', 'From wildlife gardening to river restoration, episodes cover a range of nature themed topics and feature a wildlife experts.', 'uploads/thumbnails/ima_05.png', 'uploads/audio/sample.mp3', '2026-09-06 10:00:00'),
('Lancashire Wildlife Trust', 'Find out about new nature projects, how to care for wildlife and insights into a career in conservation.', 'uploads/thumbnails/ima_07.png', 'uploads/audio/sample.mp3', '2026-09-02 10:00:00'),
('Cornwall Wildlife Trust', 'Embark on an audio adventure as you travel from the rugged cliffs of Cornwall coastline to deep wooded valleys and everywhere in between.', 'uploads/thumbnails/ima_12.png', 'uploads/audio/sample.mp3', '2026-08-28 10:00:00'),
('Buckinghamshire and Oxfordshire Wildlife Trust', 'From ponds to swifts and letting your grass grow long, join us as we explore what wildlife gardening means.', 'uploads/thumbnails/ima_13.png', 'uploads/audio/sample.mp3', '2026-08-20 10:00:00'),
('Derbyshire Wildlife Trust', 'Explore Derbyshire wildlife and wild places from the River Erewash to the birds of the Dark Peak.', 'uploads/thumbnails/ima_14.png', 'uploads/audio/sample.mp3', '2026-08-12 10:00:00'),
('Essex Wildlife Trust', 'Welcome to The Wildlife Explorer, where we aim to inspire you with our work to protect the wildlife and wild spaces in Essex.', 'uploads/thumbnails/ima_18.png', 'uploads/audio/sample.mp3', '2026-08-05 10:00:00'),
('Nottinghamshire Wildlife Trust', 'This podcast features conversations with communities, volunteers and people who work in wonderful Sherwood Forest.', 'uploads/thumbnails/ima_19.png', 'uploads/audio/sample.mp3', '2026-07-26 10:00:00'),
('Dorset Wildlife Trust', 'Hear from our expert staff, trustees, volunteers and special guests about Dorset Wildlife Trust work to protect wildlife and wild places.', 'uploads/thumbnails/ima_20.png', 'uploads/audio/sample.mp3', '2026-07-17 10:00:00');
