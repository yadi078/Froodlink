<?php
// update_estado_pedido.php - Actualizar estado de un pedido
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido'], JSON_UNESCAPED_UNICODE);
    exit;
}

$id_pedido = intval($_POST['id_pedido'] ?? 0);
$estado = $conn->real_escape_string($_POST['estado'] ?? '');

if ($id_pedido === 0) {
    echo json_encode(['success' => false, 'message' => 'ID de pedido requerido'], JSON_UNESCAPED_UNICODE);
    exit;
}

$estados_validos = ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'];
if (!in_array($estado, $estados_validos)) {
    echo json_encode(['success' => false, 'message' => 'Estado inválido'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $conn->prepare("UPDATE pedidos SET estado = ? WHERE id_pedido = ?");
$stmt->bind_param("si", $estado, $id_pedido);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Estado actualizado exitosamente'
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No se encontró el pedido o no hubo cambios'
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error al actualizar: ' . $conn->error
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

$stmt->close();
$conn->close();
?>
