<?php
// backend/api/index.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../config.php';

// Parse route from PATH_INFO or REQUEST_URI
$request_uri  = $_SERVER['REQUEST_URI'];
$script_name  = dirname($_SERVER['SCRIPT_NAME']);
$path         = str_replace($script_name, '', $request_uri);
$path         = strtok($path, '?');           // strip query string
$path         = trim($path, '/');
$parts        = explode('/', $path);          // e.g. ['podcasts', '5']
$method       = $_SERVER['REQUEST_METHOD'];

$resource = $parts[0] ?? '';
$id       = isset($parts[1]) && is_numeric($parts[1]) ? (int)$parts[1] : null;

if ($resource !== 'podcasts') {
    send_error('Not found', 404);
}

// ─── Route dispatch ────────────────────────────────────────────────────────

if ($method === 'GET' && $id === null) {
    // GET /podcasts?page=1&limit=9
    $page  = max(1, (int)($_GET['page']  ?? 1));
    $limit = max(1, (int)($_GET['limit'] ?? 9));
    $offset = ($page - 1) * $limit;

    $db = get_db();

    $total_row = $db->query("SELECT COUNT(*) AS cnt FROM podcasts")->fetch_assoc();
    $total     = (int)$total_row['cnt'];

    $stmt = $db->prepare(
        "SELECT * FROM podcasts ORDER BY created_at DESC LIMIT ? OFFSET ?"
    );
    $stmt->bind_param('ii', $limit, $offset);
    $stmt->execute();
    $result   = $stmt->get_result();
    $podcasts = [];
    while ($row = $result->fetch_assoc()) {
        $podcasts[] = $row;
    }
    $db->close();

    send_json([
        'podcasts'     => $podcasts,
        'total'        => $total,
        'page'         => $page,
        'limit'        => $limit,
        'total_pages'  => (int)ceil($total / $limit),
    ]);
}

if ($method === 'GET' && $id !== null) {
    // GET /podcasts/{id}
    $db   = get_db();
    $stmt = $db->prepare("SELECT * FROM podcasts WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $row  = $stmt->get_result()->fetch_assoc();
    $db->close();

    if (!$row) send_error('Podcast not found', 404);
    send_json($row);
}

if ($method === 'POST') {
    // POST /podcasts  (multipart/form-data)
    $title       = trim($_POST['title']       ?? '');
    $description = trim($_POST['description'] ?? '');

    // Validation
    if (!preg_match('/^[A-Za-z0-9 ]{3,255}$/', $title)) {
        send_error('Title must be 3–255 characters and contain only letters, numbers, and spaces.');
    }
    if (strlen($description) < 20) {
        send_error('Description must be at least 20 characters.');
    }

    $thumbnail_path = handle_upload('thumbnail', THUMBNAIL_DIR, ALLOWED_THUMBNAIL_TYPES, MAX_THUMBNAIL_SIZE);
    $audio_path     = handle_upload('audio_file', AUDIO_DIR, ALLOWED_AUDIO_TYPES, MAX_AUDIO_SIZE);

    $db   = get_db();
    $stmt = $db->prepare(
        "INSERT INTO podcasts (title, description, thumbnail, audio_file) VALUES (?, ?, ?, ?)"
    );
    $stmt->bind_param('ssss', $title, $description, $thumbnail_path, $audio_path);
    $stmt->execute();
    $new_id = $db->insert_id;
    $db->close();

    send_json(['message' => 'Podcast added successfully', 'id' => $new_id], 201);
}

if ($method === 'PUT' && $id !== null) {
    // PUT /podcasts/{id}  (multipart OR JSON)
    $raw = file_get_contents('php://input');

    // Try JSON first (for text-only updates)
    $json = json_decode($raw, true);
    if ($json) {
        $title       = trim($json['title']       ?? '');
        $description = trim($json['description'] ?? '');
    } else {
        // multipart — PHP doesn't parse PUT multipart, use POST override
        parse_str($raw, $put_data);
        $title       = trim($put_data['title']       ?? $_POST['title']       ?? '');
        $description = trim($put_data['description'] ?? $_POST['description'] ?? '');
    }

    if (!preg_match('/^[A-Za-z0-9 ]{3,255}$/', $title)) {
        send_error('Title must be 3–255 characters and contain only letters, numbers, and spaces.');
    }
    if (strlen($description) < 20) {
        send_error('Description must be at least 20 characters.');
    }

    $db = get_db();

    // Fetch existing record for optional file replacement
    $stmt = $db->prepare("SELECT thumbnail, audio_file FROM podcasts WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $existing = $stmt->get_result()->fetch_assoc();
    if (!$existing) { $db->close(); send_error('Podcast not found', 404); }

    $thumbnail_path = $existing['thumbnail'];
    $audio_path     = $existing['audio_file'];

    // If new files were sent (via _method=PUT trick)
    if (!empty($_FILES['thumbnail']['name'])) {
        $thumbnail_path = handle_upload('thumbnail', THUMBNAIL_DIR, ALLOWED_THUMBNAIL_TYPES, MAX_THUMBNAIL_SIZE);
    }
    if (!empty($_FILES['audio_file']['name'])) {
        $audio_path = handle_upload('audio_file', AUDIO_DIR, ALLOWED_AUDIO_TYPES, MAX_AUDIO_SIZE);
    }

    $stmt2 = $db->prepare(
        "UPDATE podcasts SET title=?, description=?, thumbnail=?, audio_file=?, updated_at=NOW() WHERE id=?"
    );
    $stmt2->bind_param('ssssi', $title, $description, $thumbnail_path, $audio_path, $id);
    $stmt2->execute();
    $db->close();

    send_json(['message' => 'Podcast updated successfully']);
}

if ($method === 'DELETE' && $id !== null) {
    // DELETE /podcasts/{id}
    $db   = get_db();
    $stmt = $db->prepare("SELECT thumbnail, audio_file FROM podcasts WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $row  = $stmt->get_result()->fetch_assoc();

    if (!$row) { $db->close(); send_error('Podcast not found', 404); }

    // Delete uploaded files
    $thumb = UPLOAD_DIR . ltrim($row['thumbnail'], '/');
    $audio = UPLOAD_DIR . ltrim($row['audio_file'], '/');
    if (file_exists($thumb)) @unlink($thumb);
    if (file_exists($audio)) @unlink($audio);

    $stmt2 = $db->prepare("DELETE FROM podcasts WHERE id = ?");
    $stmt2->bind_param('i', $id);
    $stmt2->execute();
    $db->close();

    send_json(['message' => 'Podcast deleted successfully']);
}

send_error('Method not allowed', 405);

// ─── Helper: file upload ────────────────────────────────────────────────────

function handle_upload($field, $dest_dir, $allowed_types, $max_size) {
    if (empty($_FILES[$field]) || $_FILES[$field]['error'] !== UPLOAD_ERR_OK) {
        send_error("File upload failed for field: $field");
    }

    $file      = $_FILES[$field];
    $mime_type = mime_content_type($file['tmp_name']);

    if (!in_array($mime_type, $allowed_types)) {
        send_error("Invalid file type for $field: $mime_type");
    }
    if ($file['size'] > $max_size) {
        send_error("File too large for $field. Max " . ($max_size / 1024 / 1024) . "MB.");
    }

    $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('', true) . '.' . strtolower($ext);
    $dest     = $dest_dir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        send_error("Could not save uploaded file: $field");
    }

    // Return relative path used in DB
    $rel = str_replace(UPLOAD_DIR, 'uploads/', $dest);
    return $rel;
}
