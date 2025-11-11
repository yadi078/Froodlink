<?php
// update_comida.php - Actualizar comida existente
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
$nombre_comida = $conn->real_escape_string($_POST['nombre_comida'] ?? '');
$precio = floatval($_POST['precio'] ?? 0);
$cantidad = intval($_POST['cantidad'] ?? 0);
$foto = $conn->real_escape_string($_POST['foto'] ?? '');
$descripcion = $conn->real_escape_string($_POST['descripcion'] ?? '');

if ($id_comida === 0) {
    echo json_encode(['success' => false, 'message' => 'ID de comida requerido']);
    exit;
}

if (empty($nombre_comida)) {
    echo json_encode(['success' => false, 'message' => 'Nombre de comida requerido']);
    exit;
}

if ($precio <= 0) {
    echo json_encode(['success' => false, 'message' => 'El precio debe ser mayor a 0']);
    exit;
}

if ($cantidad < 0) {
    echo json_encode(['success' => false, 'message' => 'La cantidad no puede ser negativa']);
    exit;
}

if (empty($foto)) {
    echo json_encode(['success' => false, 'message' => 'Foto requerida']);
    exit;
}

$stmt = $conn->prepare("UPDATE comidas SET nombre_comida = ?, precio = ?, cantidad = ?, foto = ?, descripcion = ? WHERE id_comida = ?");
$stmt->bind_param("sdissi", $nombre_comida, $precio, $cantidad, $foto, $descripcion, $id_comida);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Comida actualizada exitosamente'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No se encontró la comida o no hubo cambios'
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
