<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$nombre = isset($data['nombre']) ? trim($data['nombre']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$asunto = isset($data['asunto']) ? trim($data['asunto']) : '';
$mensaje = isset($data['mensaje']) ? trim($data['mensaje']) : '';

if (empty($nombre) || empty($email) || empty($asunto) || empty($mensaje)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son requeridos'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email inválido'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $sql = "INSERT INTO comentarios_contacto (nombre, correo, asunto, mensaje, fecha) 
            VALUES (?, ?, ?, ?, NOW())";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $nombre, $email, $asunto, $mensaje);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Mensaje enviado exitosamente'
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al enviar el mensaje'
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

$conn->close();
?>
