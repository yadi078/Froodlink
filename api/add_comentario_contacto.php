<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Leer datos enviados en formato JSON
$data = json_decode(file_get_contents('php://input'), true);

// Sanitizar y validar datos
$nombre  = isset($data['nombre']) ? trim($data['nombre']) : '';
$correo  = isset($data['email']) ? trim($data['email']) : ''; // 'email' viene del frontend, pero el campo en DB es 'correo'
$asunto  = isset($data['asunto']) ? trim($data['asunto']) : '';
$mensaje = isset($data['mensaje']) ? trim($data['mensaje']) : '';

// Validar campos obligatorios
if (empty($nombre) || empty($correo) || empty($asunto) || empty($mensaje)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son requeridos']);
    exit;
}

// Validar formato del correo (se usa $correo, no $email)
if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Correo inválido']);
    exit;
}

try {
    // Consulta ajustada a los nombres reales de tu tabla
    $sql = "INSERT INTO comentarios_contacto (nombre, correo, asunto, mensaje, fecha) 
            VALUES (?, ?, ?, ?, NOW())";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $nombre, $correo, $asunto, $mensaje);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Mensaje enviado exitosamente'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al guardar el mensaje en la base de datos'
        ]);
    }

    $stmt->close();

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
