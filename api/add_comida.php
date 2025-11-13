<?php
// add_comida.php - Agregar nueva comida (solo cocineros)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido'], JSON_UNESCAPED_UNICODE);
    exit;
}

$id_cocinero = intval($_POST['id_cocinero'] ?? 0);
$nombre_comida = $conn->real_escape_string($_POST['nombre_comida'] ?? '');
$precio = floatval($_POST['precio'] ?? 0);
$cantidad = intval($_POST['cantidad'] ?? 0);
$foto = $conn->real_escape_string($_POST['foto'] ?? '');
$descripcion = $conn->real_escape_string($_POST['descripcion'] ?? '');

// Validaciones
if (empty($nombre_comida) || $precio <= 0 || $cantidad < 0 || empty($foto)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $conn->prepare("INSERT INTO comidas (nombre_comida, foto, precio, cantidad, id_cocinero, descripcion) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssdiss", $nombre_comida, $foto, $precio, $cantidad, $id_cocinero, $descripcion);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'id_comida' => $conn->insert_id,
        'message' => 'Comida agregada exitosamente'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error al agregar comida: ' . $conn->error
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

$stmt->close();
$conn->close();
?>
