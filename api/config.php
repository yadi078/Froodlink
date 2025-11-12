<?php
// config.php - Configuración de la base de datos

// ============================================
// HEADERS DE SEGURIDAD
// ============================================

// CORS - Para producción, cambiar * por el dominio específico
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Forzar HTTPS en producción (comentar para desarrollo local sin SSL)
// Descomentar estas líneas cuando se configure SSL/TLS
/*
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}
*/

// Headers de seguridad adicionales
header('Strict-Transport-Security: max-age=31536000; includeSubDomains'); // HSTS
header('X-Content-Type-Options: nosniff'); // Prevenir MIME sniffing
header('X-Frame-Options: DENY'); // Prevenir clickjacking
header('X-XSS-Protection: 1; mode=block'); // Protección XSS en navegadores antiguos
header('Referrer-Policy: strict-origin-when-cross-origin'); // Control de referrer

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
