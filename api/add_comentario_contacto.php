<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

// 🔹 Importante: frontend envía 'email', pero BD usa 'correo'
$nombre = isset($data['nombre']) ? trim($data['nombre']) : '';
$correo = isset($data['email']) ? trim($data['email']) : '';
$asunto = isset($data['asunto']) ? trim($data['asunto']) : '';
$mensaje = isset($data['mensaje']) ? trim($data['mensaje']) : '';

if (empty($nombre) || empty($correo) || empty($asunto) || empty($mensaje)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son requeridos'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Correo inválido'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $sql = "INSERT INTO comentarios_contacto (nombre, correo, asunto, mensaje, fecha) 
            VALUES (?, ?, ?, ?, NOW())";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $nombre, $correo, $asunto, $mensaje);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Mensaje enviado exitosamente'
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al guardar el mensaje en la base de datos'
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

$conn->close();
?>
