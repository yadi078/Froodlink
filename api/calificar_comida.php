<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$pedido_id = isset($data['pedido_id']) ? intval($data['pedido_id']) : 0;
$usuario_id = isset($data['usuario_id']) ? intval($data['usuario_id']) : 0;
$comida_id = isset($data['comida_id']) ? intval($data['comida_id']) : 0;
$calificacion = isset($data['calificacion']) ? intval($data['calificacion']) : 0;
$comentario = isset($data['comentario']) ? trim($data['comentario']) : '';

if ($pedido_id === 0 || $usuario_id === 0 || $comida_id === 0 || $calificacion < 1 || $calificacion > 5) {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Verificar si ya existe una calificación
    $check_sql = "SELECT id_calificacion FROM calificaciones WHERE pedido_id = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("i", $pedido_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Ya has calificado este pedido'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $sql = "INSERT INTO calificaciones (pedido_id, usuario_id, comida_id, calificacion, comentario, fecha) 
            VALUES (?, ?, ?, ?, ?, NOW())";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iiiis", $pedido_id, $usuario_id, $comida_id, $calificacion, $comentario);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Calificación enviada exitosamente'
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al guardar la calificación'
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
