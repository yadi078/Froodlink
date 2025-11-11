<?php
// register.php - Registro de usuarios
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$nombre = $conn->real_escape_string($input['nombre'] ?? '');
$tipo = $conn->real_escape_string($input['tipo'] ?? '');
$correo = $conn->real_escape_string($input['correo'] ?? '');
$telefono = $conn->real_escape_string($input['telefono'] ?? '');
$edad = intval($input['edad'] ?? 0);
$contrasena = $input['contrasena'] ?? '';

// Validaciones
if (empty($nombre) || empty($tipo) || empty($correo) || empty($contrasena)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos obligatorios deben ser completados']);
    exit;
}

if (!in_array($tipo, ['estudiante', 'cocinero', 'otro'])) {
    echo json_encode(['success' => false, 'message' => 'Tipo de usuario inválido']);
    exit;
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Correo electrónico inválido']);
    exit;
}

$stmt = $conn->prepare("SELECT id_usuario FROM usuarios WHERE correo = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'El correo electrónico ya está registrado']);
    exit;
}

// Hash de la contraseña
$contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO usuarios (nombre, tipo, correo, telefono, edad, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssis", $nombre, $tipo, $correo, $telefono, $edad, $contrasena_hash);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Usuario registrado exitosamente'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error al registrar usuario: ' . $conn->error
    ]);
}

$stmt->close();
$conn->close();
?>
