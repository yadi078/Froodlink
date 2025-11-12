<?php
// config.php - Configuración de la base de datos
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// ============================================
// CARGAR CREDENCIALES DESDE ARCHIVO SEGURO
// ============================================
// Las credenciales se encuentran en database.config.php
// Este archivo NO debe estar en Git (.gitignore)
// ============================================

$configFile = __DIR__ . '/database.config.php';

// Verificar si existe el archivo de configuración
if (!file_exists($configFile)) {
    die(json_encode([
        'success' => false,
        'message' => 'Error: Archivo de configuración no encontrado. Copia database.config.example.php como database.config.php y configura tus credenciales.'
    ]));
}

// Cargar las credenciales desde el archivo de configuración
$dbConfig = require $configFile;

// Definir las constantes con los valores del archivo de configuración
define('DB_HOST', $dbConfig['DB_HOST']);
define('DB_USER', $dbConfig['DB_USER']);
define('DB_PASS', $dbConfig['DB_PASS']);
define('DB_NAME', $dbConfig['DB_NAME']);

// Conectar a la base de datos
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die(json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos'
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
