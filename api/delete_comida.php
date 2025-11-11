<?php
// delete_comida.php - Eliminar comida
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$id_comida = intval($_POST['id_comida'] ?? 0);

if ($id_comida === 0) {
    echo json_encode(['success' => false, 'message' => 'ID de comida requerido']);
    exit;
}

$stmt = $conn->prepare("DELETE FROM comidas WHERE id_comida = ?");
$stmt->bind_param("i", $id_comida);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Comida eliminada exitosamente'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error al eliminar: ' . $conn->error
    ]);
}

$stmt->close();
$conn->close();
?>
