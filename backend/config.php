<?php
// backend/config.php

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'podcast_admin');

define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('THUMBNAIL_DIR', UPLOAD_DIR . 'thumbnails/');
define('AUDIO_DIR', UPLOAD_DIR . 'audio/');

define('MAX_THUMBNAIL_SIZE', 5 * 1024 * 1024);   // 5 MB
define('MAX_AUDIO_SIZE', 20 * 1024 * 1024);       // 20 MB
define('ALLOWED_THUMBNAIL_TYPES', ['image/jpeg', 'image/png', 'image/webp']);
define('ALLOWED_AUDIO_TYPES', ['audio/mpeg', 'audio/mp3']);

function get_db() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        http_response_code(500);
        die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

function send_json($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function send_error($message, $code = 400) {
    send_json(['error' => $message], $code);
}

// Ensure upload directories exist
if (!is_dir(THUMBNAIL_DIR)) mkdir(THUMBNAIL_DIR, 0755, true);
if (!is_dir(AUDIO_DIR))     mkdir(AUDIO_DIR, 0755, true);
