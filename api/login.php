<?php
// login.php - Inicio de sesión
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido'], JSON_UNESCAPED_UNICODE);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$correo = $conn->real_escape_string($input['correo'] ?? '');
$contrasena = $input['contrasena'] ?? '';

if (empty($correo) || empty($contrasena)) {
    echo json_encode(['success' => false, 'message' => 'Correo y contraseña son obligatorios'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $conn->prepare("SELECT id_usuario, nombre, tipo, correo, contrasena FROM usuarios WHERE correo = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas'], JSON_UNESCAPED_UNICODE);
    exit;
}

$user = $result->fetch_assoc();

// Verificar contraseña
if (!password_verify($contrasena, $user['contrasena'])) {
    echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas'], JSON_UNESCAPED_UNICODE);
    exit;
}

// No enviar la contraseña al cliente
unset($user['contrasena']);

echo json_encode([
    'success' => true,
    'user' => $user,
    'message' => 'Inicio de sesión exitoso'
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$stmt->close();
$conn->close();
?>
