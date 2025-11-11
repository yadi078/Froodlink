<?php
// update_estado_pedido.php - Actualizar estado de un pedido
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$id_pedido = intval($_POST['id_pedido'] ?? 0);
$estado = $conn->real_escape_string($_POST['estado'] ?? '');

if ($id_pedido === 0) {
    echo json_encode(['success' => false, 'message' => 'ID de pedido requerido']);
    exit;
}

$estados_validos = ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'];
if (!in_array($estado, $estados_validos)) {
    echo json_encode(['success' => false, 'message' => 'Estado inválido']);
    exit;
}

$stmt = $conn->prepare("UPDATE pedidos SET estado = ? WHERE id_pedido = ?");
$stmt->bind_param("si", $estado, $id_pedido);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Estado actualizado exitosamente'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No se encontró el pedido o no hubo cambios'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error al actualizar: ' . $conn->error
    ]);
}

$stmt->close();
$conn->close();
?>
