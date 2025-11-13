<?php
// get_comentarios.php - Obtener comentarios de una comida
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

$id_comida = intval($_GET['id_comida'] ?? 0);

if ($id_comida === 0) {
    echo json_encode([
        'success' => false,
        'message' => 'ID de comida requerido'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $conn->prepare("SELECT c.*, u.nombre FROM comentarios c INNER JOIN usuarios u ON c.id_usuario = u.id_usuario WHERE c.id_comida = ? ORDER BY c.fecha DESC");
$stmt->bind_param("i", $id_comida);
$stmt->execute();
$result = $stmt->get_result();

$comentarios = [];
while ($row = $result->fetch_assoc()) {
    $comentarios[] = $row;
}

echo json_encode([
    'success' => true,
    'comentarios' => $comentarios
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$stmt->close();
$conn->close();
?>
