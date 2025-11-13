<?php
// delete_comida.php - Eliminar comida
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido'], JSON_UNESCAPED_UNICODE);
    exit;
}

$id_comida = intval($_POST['id_comida'] ?? 0);

if ($id_comida === 0) {
    echo json_encode(['success' => false, 'message' => 'ID de comida requerido'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $conn->prepare("DELETE FROM comidas WHERE id_comida = ?");
$stmt->bind_param("i", $id_comida);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Comida eliminada exitosamente'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error al eliminar: ' . $conn->error
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

$stmt->close();
$conn->close();
?>
