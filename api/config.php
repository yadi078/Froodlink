<?php
// config.php - Configuración de la base de datos
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_USER', 'root'); // Cambiar por tu usuario de MySQL
define('DB_PASS', ''); // Cambiar por tu contraseña de MySQL
define('DB_NAME', 'FoodLink');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die(json_encode([
        'success' => false,
        'message' => 'Error de conexión: ' . $conn->connect_error
    ]));
}

$conn->set_charset("utf8mb4");

// Función para enviar respuesta JSON
function sendResponse($success, $data = [], $message = '') {
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message
    ] + $data);
    exit;
}
?>
