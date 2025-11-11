<?php
// add_comentario.php - Agregar comentario a una comida
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$id_usuario = intval($_POST['id_usuario'] ?? 0);
$id_comida = intval($_POST['id_comida'] ?? 0);
$comentario = $conn->real_escape_string($_POST['comentario'] ?? '');

if ($id_usuario === 0 || $id_comida === 0 || empty($comentario)) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO comentarios (id_usuario, id_comida, comentario) VALUES (?, ?, ?)");
$stmt->bind_param("iis", $id_usuario, $id_comida, $comentario);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'id_comentario' => $conn->insert_id,
        'message' => 'Comentario agregado exitosamente'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error al agregar comentario: ' . $conn->error
    ]);
}

$stmt->close();
$conn->close();
?>
